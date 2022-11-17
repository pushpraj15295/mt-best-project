const ErrorHandler = require("../utils/erroehandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server Error";

  // handle wrong mongodb Id or URl error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid : ${err.path}`;
    err = new ErrorHandler(message, 400);
  }
  // mongoose duplicate key erorr
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Enterd.`;

    err = new ErrorHandler(message, 400);
  }

  // Error - wrong JWT
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is Invalid , Try Again`;
    err = new ErrorHandler(message, 400);
  }
  // jwt expired error
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is Expired , Try Again`;
    err = new ErrorHandler(message, 400);
  }

  //else
  res.status(err.statusCode).json({
    success: false,
    message: err.message || err.stack,
  });
};
