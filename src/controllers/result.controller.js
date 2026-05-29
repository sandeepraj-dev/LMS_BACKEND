const Attempt = require("../models/Attempt");
const Exam = require("../models/Exam");

exports.getMyResults = async (req, res) => {
  try {
    const results = await Attempt.find({
      studentId: req.user._id,
    })
      .populate("examId", "title totalMarks")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.log("Get Results Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.getSingleResult = async (req, res) => {
  try {
    const { examId } = req.params;

    const result = await Attempt.findOne({
      studentId: req.user._id,
      examId,
    }).populate("examId", "title totalMarks description");

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.log("Get Single Result Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.getAllExamResults = async (req, res) => {
  try {
    const { examId } = req.params;

    // Check exam exists
    const exam = await Exam.findById(examId);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    const results = await Attempt.find({ examId })
      .populate("studentId", "fullName username email")
      .sort({ score: -1 });

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.log("Get All Exam Results Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
