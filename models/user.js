"use strict";
const { Model } = require("sequelize");
const { hashPassword } = require("../helpers/bcrypt");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      User.hasMany(models.Product, { foreignKey: "authorId" });
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "email required" },
          notEmpty: { msg: "email required" },
          isEmail: { msg: "The email is not in the correct format" },
        },
        unique: {
          args: true,
          msg: "The email is already registered",
        },
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "name required" },
          notEmpty: { msg: "name required" },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "password required" },
          notEmpty: { msg: "password required" },
          len: {
            args: [8, Infinity],
            msg: "The minimum password length is 8 characters",
          },
        },
      },
      profile_image: DataTypes.STRING,
      role: {
        type: DataTypes.STRING,
        defaultValue: "client",
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  //add hooks
  User.beforeCreate((user) => {
    user.password = hashPassword(user.password);
  });

  return User;
};
