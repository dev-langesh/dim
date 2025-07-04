class AppError extends Error {
  constructor({errorCode, message, statusCode = 500}) {
    super(message || "An unexpected error occurred");
    this.errorCode = errorCode || 5000; // Default to 5000 if no code is provided
    this.message = message || "An unexpected error occurred";
    this.statusCode = statusCode;
  }
}

module.exports = { AppError };
