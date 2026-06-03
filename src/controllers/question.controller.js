const Question = require("../models/Question");

exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });

    res.json({
      count: questions.length,
      data: questions,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create Multiple Questions
exports.createQuestions = async (req, res) => {
  try {
    const questions = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        message: "Please provide an array of questions",
      });
    }

    const createdQuestions = await Question.insertMany(questions);

    res.status(201).json({
      message: "Questions created successfully",
      count: createdQuestions.length,
      data: createdQuestions,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.updateQuestions = async (req, res) => {
  try {
    const questions = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        message: "Please provide an array of questions",
      });
    }

    const operations = questions.map((question) => ({
      updateOne: {
        filter: { _id: question._id },
        update: { $set: question },
      },
    }));

    await Question.bulkWrite(operations);

    const ids = questions.map((q) => q._id);

    const updatedQuestions = await Question.find({
      _id: { $in: ids },
    });

    res.status(200).json({
      message: "Questions updated successfully",
      count: updatedQuestions.length,
      data: updatedQuestions,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.deleteQuestion = async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);

    res.json({
      message: "Question deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
