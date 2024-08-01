const express = require("express");
const User = require("../../usersSchema");
const jwt = require("jsonwebtoken");
const validateUser = require("../../validateUser");
const authMiddleware = require("../api/token");
const gravatar = require("gravatar");
const upload = require("../../multerConfig");
const secret = process.env.SECRET_KEY;
const path = require("path");
const processImage = require("../../ImageProcessor");

const router = express.Router();

router.post("/users/signup", validateUser, async (req, res, next) => {
  const { username, email, password } = req.body;
  const user = await User.findOne({ email }).lean();
  if (user) {
    return res.status(409).json({
      status: "error",
      code: 409,
      message: "Email is already in use",
      data: "Conflict",
    });
  }
  try {
    const avatarUrl = gravatar.url(email, {
      s: "200",
      r: "pg",
      d: "mm",
    });
    const defaultAvatarUrl = "/avatars/avatar.jpg";
    const finalAvatarUrl = avatarUrl.includes("avatar.jpg")
      ? defaultAvatarUrl
      : avatarUrl;

    const newUser = new User({ username, email, avatarURL: finalAvatarUrl });
    newUser.setPassword(password);
    await newUser.save();
    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        message: "Registration successful",
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/users/login", validateUser, async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.validPassword(password)) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Incorrect login or password",
      data: "Bad request",
    });
  }

  const payload = {
    id: user._id,
    username: user.username,
  };

  const token = jwt.sign(payload, secret, { expiresIn: "1h" });
  user.token = token;
  await user.save();

  res.json({
    status: "success",
    code: 200,
    data: {
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    },
  });
});

router.get("/users/logout", authMiddleware, async (req, res, next) => {
  const { _id } = req.user;
  try {
    const user = await User.findById(_id);

    if (user.token) {
      user.token = null;
      await user.save();
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.get("/users/current", authMiddleware, async (req, res, next) => {
  const { _id } = req.user;

  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.status(200).json({
      id: user._id,
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    next(error);
  }
});

router.patch(
  "/users/avatars",
  authMiddleware,
  upload.single("avatar"),
  async (req, res, next) => {
    const { _id } = req.user;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      const tempPath = path.join(__dirname, "../../tmp", req.file.filename);
      const publicPath = path.join(__dirname, "../../public/avatars");
      const newFileName = `${_id}${path.extname(req.file.originalname)}`;
      const newFilePath = path.join(publicPath, newFileName);

      await processImage(tempPath, newFilePath);

      const avatarURL = `/avatars/${newFileName}`;
      const user = await User.findById(_id);
      user.avatarURL = avatarURL;
      await user.save();

      res.status(200).json({ avatarURL });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
