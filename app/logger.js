// Declare variables ------------------------------------
const winston = require("winston");
const path = require("path");

// Define log format with timestamps ------------------------------------
const logFormat = winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Create Logger ------------------------------------
const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        logFormat
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: path.join(__dirname, "logs", "app.log") })
    ],
});

module.exports = logger;
