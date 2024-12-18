
const express = require("express");
const User = require("../Models/user.schema");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

const auth = require("../Middleware/auth");
const checkAccess = require("../Middleware/Checkacess");
const blacklist = require("../blacklist");

// Get all users -> Only admin
router.get("/", auth,checkAccess(["Admin"]), async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Register
router.post("/register", async (req, res) => {
  console.log("Register endpoint hit");
  try {
    const { name,email, password, role } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({name, email, password: hash, role });
    const savedUser = await newUser.save();
    res.status(201).json({ message: "Registered successfully", savedUser });
  } catch (err) {
    res.status(400).json(err);
  }
});

// Login
router.post("/signin", async (req, res) => {
  console.log("Register endpoint hit");
  try {
    const { email, password } = req.body;
    const user = await User.findOne({email});
    if (!user) {
      return res.status(404).json({ err: "User not found!" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ err: "Password is wrong!" });
    }

    const accessToken = jwt.sign(
      {
        _id: user._id,
        role: user.role,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      {
        _id: user._id,
        role: user.role,
      },
      process.env.REFRESH_SECRET_KEY,
      { expiresIn: "1D" }
    );

    res.json({ accessToken, refreshToken, message: "Logged in successfully!", userId: user._id });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/logout", (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "Authorization header missing!" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token missing!" });

  blacklist.push(token);
  res.status(200).json({ message: "Logged out successfully" });
});

router.post("/token", (req, res) => {
  const { token: refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token missing!" });
  }

  jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token!" });
    }
    const accessToken = jwt.sign(
      {
        _id: decoded._id,
        role: decoded.role,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.status(200).json({ accessToken });
  });
});



module.exports = router;
