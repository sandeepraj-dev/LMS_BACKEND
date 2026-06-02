const express = require("express");
const router = express.Router();

const examController = require("../controllers/exam.controller");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

// Create Exam
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  examController.createExam,
);

// Get All Exams
router.get("/", authMiddleware, examController.getExams);

router.get("/:id", authMiddleware, examController.getExamById);

// Publish Exam
router.patch(
  "/:id/publish",
  authMiddleware,
  roleMiddleware("ADMIN"),
  examController.publishExam,
);

module.exports = router;
