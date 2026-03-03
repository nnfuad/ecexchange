const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Resource = require("../models/Resource");
const auth = require("../middleware/auth");

/* ===============================
   TEMP STORAGE (NO BODY ACCESS HERE)
=============================== */

const upload = multer({
  dest: path.join(__dirname, "../../uploads/tmp")
});

/* ===============================
   UPLOAD ROUTE
=============================== */

router.post(
  "/upload",
  auth,
  upload.single("file"),
  async (req, res) => {
    try {
      const { semester, courseCode } = req.body;
      console.log("BODY:", req.body);
      console.log("FILE:", req.file); 
      if (!semester || !courseCode || !req.file) {
        return res.status(400).json({
          message: "Missing required fields"
        });
      }

      const safeCourse = courseCode.replace(/\s/g, "-");

      const finalDir = path.join(
        __dirname,
        "../../uploads",
        semester,
        safeCourse
      );

      fs.mkdirSync(finalDir, { recursive: true });

      const finalPath = path.join(
        finalDir,
        req.file.filename + path.extname(req.file.originalname)
      );

      fs.renameSync(req.file.path, finalPath);

      const filePath =
        "/uploads/" +
        semester +
        "/" +
        safeCourse +
        "/" +
        path.basename(finalPath);

      const resource = await Resource.create({
        semester,
        courseCode,
        originalName: req.file.originalname,
        filename: path.basename(finalPath),
        filePath,
        fileType: req.file.mimetype,
        uploadedBy: req.user.id
      });

      res.json(resource);
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({
        message: "Upload failed"
      });
    }
  }
);

/* ===============================
   GET FILES
=============================== */

router.get("/:semester/:courseCode", async (req, res) => {
  try {
    const { semester, courseCode } = req.params;

    const normalizedCourse = courseCode.replace(/-/g, " ");

    const files = await Resource.find({
      semester,
      courseCode: normalizedCourse
    }).populate("uploadedBy", "name");

    res.json(files);
  } catch {
    res.status(500).json({ message: "Fetch failed" });
  }
});

/* ===============================
   DELETE FILE
=============================== */

router.delete("/:id", auth, async (req, res) => {
  try {
    const file = await Resource.findById(req.params.id);

    if (!file)
      return res.status(404).json({ message: "Not found" });

    if (file.uploadedBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    const absolutePath = path.join(
      __dirname,
      "../../",
      file.filePath
    );

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }

    await file.deleteOne();

    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;