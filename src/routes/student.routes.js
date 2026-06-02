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
// Attempt Exam
router.post(
  "/exams/:examId/attempt",
  authMiddleware,
  roleMiddleware("STUDENT"),
  studentController.attemptExam,
);

module.exports = router;
