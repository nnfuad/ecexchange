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

    return {
      folder: `ecexchange/${semesterId}/${courseCode.replace(" ", "-")}`,
      resource_type: "raw", // allows pdf, docx, ppt, zip, etc.
      public_id:
        Date.now() + "-" + file.originalname.replace(/\s+/g, "-")
    };
  }
});

const upload = multer({ storage });

module.exports = upload;