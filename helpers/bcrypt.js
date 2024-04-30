const bcrypt = require("bcryptjs");

const hashPassword = (plainPassword) => bcrypt.hashSync(plainPassword, 5);
const comparePassword = (plainPassword, hashedPassword) =>
  bcrypt.compareSync(plainPassword, hashedPassword);

module.exports = {
  hashPassword,
  comparePassword,
};
