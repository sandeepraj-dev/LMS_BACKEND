const express = require("express");
const router = express.Router();

const studentController = require("../controllers/student.controller");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const { generateQuestions } = require("../controllers/aiController");

router.post("/generate-questions", authMiddleware, generateQuestions);

// Student routes first

router.get(
  "/my-classrooms",
  authMiddleware,
  roleMiddleware("STUDENT"),
  studentController.getMyClassrooms,
);

router.get(
  "/attempts",
  authMiddleware,
  roleMiddleware("STUDENT"),
  studentController.getMyAttempts,
);

router.get(
  "/attempts/:attemptId",
  authMiddleware,
  roleMiddleware("STUDENT", "ADMIN"),
  studentController.getAttemptResult,
);

router.get(
  "/classroom/:classroomId/exams",
  authMiddleware,
  roleMiddleware("STUDENT", "ADMIN"),
  studentController.getExamsByClassroom,
);

router.get(
  "/exam/:examId/questions",
  authMiddleware,
  roleMiddleware("STUDENT", "ADMIN"),
  studentController.getExamQuestions,
);

router.post(
  "/exams/:examId/attempt",
  authMiddleware,
  roleMiddleware("STUDENT"),
  studentController.attemptExam,
);

// Admin routes last
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  studentController.getStudentById,
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  studentController.updateStudent,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  studentController.deleteStudent,
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  studentController.getStudents,
);
module.exports = router;
