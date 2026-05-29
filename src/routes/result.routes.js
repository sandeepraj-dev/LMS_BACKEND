const express = require("express");
const router = express.Router();

const resultController = require("../controllers/result.controller");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

// Get Logged In Student Results
router.get(
  "/me",
  authMiddleware,
  roleMiddleware("STUDENT"),
  resultController.getMyResults,
);

// Get Single Result By Exam
router.get(
  "/:examId",
  authMiddleware,
  roleMiddleware("STUDENT"),
  resultController.getSingleResult,
);

// Admin Get All Results For Exam
router.get(
  "/exam/:examId/all",
  authMiddleware,
  roleMiddleware("ADMIN"),
  resultController.getAllExamResults,
);

module.exports = router;
