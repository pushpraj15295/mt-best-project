const ErrorHandler = require("../utils/erroehandler");
const catchAsyncError = require("../middleware/catchAsyncError");

const UserModel = require("../models/userModel");
const sendToken = require("../utils/jwtToken");

const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
// *****************************************************************************************signup user and dairect login-

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await UserModel.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is your avatar",
      url: "profile url",
    },
  });

  //    const token = user.getJWTToken();
  //    res.status(201).json({ success : true, token })
  sendToken(user, 201, res);
});

//****************************************************************************************** Login user */

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }
  //select for get the password bkz we hide the pass befor
  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  //if match pass
  //    const token = user.getJWTToken();
  //    res.status(200).json({ success : true, token , user})  ----- or use jwttoken function

  sendToken(user, 200, res);
});

//*****************************************************************************************************LOG OUT user */

exports.logout = catchAsyncError(async (req, res, next) => {
  //cleare token
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({ success: true, message: "Logged Out" });
});

//************************************************************************************************************ forgot password */

exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }
  // get resetpass token
  const resetToken = user.getResetPasswordToken();

  //saving resettoken
  await user.save({ validateBeforeSave: false });

  // send email to user
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n \n ${resetPasswordUrl} \n \n If you have not requested this email then ,Please ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Better-Buy Password Recovery`,
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email send to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});



// ******************************************************************************************** reset passwood /

exports.resetPassword = catchAsyncError(async (req, res, next) => {
  // creating token hash
     const resetPasswordToken = crypto
     .createHash("sha256")
     .update(req.params.token)
     .digest("hex");

     const user = await UserModel.findOne({
       resetPasswordToken,
       resetPasswordExpire:{ $gt : Date.now() }
     })

     if (!user) {
      return next(new ErrorHandler("reset password token is Invalid or has been expired", 404));
    }
    if(req.body.password !== req.body.confirmPassword) {
       return next(new ErrorHandler("pasword does not exit" ,400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    // for login again after change password
    sendToken(user , 200 , res);
})