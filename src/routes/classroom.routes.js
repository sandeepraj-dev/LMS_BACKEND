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
);

module.exports = router;
