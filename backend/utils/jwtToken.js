//creting token and save into the cookie data

const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  //option for cookie storage

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  }

   res.status(statusCode).cookie("token",token , options).json({ 
      success: true,
      user,
      token
   })
};


module.exports = sendToken;
