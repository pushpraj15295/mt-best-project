const productModule = require("../models/productModel");
const ErrorHandler = require("../utils/erroehandler");
//for try catch wright again and again using catchAsyncError
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apifeatures");

//**************************************************************************************create products -by  ADMIN
exports.createProduct = catchAsyncError(async(req, res, next) => {
  
  req.body.user = req.user.id;      //saving data for how create data for - ref
  const product = await productModule.create(req.body);

  res.status(200).json({ success: true, product });
})

//***************************************************************************************get All product
exports.getAllProduct = catchAsyncError(async (req, res) => {
  const resultPer_page = 8;
  const productCount = await productModule.countDocuments();
  //filter search functonality
 const apiFeature = new ApiFeatures(productModule.find(),req.query).search().filter().pagination(resultPer_page)

  //get all products
  // const products = await productModule.find();
  const products = await apiFeature.query;
  res.status(200).json({
    success: true,
    products,
    productCount
  });
})

// ***************************************************************************************get product details OR single product by ID
exports.getProductDetails = catchAsyncError(async (req, res, next) => {
  let product = await productModule.findById(req.params.id);
  if (!product) {
    // return res.status(500).json({ success: false, message: "Product not found" });
    return next(new ErrorHandler("Product not found", 404));
  } else {
    res.status(200).json({ success: true, product });
  }
})

//***************************************************************************************** */ update product - admin
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await productModule.findById(req.params.id);
  if (!product) {
     return next(new ErrorHandler("Product not found", 404));
  } else {
    product = await productModule.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({ success: true, product });
  }
})

//***************************************************************************************************delete product - by Admin
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  let product = await productModule.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  } else {
    await product.remove();

    res
      .status(200)
      .json({ success: true, message: "Product removed successfully" });
  }
})


//***********************************************************************************************Create New Review or Update the review */