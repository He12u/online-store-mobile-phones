const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const authentication = require("../middlewares/authentication");
const { adminOnly } = require("../middlewares/authorization");
const productController = require("../controllers/productContoller");

router.get("/lists", productController.publicProducts);
router.post(
  "/create",
  adminOnly,
  upload.single("thumbnail"),
  productController.addProduct
);
router.get("/:id", productController.publicProductById);
router.put(
  "/:id/update",
  adminOnly,
  upload.single("thumbnail"),
  productController.updateProduct
);
router.delete("/:id/delete", adminOnly, productController.deleteProduct);

module.exports = router;
