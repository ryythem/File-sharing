const express = require("express");
const multer = require("multer");
const bucket = require("../firebase"); 
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); 

router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ message: "No file uploaded or file too large (Max: 10MB)" });
  }

  const fileName = `${uuidv4()}_${req.file.originalname}`;
  const file = bucket.file(fileName);

  try {
    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
        contentDisposition: `attachment; filename="${req.file.originalname}"`,
      },
    });

    stream.on("error", (err) => 
      res.status(500).json({ message: "Upload error", error: err })
    );

    stream.on("finish", async () => {
      await file.makePublic();
      const firebaseUrl = `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${encodeURIComponent(fileName)}?alt=media`;

      try {
        const tinyUrlResponse = await axios.get(
          `https://tinyurl.com/api-create.php?url=${firebaseUrl}`
        );
        const shortUrl = tinyUrlResponse.data;

        res.status(200).json({ path: shortUrl });
        setTimeout(async () => {
          try {
            await file.delete();
            console.log(`File ${fileName} deleted from Firebase Storage`);
          } catch (error) {
            console.error(`Error deleting ${fileName}:`, error);
          }
        }, 60000); // 1-minute deletion
      } catch (tinyError) {
        console.log("TinyURL Error: ", tinyError);
        res
          .status(500)
          .json({ message: "Error shortening URL", error: tinyError });
      }
    });

    stream.end(req.file.buffer);
  } catch (e) {
    res.status(500).json({ message: "Error uploading file", error: e });
  }
});

module.exports = router;
