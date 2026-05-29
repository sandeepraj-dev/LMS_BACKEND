const mongoose = require("mongoose");

const classroomSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Classroom", classroomSchema);
