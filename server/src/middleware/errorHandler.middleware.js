// middlewares/errorHandler.js

function errorHandler(err, req, res, next) {
  console.error(err.stack || err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    errorCode: err.errorCode,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
}

module.exports = { errorHandler };
