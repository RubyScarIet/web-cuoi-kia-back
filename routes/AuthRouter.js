const express = require("express");
const User = require("../db/userModel");
const router = express.Router();

// POST /admin/login
router.post("/login", async (req, res) => {
  const { login_name, password } = req.body;
  if (!login_name || !password) {
    return res.status(400).json({ error: "login_name and password are required" });
  }

  try {
    const user = await User.findOne({ login_name });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    if (user.password !== password) {
      return res.status(400).json({ error: "Incorrect password" });
    }

    req.session.userId = user._id;
    req.session.user = {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      login_name: user.login_name
    };
    
    res.status(200).json(req.session.user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /admin/logout
router.post("/logout", (req, res) => {
  if (!req.session.userId) {
    return res.status(400).json({ error: "User is not logged in" });
  }
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: "Failed to logout" });
    }
    res.status(200).json({ message: "Logged out successfully" });
  });
});

// POST /user
router.post("/user", async (req, res) => {
  const { login_name, password, first_name, last_name, location, description, occupation } = req.body;
  if (!login_name || !password || !first_name || !last_name) {
    return res.status(400).json({ error: "login_name, password, first_name, and last_name are required" });
  }
  try {
    const existingUser = await User.findOne({ login_name });
    if (existingUser) {
      return res.status(400).json({ error: "login_name already exists" });
    }

    const newUser = new User({
      login_name,
      password,
      first_name,
      last_name,
      location: location || "",
      description: description || "",
      occupation: occupation || ""
    });

    await newUser.save();
    res.status(200).json({
      _id: newUser._id,
      login_name: newUser.login_name,
      first_name: newUser.first_name,
      last_name: newUser.last_name
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
