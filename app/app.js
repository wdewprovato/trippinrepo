// Declare variables ------------------------------------
const express = require("express");
const cors = require("cors");
const requestLogger = require("./middleware/requestLogger");

const app = express();

// Middleware ------------------------------------
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Import Routes ------------------------------------
const autoSuggestRoutes = require("./routes/autosuggest");
const findLocationRoutes = require("./routes/findlocation");
const cacheRoutes = require("./routes/cacheRoutes");
const locationRoutes = require("./routes/locations");
const stateRoutes = require("./routes/states");
const staticRoutes = require("./routes/static");

// Use Routes ------------------------------------
app.use(autoSuggestRoutes);
app.use(cacheRoutes);
app.use(locationRoutes);
app.use(findLocationRoutes);
app.use(stateRoutes);
app.use(staticRoutes);

module.exports = app;