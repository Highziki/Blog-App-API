const globalErrHandler = (err, req, res, next) => {
  // Status, message, stack,
  const { message, stack } = err;
  const status = err.status ? err.status : 'Failed';
  const statusCode = err.statusCode ? err.statusCode : 500;

  // Send response
  res.status(statusCode).json({ message, status, stack });
};

module.exports = globalErrHandler;
