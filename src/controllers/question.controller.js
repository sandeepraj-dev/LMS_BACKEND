const Question = require("../models/Question");

exports.getQuestionsByClassroom = async (req, res) => {
  try {
    const { classroomId } = req.params;

    const questions = await Question.find({ classroomId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
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
exports.createQuestionsByClassroom = async (req, res) => {
  try {
    const { classroomId } = req.params;

    const questions = req.body.map((q) => ({
      ...q,
      classroomId,
    }));

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

exports.updateQuestionsByClassroom = async (req, res) => {
  try {
    const { classroomId } = req.params;
    const questions = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        message: "Please provide an array of questions",
      });
    }

    const operations = questions.map((question) => ({
      updateOne: {
        filter: {
          _id: question._id,
          classroomId,
        },
        update: {
          $set: question,
        },
      },
    }));

    await Question.bulkWrite(operations);

    const updatedQuestions = await Question.find({
      classroomId,
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
exports.deleteQuestionsByClassroom = async (req, res) => {
  try {
    const { classroomId } = req.params;

    const result = await Question.deleteMany({
      classroomId,
    });

    res.status(200).json({
      message: "Questions deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
