const { User, Product } = require("../models");

const adminOnly = async (req, res, next) => {
  try {
    if (req.user.role === "admin") {
      next();
    } else {
      throw { name: "Forbiden" };
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { adminOnly };
