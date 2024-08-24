const express = require("express");
const router=express.Router();
const fs = require("fs");
const path = require("path");
router.get("/read-image:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "",filename);
  if (path.basename(filename) !== filename) {
    return res.status(400).send("Invalid filename");
  }
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("File does not exist:", err.message);
      return res.status(404).send("File not found");
    }
    const ext = path.extname(filename).toLowerCase();
    let contentType;

    switch (ext) {
      case ".jpg":
      case ".jpeg":
        contentType = "image/jpeg";
        break;
      case ".png":
        contentType = "image/png";
        break;
      case ".gif":
        contentType = "image/gif";
        break;
      default:
        return res.status(415).send("Unsupported file type");
    }
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error("Error reading file:", err.message);
        return res.status(500).send("Error reading file");
      }

      res.setHeader("Content-Type", contentType);
      res.status(200).send(data);
    });
  });
});
module.exports=router