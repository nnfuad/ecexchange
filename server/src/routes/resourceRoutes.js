const express = require("express");
const router = express.Router();
// const multer = require("multer");

const Resource = require("../models/Resource");
const auth = require("../middleware/auth");

/* ===============================
   TEMP STORAGE (NO BODY ACCESS HERE)
=============================== */

// const upload = multer({
//   dest: path.join(__dirname, "../../uploads/tmp")
// });

/* ===============================
   UPLOAD ROUTE
=============================== */
// Original upload route using local storage
// router.post(
//   "/upload",
//   auth,
//   upload.single("file"),
//   async (req, res) => {
//     try {
//       const { semester, courseCode } = req.body;
//       console.log("BODY:", req.body);
//       console.log("FILE:", req.file); 
//       if (!semester || !courseCode || !req.file) {
//         return res.status(400).json({
//           message: "Missing required fields"
//         });
//       }

//       const safeCourse = courseCode.replace(/\s/g, "-");

//       const finalDir = path.join(
//         __dirname,
//         "../../uploads",
//         semester,
//         safeCourse
//       );

//       fs.mkdirSync(finalDir, { recursive: true });

//       const finalPath = path.join(
//         finalDir,
//         req.file.filename + path.extname(req.file.originalname)
//       );

//       fs.renameSync(req.file.path, finalPath);

//       const filePath =
//         "/uploads/" +
//         semester +
//         "/" +
//         safeCourse +
//         "/" +
//         path.basename(finalPath);

//       const resource = await Resource.create({
//         semester,
//         courseCode,
//         originalName: req.file.originalname,
//         filename: path.basename(finalPath),
//         filePath,
//         fileType: req.file.mimetype,
//         uploadedBy: req.user.id
//       });

//       res.json(resource);
//     } catch (err) {
//       console.error("Upload error:", err);
//       res.status(500).json({
//         message: "Upload failed"
//       });
//     }
//   }
// );

// Uploading with Cloudinary
const upload = require("../config/upload");
router.post("/upload", auth, upload.single("file"), async (req, res) => {
  try {
    const { semesterId, courseCode } = req.body;
    console.log("UPLOAD BODY:", req.body);
    console.log("UPLOAD FILE:", req.file);

    if (!semesterId || !courseCode || !req.file) {
      console.log("UPLOAD FILE:", req.file);
      return res.status(400).json({ message: "Missing required fields" });
    }

    const resource = await Resource.create({
      semester: semesterId,
      courseCode,
      originalName: req.file.originalname,
      fileType: req.file.mimetype,
      fileUrl: req.file.path, // Cloudinary URL
      uploadedBy: req.user.id
    });
    console.log("Saved URL:", resource.fileUrl);
    res.json(resource);
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ message: "Upload failed" });
  }
});

/* ===============================
   GET FILES
=============================== */
// Get files for a specific semester and course
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

// General search endpoint with multiple filters
router.get("/", async (req, res) => {
  try {
    const { semester, courseCode, type, search } = req.query;

    let filter = {};

    if (semester) {
      filter.semester = semester;
    }

    if (courseCode) {
      filter.courseCode = courseCode.replace(/-/g, " ");
    }

    if (type) {
      filter.fileType = new RegExp(type, "i");
    }

    if (search) {
      filter.originalName = new RegExp(search, "i");
    }

    const files = await Resource.find(filter)
      .populate("uploadedBy", "name")
      .sort({ createdAt: -1 });

    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Search failed" });
  }
});

/* ===============================
   DELETE FILE
=============================== */

router.delete("/:id", auth, async (req, res) => {
  try {
    const file = await Resource.findById(req.params.id);
    console.log("Delete request for file ID:", req.params.id, "by user:", req.user.id);

    if (!file) {
      console.log("File not found for deletion, ID:", req.params.id);
      return res.status(404).json({ message: "Not found" });
    }

    if (file.uploadedBy.toString() !== req.user.id) {
      console.log(
        "Unauthorized delete attempt by user:",
        req.user.id,
        "for file:",
        file._id
      );
      return res.status(403).json({ message: "Not allowed" });
    }

    await file.deleteOne();

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;