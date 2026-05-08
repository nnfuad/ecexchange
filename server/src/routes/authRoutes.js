const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
// const transporter = require("../config/mailer");
const resend = require("../config/mailer");

const router = express.Router();

/* =========================
   SIGNUP REQUEST (SEND OTP)
========================= */
router.post("/signup-request", async (req, res) => {
  try {
    const { name, roll, email, password } = req.body;

    if (!name || !roll || !email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const existing = await User.findOne({ email });

    if (existing && existing.isVerified)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await User.findOneAndUpdate(
      { email },
      {
        name,
        roll,
        email,
        password: hashedPassword,
        otp,
        otpExpires: Date.now() + 10 * 60 * 1000,
        isVerified: false
      },
      { upsert: true, new: true }
    );

    await resend.emails.send({
  from: "ECExchange <onboarding@resend.dev>",
  to: email,
  subject: "Verify Your ECExchange Account",
  html: `
  <div style="
    background:#0f172a;
    padding:40px 20px;
    font-family:Arial,sans-serif;
    color:white;
  ">
    <div style="
      max-width:600px;
      margin:auto;
      background:#111827;
      border-radius:18px;
      overflow:hidden;
      border:1px solid #1f2937;
      box-shadow:0 10px 30px rgba(0,0,0,0.4);
    ">

      <!-- HEADER -->
      <div style="
        background:linear-gradient(135deg,#2563eb,#7c3aed);
        padding:35px;
        text-align:center;
      ">
        <h1 style="
          margin:0;
          font-size:32px;
          color:white;
          letter-spacing:1px;
        ">
          📚 ECExchange
        </h1>

        <p style="
          margin-top:10px;
          color:#dbeafe;
          font-size:15px;
        ">
          University Resource Sharing Platform
        </p>
      </div>

      <!-- BODY -->
      <div style="padding:40px 35px;">

        <h2 style="
          margin-top:0;
          color:#f9fafb;
          font-size:26px;
        ">
          Verify Your Email
        </h2>

        <p style="
          color:#d1d5db;
          font-size:16px;
          line-height:1.7;
        ">
          Welcome to ECExchange.
          Use the verification code below to complete your signup.
        </p>

        <!-- OTP BOX -->
        <div style="
          margin:35px 0;
          text-align:center;
        ">
          <div style="
            display:inline-block;
            background:#1e293b;
            border:2px dashed #3b82f6;
            padding:22px 40px;
            border-radius:16px;
            letter-spacing:8px;
            font-size:38px;
            font-weight:bold;
            color:#60a5fa;
          ">
            ${otp}
          </div>
        </div>

        <p style="
          color:#9ca3af;
          font-size:14px;
          line-height:1.6;
        ">
          This OTP will expire shortly for security reasons.
          If you did not request this email, you may safely ignore it.
        </p>

      </div>

      <!-- FOOTER -->
      <div style="
        border-top:1px solid #1f2937;
        padding:20px;
        text-align:center;
        color:#6b7280;
        font-size:12px;
      ">
        © ${new Date().getFullYear()} ECExchange • Built for students
      </div>

    </div>
  </div>
  `
      });

    res.json({ message: "OTP sent to email" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup OTP failed" });
  }
});

/* =========================
   VERIFY SIGNUP OTP
========================= */
router.post("/signup-verify", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() }
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "OTP verification failed" });
  }
});

/* =========================
   LOGIN
========================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.isVerified)
      return res.status(401).json({ message: "Invalid credentials or not verified" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
});

/* =========================
   FORGOT PASSWORD (SEND OTP)
========================= */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // Do not reveal if user exists
    if (!user || !user.isVerified)
      return res.json({ message: "If account exists, OTP sent" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your password reset OTP is: ${otp}`
    });

    res.json({ message: "OTP sent to email" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending OTP" });
  }
});

/* =========================
   RESET PASSWORD
========================= */
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const user = await User.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() }
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    user.password = await bcrypt.hash(password, 10);
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Reset failed" });
  }
});

module.exports = router;