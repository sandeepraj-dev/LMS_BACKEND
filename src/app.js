const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("../routes/auth.routes");
const classroomRoutes = require("../routes/classroom.routes");
const examRoutes = require("../routes/exam.routes");
const questionRoutes = require("../routes/question.routes");
const studentRoutes = require("../routes/student.routes");
const resultRoutes = require("../routes/result.routes");
const analyticsRoutes = require("../routes/analytics.routes");

const errorMiddleware = require("../middleware/error.middleware");

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "LMS Backend Running",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/classrooms", classroomRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/analytics", analyticsRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// Error Middleware
app.use(errorMiddleware);

module.exports = app;
