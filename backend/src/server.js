require('dotenv').config();

const app = require('./app');
const { startSimulation } = require('./services/simulation.service');

const port = process.env.PORT || 3000;

startSimulation();

app.listen(port, function () {
  console.log('Server running on port ' + port);
});
