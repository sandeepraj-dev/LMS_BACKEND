const express = require("express");
const router = express.Router();

const questionController = require("../controllers/question.controller");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

// Create Multiple Questions
router.post(
  "/classroom/:classroomId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  questionController.createQuestionsByClassroom,
);

// Get Questions By Classroom
router.get(
  "/classroom/:classroomId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  questionController.getQuestionsByClassroom,
);

// Update Questions By Classroom
router.put(
  "/classroom/:classroomId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  questionController.updateQuestionsByClassroom,
);

// Delete Single Question
router.delete(
  "/classroom/:classroomId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  questionController.deleteQuestionsByClassroom,
);

module.exports = router;
