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

exports.getStudentsByClassroom = async (req, res) => {
  try {
    const { classroomId } = req.params;

    const classroom = await Classroom.findById(classroomId).populate(
      "students",
      "name email phone",
    );

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: "Classroom not found",
      });
    }

    res.status(200).json({
      success: true,
      count: classroom.students.length,
      students: classroom.students,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
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
/*
========================================
UPDATE CLASSROOM
========================================
*/

exports.updateClassroom = async (req, res) => {
  try {
    const { id } = req.params;

    const classroom = await Classroom.findById(id);

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: "Classroom not found",
      });
    }

    const updatedClassroom = await Classroom.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Classroom updated successfully",
      data: updatedClassroom,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/*
========================================
DELETE CLASSROOM
========================================
*/

exports.deleteClassroom = async (req, res) => {
  try {
    const { id } = req.params;

    const classroom = await Classroom.findById(id);

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: "Classroom not found",
      });
    }

    await Classroom.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Classroom deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/*
========================================
GET CLASSROOM BY ID
========================================
*/

exports.getClassroomById = async (req, res) => {
  try {
    const { id } = req.params;

    const classroom = await Classroom.findById(id).populate(
      "students",
      "fullName username email",
    );

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: "Classroom not found",
      });
    }

    res.status(200).json({
      success: true,
      data: classroom,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
