const express = require("express");
const { getAllProduct,createProduct, updateProduct, deleteProduct, getProductDetails } = require("../controllers/productController");
const router = express.Router()



router.route("/products").get(getAllProduct);
router.route("/product/new").post(createProduct);
router.route("/product/:id").put(updateProduct)
router.route("/product/:id").delete(deleteProduct)
router.route("/product/:id").get(getProductDetails)
//or ***** BKZ same path you can use ----> router.route("/product/:id").put(updateProduct).delete(deleteProduct).get(getProductDetails)


module.exports = router;