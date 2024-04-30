const errorHandler = async (error, req, res, next) => {
  console.log(error.name, "<<<<< ERROR is here");
  console.log(error);
  if (
    error.name === "SequelizeValidationError" ||
    error.name === "SequelizeUniqueConstraintError"
  ) {
    res.status(400).json({
      message: error.errors[0].message,
    });
  } else if (
    error.name === "email required" ||
    error.name === "password required"
  ) {
    res.status(400).json({
      message: "The email and password cannot be empty",
    });
  } else if (error.name === "invalid email format") {
    res.status(400).json({
      message: "The email is not in the correct format",
    });
  } else if (error.name === "Unauthorized") {
    res.status(401).json({
      message: "The email or password is incorrect",
    });
  } else if (
    error.name === "JsonWebTokenError" ||
    error.name === "Token Unauthorized"
  ) {
    res.status(401).json({
      message: "The token is invalid or expired",
    });
  } else if (
    error.name === "profile_image required" ||
    error.name === "invalid file format"
  ) {
    res.status(400).json({
      message: "The image cannot be empty or is in the wrong file format",
    });
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = errorHandler;
