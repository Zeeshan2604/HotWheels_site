function errorHandler(err, req, res, next) {
  let status = 500;
  let message = "An unexpected error occurred";

  if (err.name === "UnauthorizedError") {
    status = 401;
    message = "The user is not authorized.";
  } else if (err.name === "ValidationError") {
    status = 400;
    message = err.message;
  }

  console.error("Error:", err);

  res.status(status).json({
    success: false,
    error: {
      message: message,
      status: status,
    },
  });
}

export default errorHandler;
