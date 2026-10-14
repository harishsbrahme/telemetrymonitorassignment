const express = require('express');
const cors = require('cors');
const dashboardRoutes = require('./routes/dashboard.routes');
const healthRoutes = require('./routes/health.routes');
const notFound = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler');

const app = express();

// Allow the Angular app and Electron to call this API
app.use(cors());
app.use(express.json());

app.use('/api', dashboardRoutes);
app.use('/api', healthRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
