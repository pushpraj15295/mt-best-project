const productModule = require("../models/productModel");
const ErrorHandler = require("../utils/erroehandler");

// ****************************************************************************************************************** PRODUCTS  ***/

//create products -by  ADMIN
exports.createProduct = async (req, res, next) => {
  const product = await productModule.create(req.body);

  res.status(200).json({ success: true, product });
};

//get All product
exports.getAllProduct = async (req, res) => {
  const products = await productModule.find();
  res.status(200).json({
    success: true,
    products,
  });
};

// get product details OR single product by ID
exports.getProductDetails = async (req, res, next) => {
  let product = await productModule.findById(req.params.id);
  if (!product) {
    // return res.status(500).json({ success: false, message: "Product not found" });
    return next(new ErrorHandler("Product not found", 404));
  } else {
    res.status(200).json({ success: true, product });
  }
};

// update product - admin
exports.updateProduct = async (req, res, next) => {
  let product = await productModule.findById(req.params.id);
  if (!product) {
    return res
      .status(500)
      .json({ success: false, message: "Product not found" });
  } else {
    product = await productModule.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({ success: true, product });
  }
};

//delete product - by Admin
exports.deleteProduct = async (req, res, next) => {
  let product = await productModule.findById(req.params.id);
  if (!product) {
    return res
      .status(500)
      .json({ success: false, message: "Product not found" });
  } else {
    await product.remove();

    res
      .status(200)
      .json({ success: true, message: "Product removed successfully" });
  }
};
