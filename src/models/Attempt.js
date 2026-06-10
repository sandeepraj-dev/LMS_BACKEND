const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
  },
  question: {
    type: String,
    required: true,
  },

  selectedAnswer: {
    type: String,
    required: true,
  },

  correctAnswer: {
    type: String,
  },

  isCorrect: {
    type: Boolean,
    default: false,
  },

  marksAwarded: {
    type: Number,
    default: 0,
  },
});

const attemptSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },

    answers: [answerSchema],

    score: {
      type: Number,
      default: 0,
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Attempt", attemptSchema);
