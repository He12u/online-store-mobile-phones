const express = require("express");
const router = express.Router();

const errorHandler = require("../middlewares/errorHandler");
const authentication = require("../middlewares/authentication");

const userController = require("../controllers/userController");
const productController = require("../controllers/productContoller");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// API Registration (Public)
router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.get("/public/products", productController.publicProducts);
router.get("/public/products/:id", productController.publicProductById);

// API Registration (Private)
router.use(authentication);
router.get("/profile", userController.profile);
router.put("/profile/update", userController.profileUpdate);
router.put(
  "/profile/image",
  upload.single("profile_image"),
  userController.profileImage
);

router.use(errorHandler);

module.exports = router;
