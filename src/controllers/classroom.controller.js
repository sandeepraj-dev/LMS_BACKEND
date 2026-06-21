const Classroom = require("../models/Classroom");
const User = require("../models/User");

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

exports.getClassroomById = async (req, res) => {
  try {
    const { id } = req.params;

    const classroom = await Classroom.findById(id).populate(
      "students",
      "fullName username email role classroomIds",
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
    console.error("GET CLASSROOM ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getStudentsByClassroom = async (req, res) => {
  try {
    const { classroomId } = req.params;

    const classroom = await Classroom.findById(classroomId).populate(
      "students",
      "username fullName email role phone classroomIds createdAt updatedAt",
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
    const { id } = req.params;
    const { studentIds } = req.body;

    const classroom = await Classroom.findById(id);

    if (!classroom) {
      return res.status(404).json({
        success: false,
        message: "Classroom not found",
      });
    }

    const students = await User.find({
      _id: { $in: studentIds },
    });

    console.log("Found Students:", students.length);

    if (!students.length) {
      return res.status(404).json({
        success: false,
        message: "No students found",
      });
    }

    classroom.students = [
      ...new Set([
        ...classroom.students.map((item) => item.toString()),
        ...studentIds,
      ]),
    ];

    await classroom.save();

    await User.updateMany(
      {
        _id: { $in: studentIds },
      },
      {
        $addToSet: {
          classroomIds: classroom._id,
        },
      },
    );

    return res.status(200).json({
      success: true,
      message: "Students added successfully",
    });
  } catch (error) {
    console.error("ADD STUDENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
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
