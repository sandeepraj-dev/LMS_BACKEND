const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Register User
router.post("/register", authController.register);

// Login User
router.post("/login", authController.login);

// Get Logged In User
router.get("/me", authMiddleware, async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

module.exports = router;
