// Declare variables -----------------------------------
const express = require("express");
const router = express.Router();
const cache = require("../cache");

// API Route: Output all cached data for debugging -----------------------------------
router.get("/api/cache", (req, res) => {
    console.log("Current cache contents:", cache.getAll());
    res.json(cache.getAll());
});

// API Route: Clear Cache -----------------------------------
router.delete("/api/cache", (req, res) => {
    cache.clear();
    console.log("Cache cleared.");
    res.json({ message: "Cache cleared successfully." });
});

module.exports = router;
