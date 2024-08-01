const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

const tmpDir = path.join(__dirname, "../tmp");

if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tmpDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${crypto.randomBytes(16).toString("hex")}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

module.exports = upload;
