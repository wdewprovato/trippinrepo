// Declare variables ------------------------------------
const express = require("express");
const router = express.Router();
const db = require("../database");

// API Route: Fetch all states ------------------------------------
router.get("/api/states", (req, res) => {
    const sql = "SELECT stateabbr, statelong FROM states ORDER BY statelong";

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ data: rows });
    });
});

module.exports = router;
