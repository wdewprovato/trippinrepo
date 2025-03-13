// Declare variables ------------------------------------
const path = require("path");

// Global config ------------------------------------
module.exports = {
    CACHE_TTL: 300000, // Cache expires in 5 minutes (300,000 ms)
    PUBLIC_DIR: path.join(__dirname, "../site/dist"),
    NODE_MODULES_DIR: path.join(__dirname, "../node_modules"),
};
