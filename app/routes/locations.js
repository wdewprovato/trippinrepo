// Declare variables ------------------------------------
const express = require("express");
const router = express.Router();
const db = require("../database");

// Fetch all locations ------------------------------------
router.get("/api/locations", (req, res) => {
    db.all("SELECT * FROM locations ORDER BY created_at DESC", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ data: rows });
    });
});

// Add a new location ------------------------------------
router.post("/api/locations", (req, res) => {
    const { location, shortaddress, address, house, street, city, state, postcode, phone, website, wikidata, wikipedia, description, extra, type, option, status, region, destype } = req.body;
    if (!location) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const sql = `INSERT INTO locations 
    (location, shortaddress, address, house, street, city, state, postcode, phone, website, wikidata, wikipedia, description, extra, type, option, status, region, destype, created_at) 
    VALUES (?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`;
    const params = [location, shortaddress, address, house, street, city, state, postcode, phone, website, wikidata, wikipedia, description, extra, type, option, status, region, destype];

    db.run(sql, params, function (err) {
        if (err) {
            console.log("post to api/location errored :", err);
            return res.status(500).json({ error: err.message });
        }
        console.log("post to api/location succeeded :");
        res.json({ message: "Location added successfully", id: this.lastID });
    });
});

// Update a location ------------------------------------
router.put("/api/locations/:id", (req, res) => {
    const locationId = req.params.id;
    const { location, address, house, street, city, state, postcode, region, status, destype, type } = req.body;

    const sql = `UPDATE locations SET location = ?, address = ?, house = ?, street = ?, city = ?, state = ?, postcode = ?, region = ?, status = ?, destype = ?, type = ? WHERE id = ?`;
    const params = [location, address, house, street, city, state, postcode, region, status, destype, type, locationId];

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "Record not found" });
        }
        res.json({ message: "Record updated successfully", id: locationId });
    });
});

// Delete a location ------------------------------------
router.delete("/api/locations/:id", (req, res) => {
    const locationId = req.params.id;
    db.run("DELETE FROM locations WHERE id = ?", [locationId], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Record deleted successfully", id: locationId });
    });
});

module.exports = router;

