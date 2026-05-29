const Classroom = require("../models/Classroom");

exports.createClassroom = async (req, res) => {
  try {
    const classroom = await Classroom.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json(classroom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getClassrooms = async (req, res) => {
  try {
    const classrooms = await Classroom.find().populate("students");

    res.json(classrooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addStudents = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id);

    classroom.students.push(...req.body.studentIds);

    await classroom.save();

    res.json(classroom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
