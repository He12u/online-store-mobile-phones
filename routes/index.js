const express = require("express");
const router = express.Router();
const routerUser = require("./routerUser");
const routerPublic = require("./routerPublic");
const routerProduct = require("./routerProduct");

const errorHandler = require("../middlewares/errorHandler");
const authentication = require("../middlewares/authentication");

// API Registration (Public)
router.use("/user", routerUser);
router.use("/public", routerPublic);

// API Registration (Private)
router.use(authentication);
router.use("/product", routerProduct);

router.use(errorHandler);

module.exports = router;
