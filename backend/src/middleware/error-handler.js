// Runs when any error happens
function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong' });
}

module.exports = errorHandler;
