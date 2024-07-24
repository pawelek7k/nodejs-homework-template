const express = require("express");
const User = require("../../usersSchema");
const jwt = require("jsonwebtoken");
const validateUser = require("../../validateUser");
const authMiddleware = require("../api/token");
const secret = "secret word";

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
    const newUser = new User({ username, email });
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
    id: user.id,
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
  const user = req.user;
  try {
    user.token = null;
    await user.save();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.get("/users/current", authMiddleware, async (req, res, next) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Not authorized" });
  }
  res.status(200).json({
    email: user.email,
    subscription: user.subscription,
  });
});

module.exports = router;