// Declare variables -----------------------------------
const express = require("express");
const axios = require("axios");
const router = express.Router();
const cache = require("../cache");
const logger = require("../logger");

// API Route: Find location with logging -----------------------------------
router.get("/api/findlocation", async (req, res) => {
    const query = req.query.q;

    if (!query) {
        logger.warn("Find location request missing 'q' parameter");
        return res.status(400).json({ error: "Missing query parameter 'q'" });
    }

    const cachedResult = cache.get(query);
    if (cachedResult) {
        logger.info(`Cache hit: Find location for "${query}"`);
        return res.json(cachedResult);
    }

    try {
        logger.info(`Fetching location for "${query}" from OpenStreetMap`);
        const response = await axios.get("https://nominatim.openstreetmap.org/search", {
            params: { q: query, format: "json", addressdetails: 1, limit: 1 },
            headers: { "User-Agent": "tRippin/0.1 (your@email.com)" }
        });

        if (response.data.length === 0) {
            logger.warn(`No location found for "${query}"`);
            return res.status(404).json({ error: "No address found" });
        }

        const result = response.data[0];
        const locationData = {
            address: result.display_name,
            houseNumber: result.address.house_number || "",
            street: result.address.road || "",
            city: result.address.city || result.address.town || result.address.village || "",
            state: result.address.state || "",
            postcode: result.address.postcode || ""
        };

        cache.set(query, locationData);
        logger.info(`Cached find location results for "${query}"`);

        res.json(locationData);
    } catch (error) {
        logger.error(`Find location error for "${query}": ${error.message}`);
        res.status(500).json({ error: "Error fetching location data" });
    }
});

module.exports = router;
