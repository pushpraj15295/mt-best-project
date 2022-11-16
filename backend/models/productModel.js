const { Schema, model, default: mongoose } = require("mongoose");

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "please Enter product Name"],
    trim: true,
  },
  discription: { type: String, required: [true, "please Enter descreption"] },
  price: {
    type: Number,
    required: [true, "please Enter price"],
    maxLength: [8, "price cannot exceed 8 characters"],
  },
  rating: { type: Number, default: 0 },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: { type: String, required: [true, "please Enter product category"] },
  Stock: {
    type: Number,
    required: [true, "Please enter product stock"],
    maxLength: [4, "Stock cannot exceed 4 characters"],
    default: 1,
  },
  numOfReview : { 
     type : Number,
     default:0
  },
  review:[
     {
        name : {
            type : String,
            required : true,
        },
        rating :{
            type : Number,
            required : true,
        },
        comment : {
            type : String,
            required : true,
        }
     }
  ],
  user :{
    type : mongoose.Schema.ObjectId,
    ref : "User",
    required : true,
  },
  createdAt : { 
     type : Date,
     default : Date.now
  }
});

const productModel = model("product", productSchema);

module.exports = productModel;
