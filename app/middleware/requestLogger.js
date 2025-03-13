// Declare variables -----------------------------------
const morgan = require("morgan");
const logger = require("../logger");

// Define custom Morgan format with timestamps -----------------------------------
const requestLogger = morgan((tokens, req, res) => {
    return [
        new Date().toISOString(),
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens["response-time"](req, res), "ms"
    ].join(" ");
}, { stream: { write: (message) => logger.info(message.trim()) } });

module.exports = requestLogger;
