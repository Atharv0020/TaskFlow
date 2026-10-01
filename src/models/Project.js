const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      minlength: [3, "Project title must be at least 3 characters"],
      maxlength: [100, "Project title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    status: {
      type: String,
      enum: ["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED"],
      default: "PLANNING",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate members in a project
projectSchema.path("members").validate(function (members) {
  if (!members) return true;

  const uniqueMembers = new Set(
    members.map((member) => member.toString())
  );

  return uniqueMembers.size === members.length;
}, "Project members must be unique");

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;