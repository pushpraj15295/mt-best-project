const { Schema, model } = require("mongoose");

//for validate email i - validator
const validator = require("validator");
// for incrypt password
const bcrypt = require("bcryptjs");
//jwt token
const jwt = require("jsonwebtoken");

//******************************************************************   User - Schema     */
const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "please Enter Your name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [3, "Name should have more then 2 charactors"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email address"],
    unique: true,
    validate: [validator.isEmail, "Please enter Valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [8, "password must be at least 8 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

//************************************************************************passord pre incrypt */
UserSchema.pre("save", async function (next) {
  //for change password
  if(!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//************************************************************************* JWT token */
UserSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};


//*************************************************************************comparePassword */
UserSchema.methods.comparePassword = async function(enterPassword){
   return await bcrypt.compare(enterPassword , this.password);
}
//******************************************************* */
const UserModel = model("User", UserSchema);

module.exports = UserModel;

//select false - find karne se bhi result nhi dega user ka pass
