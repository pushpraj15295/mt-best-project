const ErrorHandler = require("../utils/erroehandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server Error";
  

   // handle wrong mongodb Id or URl error
    if(err.name === "CastError"){
      const message = `Resource not found. Invalid : ${err.path}`
      err = new ErrorHandler(message,400)
    }
   //else
  res.status(err.statusCode).json({
    success: false,
    message: err.message || err.stack,
  });
};
