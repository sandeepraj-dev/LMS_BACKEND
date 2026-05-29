const express = require("express");
const router = express.Router();

const studentController = require("../controllers/student.controller");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

// Attempt Exam
router.post(
  "/exams/:examId/attempt",
  authMiddleware,
  roleMiddleware("STUDENT"),
  studentController.attemptExam,
);

module.exports = router;
