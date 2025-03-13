const express = require("express");
const upload = require("../utils/upload.js");
const fs = require("fs");
const File = require("../db/db.js");

const router = express.Router();

router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ message: "No file uploaded or file too large (Max: 10MB)" });
  }
  const fileObj = {
    path: req.file.path,
    name: req.file.originalname,
  };
  try {
    const file = await File.create(fileObj);
    res.status(200).json({
      path: `http://localhost:3000/file-sharing/${file._id}`,
    });

    setTimeout(async () => {
      try {
        await File.findByIdAndDelete(file._id);
        fs.unlinkSync(file.path);
        console.log(`File ${file.name} is deleted`);
      } catch (error) {
        console.log("Error deleting the file ", error);
      }
    }, 60000);
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
