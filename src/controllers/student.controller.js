const Attempt = require("../models/Attempt");
const Exam = require("../models/Exam");
const Question = require("../models/Question");
const User = require("../models/User");

// exports.attemptExam = async (req, res) => {
//   try {
//     const { examId } = req.params;
//     const { answers } = req.body;

//     // Check exam exists
//     const exam = await Exam.findById(examId);

//     if (!exam) {
//       return res.status(404).json({
//         success: false,
//         message: "Exam not found",
//       });
//     }

//     // Check exam published
//     if (!exam.isPublished) {
//       return res.status(400).json({
//         success: false,
//         message: "Exam is not published yet",
//       });
//     }

//     // Prevent multiple attempts
//     const existingAttempt = await Attempt.findOne({
//       studentId: req.user._id,
//       examId,
//     });

//     if (existingAttempt) {
//       return res.status(400).json({
//         success: false,
//         message: "You already attempted this exam",
//       });
//     }

//     let score = 0;
//     let totalQuestions = 0;

//     const evaluatedAnswers = [];

//     for (const answer of answers) {
//       const question = await Question.findById(answer.questionId);

//       if (!question) continue;

//       totalQuestions++;

//       const isCorrect = question.correctAnswer === answer.selectedAnswer;

//       if (isCorrect) {
//         score += question.marks;
//       }

//       evaluatedAnswers.push({
//         questionId: question._id,
//         selectedAnswer: answer.selectedAnswer,
//         correctAnswer: question.correctAnswer,
//         isCorrect,
//         marksAwarded: isCorrect ? question.marks : 0,
//       });
//     }

//     // Save attempt
//     const attempt = await Attempt.create({
//       studentId: req.user._id,
//       examId,
//       answers: evaluatedAnswers,
//       score,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Exam submitted successfully",
//       data: {
//         attemptId: attempt._id,
//         examId,
//         score,
//         totalQuestions,
//         submittedAt: attempt.createdAt,
//         answers: evaluatedAnswers,
//       },
//     });
//   } catch (error) {
//     console.log("Attempt Exam Error:", error.message);

//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };

exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({
      role: "STUDENT",
    }).select("-password");

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
exports.getStudentById = async (req, res) => {
  try {
    const student = await User.findOne({
      _id: req.params.id,
      role: "STUDENT",
    }).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
exports.updateStudent = async (req, res) => {
  try {
    const student = await User.findOne({
      _id: req.params.id,
      role: "STUDENT",
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const updatedStudent = await User.findByIdAndUpdate(
      req.params.id,
      {
        fullName: req.body.fullName,
        email: req.body.email,
        username: req.body.username,
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
exports.deleteStudent = async (req, res) => {
  try {
    const student = await User.findOne({
      _id: req.params.id,
      role: "STUDENT",
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * GET /api/student/my-classrooms
 */
exports.getMyClassrooms = async (req, res) => {
  try {
    const student = await User.findById(req.user._id).populate(
      "classroomIds",
      "name description",
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      count: student.classroomIds.length,
      data: student.classroomIds,
    });
  } catch (error) {
    console.error("GET MY CLASSROOMS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET /api/student/classroom/:classroomId/exams
 */

exports.getExamsByClassroom = async (req, res) => {
  try {
    const { classroomId } = req.params;

    const student = await User.findById(req.user._id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const hasAccess = student.classroomIds.some(
      (id) => id.toString() === classroomId,
    );

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this classroom",
      });
    }

    const exams = await Exam.find({
      classroomId,
      isPublished: true,

      // Hide exams already attempted by current student
      attemptedStudents: {
        $nin: [req.user._id],
      },
    })
      .populate("classroomId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: exams.length,
      data: exams,
    });
  } catch (error) {
    console.error("GET EXAMS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET /api/student/exam/:examId/questions
 */
exports.getExamQuestions = async (req, res) => {
  try {
    const { examId } = req.params;

    const student = await User.findById(req.user._id);

    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    const hasAccess = student.classroomIds.some(
      (id) => id.toString() === exam.classroomId.toString(),
    );

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const existingAttempt = await Attempt.findOne({
      studentId: req.user._id,
      examId,
    });

    if (existingAttempt) {
      return res.status(400).json({
        success: false,
        message: "You already attempted this exam",
      });
    }

    const questions = await Question.find({
      examId,
    }).select("-correctAnswer");

    res.status(200).json({
      success: true,
      exam: {
        _id: exam._id,
        title: exam.title,
        description: exam.description,
        duration: exam.duration,
        totalMarks: exam.totalMarks,
      },
      count: questions.length,
      data: questions,
    });
  } catch (error) {
    console.error("GET QUESTIONS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * POST /api/student/exams/:examId/attempt
 */
exports.attemptExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const { answers } = req.body;

    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    if (!exam.isPublished) {
      return res.status(400).json({
        success: false,
        message: "Exam is not published",
      });
    }

    const existingAttempt = await Attempt.findOne({
      studentId: req.user._id,
      examId,
    });

    if (existingAttempt) {
      return res.status(400).json({
        success: false,
        message: "You already attempted this exam",
      });
    }

    let score = 0;
    let totalQuestions = 0;

    const evaluatedAnswers = [];

    for (const answer of answers) {
      const question = await Question.findById(answer.questionId);

      if (!question) continue;

      totalQuestions++;

      const isCorrect =
        question.answer.trim().toLowerCase() ===
        answer.selectedAnswer.trim().toLowerCase();

      if (isCorrect) {
        score += question.marks;
      }

      evaluatedAnswers.push({
        questionId: question._id,
        selectedAnswer: answer.selectedAnswer,
        correctAnswer: question.answer,
        isCorrect,
        marksAwarded: isCorrect ? question.marks : 0,
      });
    }

    const attempt = await Attempt.create({
      studentId: req.user._id,
      examId,
      answers: evaluatedAnswers,
      score,
      submittedAt: new Date(),
    });
    await Exam.findByIdAndUpdate(examId, {
      $addToSet: {
        attemptedStudents: req.user._id,
      },
    });

    res.status(201).json({
      success: true,
      message: "Exam submitted successfully",
      data: {
        attemptId: attempt._id,
        score,
        totalQuestions,
        submittedAt: attempt.submittedAt,
      },
    });
  } catch (error) {
    console.error("ATTEMPT EXAM ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET /api/student/attempts
 */
exports.getMyAttempts = async (req, res) => {
  try {
    const attempts = await Attempt.find({
      studentId: req.user._id,
    })
      .populate("examId", "title totalMarks duration")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: attempts.length,
      data: attempts,
    });
  } catch (error) {
    console.error("GET ATTEMPTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET /api/student/attempts/:attemptId
 */
exports.getAttemptResult = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt = await Attempt.findOne({
      _id: attemptId,
      studentId: req.user._id,
    }).populate("examId", "title totalMarks duration");

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Result not found",
      });
    }

    res.status(200).json({
      success: true,
      data: attempt,
    });
  } catch (error) {
    console.error("GET RESULT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
