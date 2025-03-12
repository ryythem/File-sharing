const express = require("express");
const upload = require("../utils/upload.js");
const File = require("../db/db.js");

const router = express.Router();

router.post("/upload", upload.single("file"), async (req, res) => {
  const fileObj = {
    path: req.file.path,
    name: req.file.originalname,
  };
  try {
    const file = await File.create(fileObj);
    res.status(200).json({
      path: `http://localhost:3000/file-sharing/${file._id}`,
    });
  } catch (e) {
    res.status(500).json({
      message: "error",
    });
  }
});

router.get("/file-sharing/:fileId", async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);
    res.download(file.path, file.name);
  } catch {
    res.json({ message: "Error" });
  }
});

module.exports = router;
