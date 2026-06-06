const Question = require("../models/Question");
const Exam = require("../models/Exam");

// Update Exam Total Marks
const updateExamTotalMarks = async (examId) => {
  const questions = await Question.find({ examId });

  const totalMarks = questions.reduce(
    (sum, question) => sum + (question.marks || 0),
    0,
  );

  await Exam.findByIdAndUpdate(examId, {
    totalMarks,
  });
};

// Get Questions By Classroom
exports.getQuestionsByClassroom = async (req, res) => {
  try {
    const { classroomId } = req.params;

    const questions = await Question.find({ classroomId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      count: questions.length,
      totalMarks: questions.reduce((sum, q) => sum + (q.marks || 0), 0),
      data: questions,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create Questions
exports.createQuestionsByClassroom = async (req, res) => {
  try {
    const { classroomId } = req.params;

    const questions = req.body.map((q) => ({
      ...q,
      classroomId,
    }));

    const createdQuestions = await Question.insertMany(questions);

    // Update Exam Total
    const examIds = [
      ...new Set(createdQuestions.map((q) => q.examId.toString())),
    ];

    for (const examId of examIds) {
      await updateExamTotalMarks(examId);
    }

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

// Update Questions
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

    // Update Exam Totals
    const examIds = [
      ...new Set(updatedQuestions.map((q) => q.examId.toString())),
    ];

    for (const examId of examIds) {
      await updateExamTotalMarks(examId);
    }

    res.status(200).json({
      message: "Questions updated successfully",
      count: updatedQuestions.length,
      totalMarks: updatedQuestions.reduce((sum, q) => sum + (q.marks || 0), 0),
      data: updatedQuestions,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete All Questions In Classroom
exports.deleteQuestionsByClassroom = async (req, res) => {
  try {
    const { classroomId } = req.params;

    const questions = await Question.find({ classroomId });

    const examIds = [...new Set(questions.map((q) => q.examId.toString()))];

    const result = await Question.deleteMany({
      classroomId,
    });

    for (const examId of examIds) {
      await updateExamTotalMarks(examId);
    }

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
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    const examId = question.examId;

    await Question.findByIdAndDelete(id);

    // Recalculate total marks for the exam
    const remainingQuestions = await Question.find({ examId });

    const totalMarks = remainingQuestions.reduce(
      (sum, q) => sum + (q.marks || 0),
      0,
    );

    await Exam.findByIdAndUpdate(examId, {
      totalMarks,
    });

    res.status(200).json({
      message: "Question deleted successfully",
      deletedQuestionId: id,
      updatedExamTotalMarks: totalMarks,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
