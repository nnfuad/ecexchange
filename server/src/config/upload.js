// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const { semester, courseCode } = req.body;

//     if (!semester || !courseCode) {
//       return cb(new Error("Missing semester or course"));
//     }

//     const safeCourse = courseCode.replace(" ", "-");
//     const uploadPath = path.join(
//       __dirname,
//       "../../uploads",
//       semester,
//       safeCourse
//     );

//     fs.mkdirSync(uploadPath, { recursive: true });
//     cb(null, uploadPath);
//   },

//   filename: function (req, file, cb) {
//     const unique =
//       Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, unique + path.extname(file.originalname));
//   }
// });

// module.exports = multer({ storage });

// This file is now obsolete since we're using Cloudinary for storage.
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => {
    const { semesterId, courseCode } = req.body;

    if (!semesterId || !courseCode) {
      throw new Error("Missing semester or courseCode");
    }

    const cleanName = file.originalname
      .replace(/\.[^/.]+$/, "") // remove extension
      .replace(/\s+/g, "-")
      .replace(/[()]/g, "");

    return {
      folder: `ecexchange/${semesterId}/${courseCode.replace(/\s+/g, "-")}`,

      // VERY IMPORTANT
      // Forces ALL files to be downloadable resources
      resource_type: "raw",

      public_id: `${Date.now()}-${cleanName}`,

      use_filename: true,
      unique_filename: false
    };
  }
});

const upload = multer({
  storage,

  limits: {
    fileSize: 25 * 1024 * 1024 // 25MB
  },

  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/pdf",

      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",

      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

      "application/zip",
      "application/x-zip-compressed",

      "image/png",
      "image/jpeg",
      "image/jpg",

      "text/plain"
    ];

    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Unsupported file type"));
    }

    cb(null, true);
  }
});

module.exports = upload;