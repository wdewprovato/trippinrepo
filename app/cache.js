// Declare variables ------------------------------------
const cache = {};
const { CACHE_TTL } = require("./config");

module.exports = {
    get: (key) => {
        if (cache[key] && (Date.now() - cache[key].timestamp < CACHE_TTL)) {
            return cache[key].data;
        }
        return null;
    },
    set: (key, data) => {
        cache[key] = { data, timestamp: Date.now() };
    },
    clear: () => {
        Object.keys(cache).forEach(key => delete cache[key]);
    },
    getAll: () => cache
};
