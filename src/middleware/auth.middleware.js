const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    console.log("\n========== AUTH DEBUG ==========");

    // Full headers
    console.log("HEADERS =>", req.headers);

    // Get auth header
    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER =>", authHeader);

    // Validate header
    if (!authHeader) {
      console.log("❌ No Authorization Header");

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

    console.log("TOKEN =>", token);

    if (!token) {
      console.log("❌ Token Missing");

      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    // Decode without verify
    const decodedWithoutVerify = jwt.decode(token);

    console.log("DECODED WITHOUT VERIFY =>", decodedWithoutVerify);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("✅ VERIFIED TOKEN =>", decoded);

    // Find user
    const user = await User.findById(decoded.id).select("-password");

    console.log("USER FROM DB =>", user);

    if (!user) {
      console.log("❌ User Not Found");

      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Attach user
    req.user = user;

    console.log("✅ AUTH SUCCESS");
    console.log("================================\n");

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
