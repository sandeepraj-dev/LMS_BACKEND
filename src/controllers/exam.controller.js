const Exam = require("../models/Exam");

exports.createExam = async (req, res) => {
  try {
    const exam = await Exam.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getExams = async (req, res) => {
  try {
    const exams = await Exam.find();

    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
