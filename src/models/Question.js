const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    classroomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
      required: true,
    },

    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },

    question: {
      type: String,
      required: true,
    },

    options: [String],

    answer: {
      type: String,
      required: true,
    },

    marks: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model("Question", questionSchema);
