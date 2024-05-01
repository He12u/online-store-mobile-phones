const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const authentication = require("../middlewares/authentication");
const userController = require("../controllers/userController");

router.post("/registration", userController.registration);
router.post("/login", userController.login);
// below need authentication
router.get("/profile", authentication, userController.profile);
router.put("/profile/update", authentication, userController.profileUpdate);
router.patch(
  "/profile/image",
  authentication,
  upload.single("profile_image"),
  userController.profileImage
);

module.exports = router;
