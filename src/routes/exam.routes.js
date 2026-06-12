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
router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN", "STUDENT"),
  examController.getExams,
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN", "STUDENT"),
  examController.getExamById,
);

router.get(
  "/classroom/:classroomId",
  authMiddleware,
  roleMiddleware("ADMIN", "STUDENT"),
  examController.getExamsByClassroom,
);

// Publish Exam
router.patch(
  "/:id/publish",
  authMiddleware,
  roleMiddleware("ADMIN"),
  examController.publishExam,
);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  examController.updateExam,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  examController.deleteExam,
);

module.exports = router;
