const { comparePassword, hashPassword } = require("../helpers/bcrypt");
const { createToken } = require("../helpers/jwt");
const { User } = require("../models");
const cloudinary = require("cloudinary");
const uuid = require("crypto").randomUUID();
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

class userController {
  static async registration(req, res, next) {
    try {
      let { email, full_name, password } = req.body;

      await User.create({
        email,
        full_name,
        password,
      });

      res.status(200).json({
        message: "Registration Successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email) {
        throw { name: "email required" };
      } else if (!password) {
        throw { name: "password required" };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        throw { name: "invalid email format" };
      }

      const findUser = await User.findOne({
        where: {
          email,
        },
        attributes: { exclude: ["id", "createdAt", "updatedAt"] },
      });

      if (!findUser) {
        throw { name: "Unauthorized" };
      }

      const validatePassword = comparePassword(password, findUser.password);

      if (!validatePassword) {
        throw { name: "Unauthorized" };
      }

      const access_token = createToken({
        email: findUser.email,
        expiration: Math.floor(Date.now() / 1000) + 12 * 60 * 60,
      });

      res.status(200).json({
        message: "Login Successfully",
        access_token,
      });
    } catch (error) {
      next(error);
    }
  }

  static async profile(req, res, next) {
    try {
      const { email } = req.user;
      const findUser = await User.findOne({
        where: {
          email,
        },
        attributes: { exclude: ["id", "password", "createdAt", "updatedAt"] },
      });

      res.status(200).json({
        message: "Successfully",
        data: {
          email: findUser.email,
          full_name: findUser.full_name,
          profile_image: findUser.profile_image,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async profileUpdate(req, res, next) {
    try {
      const { email } = req.user;
      const { full_name, password } = req.body;

      let propertyUpdate = {};
      if (full_name) {
        propertyUpdate.full_name = full_name;
      }
      if (password) {
        propertyUpdate.password = hashPassword(password);
      }

      let findUpdate = await User.update(propertyUpdate, {
        where: {
          email,
        },
        returning: true,
      });

      res.status(200).json({
        message: "Profile successfully updated",
        data: {
          email: findUpdate[1][0].email,
          full_name: findUpdate[1][0].full_name,
          profile_image: findUpdate[1][0].profile_image,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async profileImage(req, res, next) {
    try {
      // console.log(req.file, "<<<<<<<<<<<");
      const { email } = req.user;

      if (!req.file) {
        throw { name: "profile_image required" };
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

      const findUpdate = await User.update(
        { profile_image: result.secure_url },
        {
          where: {
            email,
          },
          returning: true,
        }
      );

      res.status(200).json({
        message: "Profile image successfully changed",
        data: {
          email: findUpdate[1][0].email,
          full_name: findUpdate[1][0].full_name,
          profile_image: findUpdate[1][0].profile_image,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  // end user controller
}

module.exports = userController;
