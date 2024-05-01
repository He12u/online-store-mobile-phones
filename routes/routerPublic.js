const express = require("express");
const productController = require("../controllers/productContoller");
const router = express.Router();

router.get("/products", productController.publicProducts);
router.get("/products/:id", productController.publicProductById);

module.exports = router;
