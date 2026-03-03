const express = require("express");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/protected", protect, (req, res) => {
  res.json({
    message: "You are authorized",
    user: req.user
  });
});

module.exports = router;