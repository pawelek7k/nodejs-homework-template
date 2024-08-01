const Jimp = require("jimp");
const fs = require("fs");

const processImage = async (tempPath, newFilePath) => {
  try {
    const image = await Jimp.read(tempPath);
    await image.resize(250, 250).write(newFilePath);
    fs.unlinkSync(tempPath);
  } catch (error) {
    throw new Error("Image processing failed");
  }
};

module.exports = processImage;
