const express = require("express");
const upload = require("../config/upload");
const Resource = require("../models/Resource");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

/* =====================
   UPLOAD RESOURCE
===================== */
router.post(
  "/upload",
  auth,
  upload.single("file"),
  async (req, res) => {
    try {
      const { semester, courseCode } = req.body;

      const resource = await Resource.create({
        filename: req.file.filename,
        originalName: req.file.originalname,
        fileType: req.file.mimetype,
        semester,
        courseCode,
        filePath: req.file.path,
        uploadedBy: req.user.id
      });

      res.json(resource);
    } catch (err) {
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

/* =====================
   GET FILES BY COURSE
===================== */
router.get("/:semester/:courseCode", async (req, res) => {
  const { semester, courseCode } = req.params;

  try {
    const files = await Resource.find({
      semester,
      courseCode: courseCode.replace("-", " ")
    })
      .populate("uploadedBy", "name")
      .sort({ uploadedAt: -1 });

    res.json(files);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch files" });
  }
});

module.exports = router;