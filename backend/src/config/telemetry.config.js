const telemetryConfig = {
  tickIntervalMs: 1000,
  maxSamples: 100,
  returnEveryTicks: 5,
  returnFraction: 0.5,
  maxDeviationPercent: 10,
  stepPercentMin: 1,
  stepPercentMax: 3,

  parameters: {
    velocity: {
      base: 185.4,
      unit: 'cm/s',
    },
    pressure: {
      base: 1012,
      unit: 'mbar',
    },
    temperature: {
      base: 36.8,
      unit: '°C',
    },
  },
};

module.exports = telemetryConfig;