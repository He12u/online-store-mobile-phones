if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const router = require("./routes");
const app = express();
// const PORT = process.env.PORT || 3000;
const cors = require("cors");

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(router);

// app Listener
// app.listen(PORT, () => console.log("LISTEN ON PORT " + PORT));

module.exports = app;
