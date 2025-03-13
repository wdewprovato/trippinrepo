// Declare variables ------------------------------------
const express = require("express");
const path = require("path");
const router = express.Router();
const { PUBLIC_DIR, NODE_MODULES_DIR } = require("../config");

// Serve static files
router.use(express.static(PUBLIC_DIR));
router.use("/libs", express.static(NODE_MODULES_DIR));

// Serve .html files even when extension is omitted ------------------------------------
router.use((req, res, next) => {
    let filePath = path.join(PUBLIC_DIR, req.path + ".html");
    if (req.path !== "/" && req.path.indexOf(".") === -1) {
        res.sendFile(filePath, (err) => {
            if (err) next();
        });
    } else {
        next();
    }
});

// Default route to serve index.html ------------------------------------
router.get("/", (req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

module.exports = router;
