const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const authentication = require("../middlewares/authentication");
const productController = require("../controllers/productContoller");

router.get("/lists", productController.publicProducts);
router.post(
  "/addProduct",
  authentication,
  upload.single("thumbnail"),
  productController.addProduct
);
router.get("/:id", productController.publicProductById);

module.exports = router;
