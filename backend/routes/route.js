const express = require("express");

const router = express.Router();

router.get("/upload", (req, res) => {
  res.json({
    message: "hello",
  });
});


module.exports = router;