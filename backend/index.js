require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const router = require("./routes/route.js");

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());


app.use('/',router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
