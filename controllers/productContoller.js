const { User, Product } = require("../models");
const { Op } = require("sequelize");
const cloudinary = require("cloudinary");
const uuid = require("crypto").randomUUID();
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

class productController {
  static async publicProducts(req, res, next) {
    try {
      let { search, sort, page = 1 } = req.query;
      const limit = 10;
      let queryOption = {};
      // sort by price
      if (sort) {
        if (sort === "ASC") {
          queryOption.order = [["price", sort]];
        } else if (sort === "DESC") {
          queryOption.order = [["price", sort]];
        }
      }
      // search by product name
      if (search) {
        queryOption.where = {
          name: {
            [Op.iLike]: `%${search}%`,
          },
        };
      }
      // pagination
      if (page) {
        if (!Number(page)) {
          page = 1;
        }
        queryOption.limit = limit;
        queryOption.offset = (page - 1) * limit;
      }

      const { count, rows } = await Product.findAndCountAll(queryOption);
      const productLists = {
        total: count,
        size: limit,
        totalPage: Math.ceil(count / limit),
        currentPage: page,
        data: rows,
      };
      res.status(200).json(productLists);
    } catch (error) {
      next(error);
    }
  }

  static async publicProductById(req, res, next) {
    try {
      let { id } = req.params;
      let findProduct = await Product.findByPk(id);

      if (!findProduct) {
        throw { name: "NotFound" };
      }
      res.status(200).json(findProduct);
    } catch (error) {
      next(error);
    }
  }

  static async addProduct(req, res, next) {
    try {
      let { name, description, excerpt, price } = req.body;
      const { id } = req.user;

      if (!req.file) {
        throw { name: "thumbnail_image required" };
      }

      if (
        req.file.mimetype !== "image/jpeg" &&
        req.file.mimetype !== "image/png"
      ) {
        throw { name: "invalid file format" };
      }

      const imgBase64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${imgBase64}`;
      const result = await cloudinary.v2.uploader.upload(dataURI, {
        folder: "tht",
        public_id: `${req.file.originalname}-${uuid}`,
      });

      const urlFile = result.secure_url;

      await Product.create({
        name,
        description,
        excerpt,
        price,
        thumbnail: urlFile,
        authorId: id,
      });
      res.status(201).json({ message: "The product was successfully added" });
    } catch (error) {
      next(error);
    }
  }
  // end product controller
}

module.exports = productController;
