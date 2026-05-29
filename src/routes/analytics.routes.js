const express = require("express");

const router = express.Router();

const analyticsController = require("../controllers/analytics.controller");

const authMiddleware = require("../middleware/auth.middleware");

const roleMiddleware = require("../middleware/role.middleware");

/*
========================================
ADMIN DASHBOARD ANALYTICS
========================================
*/

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("ADMIN"),
  analyticsController.getDashboardAnalytics,
);

/*
========================================
EXAM ANALYTICS
========================================
*/

router.get(
  "/exam/:examId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  analyticsController.getExamAnalytics,
);

/*
========================================
STUDENT ANALYTICS
========================================
*/

router.get(
  "/student",
  authMiddleware,
  roleMiddleware("STUDENT"),
  analyticsController.getStudentAnalytics,
);

/*
========================================
CLASSROOM ANALYTICS
========================================
*/

router.get(
  "/classroom/:classroomId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  analyticsController.getClassroomAnalytics,
);

module.exports = router;
