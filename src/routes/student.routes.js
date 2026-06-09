const express = require("express");
const router = express.Router();

const studentController = require("../controllers/student.controller");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  studentController.getStudents,
);

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

// Logged-in student classrooms
router.get(
  "/my-classrooms",
  authMiddleware,
  roleMiddleware("STUDENT"),
  studentController.getMyClassrooms,
);

// Exams available for a classroom
router.get(
  "/classroom/:classroomId/exams",
  authMiddleware,
  roleMiddleware("STUDENT"),
  studentController.getExamsByClassroom,
);

// Questions for a selected exam
router.get(
  "/exam/:examId/questions",
  authMiddleware,
  roleMiddleware("STUDENT"),
  studentController.getExamQuestions,
);

// Submit exam attempt
router.post(
  "/exams/:examId/attempt",
  authMiddleware,
  roleMiddleware("STUDENT"),
  studentController.attemptExam,
);

// My exam history
router.get(
  "/attempts",
  authMiddleware,
  roleMiddleware("STUDENT"),
  studentController.getMyAttempts,
);

// Specific attempt result
router.get(
  "/attempts/:attemptId",
  authMiddleware,
  roleMiddleware("STUDENT"),
  studentController.getAttemptResult,
);
module.exports = router;
