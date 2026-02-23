const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    originalName: {
      type: String,
      required: true
    },

    fileType: {
      type: String,
      required: true
    },

    filePath: {
      type: String,
      required: true
    },

    semester: {
      type: String,
      required: true
    },

    courseCode: {
      type: String,
      required: true
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resource", resourceSchema);