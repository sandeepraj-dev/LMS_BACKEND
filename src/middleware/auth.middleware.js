const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    // Get auth header
    const authHeader = req.headers.authorization;

    // Validate header
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No authorization header",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      console.log("❌ Invalid Bearer Format");

      return res.status(401).json({
        success: false,
        message: "Token must start with Bearer",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      console.log("❌ Token Missing");

      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    // Decode without verify
    const decodedWithoutVerify = jwt.decode(token);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      console.log("❌ User Not Found");

      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Attach user
    req.user = user;

    next();
  } catch (error) {
    console.log("\n❌ AUTH ERROR");
    console.log("MESSAGE =>", error.message);
    console.log("STACK =>", error.stack);
    console.log("================================\n");

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: error.message,
    });
  }
};

module.exports = authMiddleware;
