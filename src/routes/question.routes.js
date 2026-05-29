const express = require("express");
const router = express.Router();

const questionController = require("../controllers/question.controller");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

// Create Question
router.post(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  questionController.createQuestion,
);

// Update Question
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  questionController.updateQuestion,
);

// Delete Question
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  questionController.deleteQuestion,
);

module.exports = router;
