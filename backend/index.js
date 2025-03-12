require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const router = require("./routes/route.js");

const MONGO_URL = process.env.MONGO_URL;
const PORT = 3000;

const app = express();
app.use(cors());

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((e) => {
    console.log("Error connecting to database");
  });

app.use('/',router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
