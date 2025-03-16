function errorHandler(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    // JWT authentication error
    return res.status(401).json({
      success: false,
      message: 'Invalid token or no token provided'
    });
  }

  if (err.name === 'ValidationError') {
    // Validation error
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  // Default error
  return res.status(500).json({
    success: false,
    message: err.message
  });
}

export default errorHandler;
