const express = require("express");
const router = express.Router();
const zod = require("zod");
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config").JWT_SECRET;
const bcrypt = require("bcrypt");

//signup schema and api
const signUpSchema = zod.object({
  username: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string().min(8),
});

router.post("/signup", async (req, res) => {
  const { sucess } = signUpSchema.safeParse(req.body);
  if (!sucess) {
    return res.status(401).json({
      error: "Incorrect input",
      message: "Incorrect input",
    });
  }
  const existingUser = await User.findOne({ username: req.body.username });
  if (existingUser) {
    return res.status(501).json({
      error: "Email Already Exists",
      message: "Incorrect input",
    });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const newUser = await User.create({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: hashedPassword,
  });

  const token = jwt.sign(
    {
      userId: newUser._id,
    },
    JWT_SECRET,
  );

  res.status(201).json({
    message: " User Created Successfully",
    token: token,
  });
});
//login schema and api
const loginSchema = zod.object({
  username: zod.string().email(),
  password: zod.string().min(8),
});

router.post("/login", async (req, res) => {
  const { sucess } = loginSchema.safeParse(req.body);
  if (!sucess) {
    return res.status(401).json({
      error: "Incorrect input",
      message: "Incorrect input",
    });
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const user = await User.findOne({
    username: req.body.username,
    password: hashedPassword,
  });
  if (user) {
    const token = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SECRET,
    );
    res.status(200).json({
      message: " User Logged In Successfully",
      token: token,
    });
    return;
  }
  res.status(411).json({
    error: "Error while Logging In",
    message: "Error while Logging In",
  });
});
module.exports = router;
