const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const ErrorHandler = require("../utils/erroehandler");

//**************************************************************************************************** Token athorizzation middeleware  */
exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

   console.log(token)
   
  if (!token) {
    return next(new ErrorHandler("Please Login to access this resource.", 401));
  }
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await UserModel.findById(decodedData.id);
    next()
});

//**************************************************************************************************** Role athorizzation middleware */
exports.authorizeRoles = (...roles) => {
   return (req, res, next)=>{
     if(!roles.includes(req.user.role)){
      return  next(new ErrorHandler(`Role :${req.user.role} is not allowed to access this resource` , 403))
     }
     
        next()
     
   }
}
