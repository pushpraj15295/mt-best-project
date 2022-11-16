const ErrorHandler = require("../utils/erroehandler");
const catchAsyncError = require("../middleware/catchAsyncError");

const UserModel = require("../models/userModel");
const sendToken = require("../utils/jwtToken");

// *****************************************************************************************signup user and dairect login-

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await UserModel.create({ name, email, password,
    avatar: {
      public_id: "this is your avatar",
      url: "profile url",
    },
  });

//    const token = user.getJWTToken();
//    res.status(201).json({ success : true, token })
       sendToken(user,201,res)
});



//****************************************************************************************** Login user */

exports.loginUser = catchAsyncError(async (req, res)=>{

    const {email,password} = req.body;
    if(!email || !password){
        return next(new ErrorHandler("Please Enter Email & Password" , 400))
    }
                                //select for get the password bkz we hide the pass befor
    const user = await UserModel.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid email or password",401));
    }
   
        const isPasswordMatched = user.comparePassword(password);

        if(!isPasswordMatched){
            return next(new ErrorHandler("Invalid email or password",401));
        }

   //if match pass
//    const token = user.getJWTToken();
//    res.status(200).json({ success : true, token , user})  ----- or use jwttoken function

     sendToken(user,200,res)

})