const User = require("../models/User");
const Classroom = require("../models/Classroom");
const Exam = require("../models/Exam");
const Question = require("../models/Question");
const Attempt = require("../models/Attempt");

/*
========================================
ADMIN DASHBOARD ANALYTICS
========================================
*/

exports.getDashboardAnalytics = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({
      role: "STUDENT",
    });

    const totalAdmins = await User.countDocuments({
      role: "ADMIN",
    });

    const totalClassrooms = await Classroom.countDocuments();

    const totalExams = await Exam.countDocuments();

    const totalQuestions = await Question.countDocuments();

    const totalAttempts = await Attempt.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalAdmins,
        totalClassrooms,
        totalExams,
        totalQuestions,
        totalAttempts,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/*
========================================
EXAM ANALYTICS
========================================
*/

exports.getExamAnalytics = async (req, res) => {
  try {
    const { examId } = req.params;

    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    const attempts = await Attempt.find({ examId }).populate(
      "studentId",
      "fullName username email",
    );

    const totalAttempts = attempts.length;

    const scores = attempts.map((item) => item.score);

    const averageScore =
      scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

    const highestScore = scores.length > 0 ? Math.max(...scores) : 0;

    const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;

    const passedStudents = attempts.filter(
      (item) => item.score >= exam.totalMarks * 0.4,
    ).length;

    const failedStudents = totalAttempts - passedStudents;

    res.status(200).json({
      success: true,
      data: {
        examId: exam._id,
        examTitle: exam.title,
        totalMarks: exam.totalMarks,

        totalAttempts,

        averageScore,

        highestScore,

        lowestScore,

        passedStudents,

        failedStudents,

        students: attempts,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/*
========================================
STUDENT ANALYTICS
========================================
*/

exports.getStudentAnalytics = async (req, res) => {
  try {
    const studentId = req.user._id;

    const attempts = await Attempt.find({
      studentId,
    }).populate("examId", "title totalMarks");

    const totalExamsAttempted = attempts.length;

    const totalScore = attempts.reduce((sum, item) => sum + item.score, 0);

    const averageScore =
      totalExamsAttempted > 0 ? totalScore / totalExamsAttempted : 0;

    const highestScore =
      attempts.length > 0 ? Math.max(...attempts.map((item) => item.score)) : 0;

    const lowestScore =
      attempts.length > 0 ? Math.min(...attempts.map((item) => item.score)) : 0;

    res.status(200).json({
      success: true,
      data: {
        totalExamsAttempted,
        totalScore,
        averageScore,
        highestScore,
        lowestScore,
        exams: attempts,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/*
========================================
CLASSROOM ANALYTICS
========================================
*/

exports.getClassroomAnalytics = async (req, res) => {
  try {
    const { classroomId } = req.params;

    const classroom = await Classroom.findById(classroomId).populate(
      "students",
      "fullName username email",
    );

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: "Classroom not found",
      });
    }

    const exams = await Exam.find({
      classroomId,
    });

    res.status(200).json({
      success: true,
      data: {
        classroomId: classroom._id,
        classroomName: classroom.name,
        totalStudents: classroom.students.length,
        totalExams: exams.length,
        students: classroom.students,
        exams,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
