const sendError = (err, res) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';
  const message = err.isOperational ? err.message : 'Something went very wrong!';
  
  if (process.env.NODE_ENV === 'development') {
    return res.status(statusCode).json({
      status: status,
      message: err.message,
      error: err,
      stack: err.stack 
    });
  }
  
  res.status(statusCode).json({
    status: status,
    message: message
  });
};

const globalErrorHandler = (err, req, res, next) => {
  console.error('SERVER ERROR 💥', err);
  sendError(err, res);
};

export default globalErrorHandler;