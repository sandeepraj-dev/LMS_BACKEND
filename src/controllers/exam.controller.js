const Exam = require("../models/Exam");
const mongoose = require("mongoose");
exports.createExam = async (req, res) => {
  try {
    const exam = await Exam.create({
      title: req.body.title,
      description: req.body.description,
      classroomId: new mongoose.Types.ObjectId(req.body.classroomId), // FIX
      duration: req.body.duration,
      isPublished: false,
      totalMarks: 0,
      createdBy: new mongoose.Types.ObjectId(req.user.id), // FIX
    });

    res.status(201).json({
      success: true,
      data: exam,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getExams = async (req, res) => {
  try {
    const exams = await Exam.find()
      .populate("classroomId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: exams.length,
      data: exams,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate(
      "classroomId",
      "name",
    );

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    res.status(200).json({
      success: true,
      data: exam,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
exports.getExamsByClassroom = async (req, res) => {
  try {
    const classroomId = new mongoose.Types.ObjectId(req.params.classroomId);

    console.log("Searching for classroomId:", classroomId);

    const exams = await Exam.find({ classroomId })
      .populate("classroomId", "name")
      .sort({ createdAt: -1 });

    console.log("Found exams:", exams.length);

    res.json({
      success: true,
      count: exams.length,
      data: exams,
    });
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
exports.updateExam = async (req, res) => {
  try {
    const { id } = req.params;

    const exam = await Exam.findById(id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    const updatedExam = await Exam.findByIdAndUpdate(
      id,
      {
        title: req.body.title,
        description: req.body.description,
        duration: req.body.duration,
        isPublished: req.body.isPublished,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      message: "Exam updated successfully",
      data: updatedExam,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.deleteExam = async (req, res) => {
  try {
    const { id } = req.params;

    const exam = await Exam.findById(id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    await Exam.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Exam deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
exports.publishExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      {
        isPublished: true,
      },
      { new: true },
    );

    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
