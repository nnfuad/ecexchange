const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Resource = require("../models/Resource");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* =========================================
   MULTER STORAGE CONFIGURATION
========================================= */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { semester, courseCode } = req.body;

    if (!semester || !courseCode) {
      return cb(new Error("Semester and courseCode required"));
    }

    // Create safe folder name
    const safeCourse = courseCode.replace(/\s+/g, "-");

    const uploadPath = path.join(
      __dirname,
      "../../uploads",
      semester,
      safeCourse
    );

    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

/* =========================================
   UPLOAD RESOURCE (AUTH REQUIRED)
========================================= */

router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    try {
      const { semester, courseCode } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const safeCourse = courseCode.replace(/\s+/g, "-");

      // IMPORTANT: store RELATIVE path, not absolute path
      const relativePath = `/uploads/${semester}/${safeCourse}/${req.file.filename}`;

      const newResource = await Resource.create({
        originalName: req.file.originalname,
        fileType: req.file.mimetype,
        filePath: relativePath,
        semester,
        courseCode: safeCourse,
        uploadedBy: req.user.id
      });

      res.status(201).json(newResource);

    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

/* =========================================
   GET FILES BY SEMESTER & COURSE
========================================= */

router.get("/:semester/:courseCode", async (req, res) => {
  try {
    const { semester, courseCode } = req.params;

    const files = await Resource.find({
      semester,
      courseCode
    }).populate("uploadedBy", "name");

    res.json(files);

  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Failed to fetch resources" });
  }
});

module.exports = router;