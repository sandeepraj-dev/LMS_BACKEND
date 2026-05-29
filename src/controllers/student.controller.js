const Attempt = require("../models/Attempt");
const Exam = require("../models/Exam");
const Question = require("../models/Question");

exports.attemptExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const { answers } = req.body;

    // Check exam exists
    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    // Check exam published
    if (!exam.isPublished) {
      return res.status(400).json({
        success: false,
        message: "Exam is not published yet",
      });
    }

    // Prevent multiple attempts
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

      const isCorrect = question.correctAnswer === answer.selectedAnswer;

      if (isCorrect) {
        score += question.marks;
      }

      evaluatedAnswers.push({
        questionId: question._id,
        selectedAnswer: answer.selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        marksAwarded: isCorrect ? question.marks : 0,
      });
    }

    // Save attempt
    const attempt = await Attempt.create({
      studentId: req.user._id,
      examId,
      answers: evaluatedAnswers,
      score,
    });

    res.status(201).json({
      success: true,
      message: "Exam submitted successfully",
      data: {
        attemptId: attempt._id,
        examId,
        score,
        totalQuestions,
        submittedAt: attempt.createdAt,
        answers: evaluatedAnswers,
      },
    });
  } catch (error) {
    console.log("Attempt Exam Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
