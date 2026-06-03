const express = require("express");
const router = express.Router();

const classroomController = require("../controllers/classroom.controller");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

// Create Classroom
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  classroomController.createClassroom,
);

// Get All Classrooms
router.get("/", authMiddleware, classroomController.getClassrooms);

// Add Students To Classroom
router.post(
  "/:id/students",
  authMiddleware,
  roleMiddleware("ADMIN"),
  classroomController.addStudents,
); // Get Classroom By Id
router.get("/:id", authMiddleware, classroomController.getClassroomById);

// Update Classroom
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  classroomController.updateClassroom,
);

// Delete Classroom
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  classroomController.deleteClassroom,
);
router.get(
  "/:classroomId/students",
  classroomController.getStudentsByClassroom,
);
router.get("/:id", authMiddleware, classroomController.getClassroomById);

module.exports = router;
