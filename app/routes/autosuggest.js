// Declare variables ------------------------------------
const express = require("express");
const axios = require("axios");
const router = express.Router();
const cache = require("../cache");
const logger = require("../logger");

// API Route: Fetch address suggestions with logging ------------------------------------
router.get("/api/autosuggest", async (req, res) => {
    const query = req.query.q;
    const timestamp = new Date().toISOString();

    if (!query) {
        logger.warn(`[${timestamp}] Auto-suggest request missing 'q' parameter`);
        return res.status(400).json({ error: "Missing query parameter 'q'" });
    }

    // Check cache
    const cachedResult = cache.get(query);
    if (cachedResult) {
        logger.info(`[${timestamp}] Cache hit: Auto-suggest for "${query}"`);
        return res.json(cachedResult);
    }

    try {
        logger.info(`[${timestamp}] Fetching auto-suggestions for "${query}" from OpenStreetMap`);
        const response = await axios.get("https://nominatim.openstreetmap.org/search", {
            params: { q: query, format: "json", addressdetails: 1, limit: 5 },
            headers: { "User-Agent": "tRippin/0.1 (your@email.com)" }
        });

        if (response.data.length === 0) {
            logger.warn(`[${timestamp}] No results found for "${query}"`);
            return res.status(404).json({ error: "No address found" });
        }

        cache.set(query, response.data);
        logger.info(`[${timestamp}] Cached auto-suggest results for "${query}"`);

        res.json(response.data);
    } catch (error) {
        logger.error(`[${timestamp}] Auto-suggest error for "${query}": ${error.message}`);
        res.status(500).json({ error: "Error fetching location data" });
    }
});

module.exports = router;
