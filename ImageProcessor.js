const Jimp = require("jimp");
const fs = require("fs");
const path = require("path");

const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const processImage = async (tempPath, newFilePath) => {
  try {
    const image = await Jimp.read(tempPath);
    const newFileDir = path.dirname(newFilePath);
    ensureDirectoryExists(newFileDir);
    await image.resize(250, 250).write(newFilePath);
    fs.unlinkSync(tempPath);
  } catch (error) {
    throw new Error("Image processing failed");
  }
};

module.exports = processImage;
