const multer = require("multer");
const path = require("path");
const fs = require("fs");

const tmpDir = path.join(__dirname, "../tmp");

if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tmpDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

module.exports = upload;
