const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    semester: {
      type: String,
      required: true
    },
    courseCode: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    filename: {
      type: String,
      required: true
    },
    filePath: {
      type: String,
      required: true
    },
    fileType: {
      type: String
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Resource",
  resourceSchema
);