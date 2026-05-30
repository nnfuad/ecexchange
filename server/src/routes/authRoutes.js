const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const transporter = require("../config/mailer");

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

    await transporter.sendTransacEmail({
      sender: {
        name: "ECExchange",
        email: process.env.EMAIL_USER,
      },
      to: [
        {
          email,
        },
      ],
      subject: "Verify Your ECExchange Account",
      htmlContent: `
      <div style="margin:0;padding:0;background:#0b1120;font-family:Inter,Arial,sans-serif;">
        <div style="max-width:620px;margin:40px auto;background:#111827;border-radius:24px;overflow:hidden;border:1px solid #1f2937;box-shadow:0 25px 50px rgba(0,0,0,0.45);">

          <div style="background:linear-gradient(135deg,#2563eb,#7c3aed);padding:48px 32px;text-align:center;">
            <div style="font-size:46px;margin-bottom:10px;">📚</div>
            <h1 style="margin:0;color:white;font-size:34px;font-weight:800;letter-spacing:0.5px;">
              ECExchange
            </h1>
            <p style="margin-top:14px;color:#dbeafe;font-size:15px;line-height:1.6;">
              Smart academic resource sharing for university students.
            </p>
          </div>

          <div style="padding:45px 38px;background:#111827;">
            <h2 style="margin:0 0 18px 0;color:#f9fafb;font-size:30px;font-weight:700;">
              Verify your email
            </h2>

            <p style="color:#d1d5db;font-size:16px;line-height:1.8;margin-bottom:32px;">
              Welcome to ECExchange. Use the verification code below to activate your account.
            </p>

            <div style="text-align:center;margin:40px 0;">
              <div style="display:inline-block;background:linear-gradient(135deg,#1d4ed8,#7c3aed);padding:24px 42px;border-radius:20px;color:white;font-size:42px;font-weight:800;letter-spacing:10px;box-shadow:0 12px 30px rgba(37,99,235,0.35);">
                ${otp}
              </div>
            </div>

            <div style="background:#0f172a;border:1px solid #1e293b;border-radius:18px;padding:22px;margin-top:35px;">
              <p style="margin:0;color:#94a3b8;font-size:14px;line-height:1.8;">
                • This OTP expires in 10 minutes.<br>
                • Never share your OTP with anyone.<br>
                • If this wasn't you, you can safely ignore this email.
              </p>
            </div>
          </div>

          <div style="padding:22px;text-align:center;background:#0b1220;border-top:1px solid #1f2937;color:#64748b;font-size:13px;">
            © ${new Date().getFullYear()} ECExchange • Built for students
          </div>
        </div>
      </div>
      `,
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

    await transporter.sendTransacEmail({
      sender: {
        name: "ECExchange",
        email: process.env.EMAIL_USER,
      },
      to: [
        {
          email,
        },
      ],
      subject: "Reset Your ECExchange Password",
      htmlContent: `
      <div style="margin:0;padding:0;background:#020617;font-family:Inter,Arial,sans-serif;">
        <div style="max-width:620px;margin:40px auto;background:#0f172a;border-radius:24px;overflow:hidden;border:1px solid #1e293b;box-shadow:0 25px 50px rgba(0,0,0,0.45);">

          <div style="background:linear-gradient(135deg,#dc2626,#7c3aed);padding:42px 32px;text-align:center;">
            <h1 style="margin:0;color:white;font-size:32px;font-weight:800;">
              Password Reset
            </h1>
          </div>

          <div style="padding:42px 36px;">
            <p style="color:#cbd5e1;font-size:16px;line-height:1.8;">
              We received a request to reset your ECExchange password.
            </p>

            <div style="text-align:center;margin:38px 0;">
              <div style="display:inline-block;background:#111827;border:2px solid #7c3aed;padding:22px 38px;border-radius:18px;color:#f8fafc;font-size:40px;font-weight:800;letter-spacing:10px;">
                ${otp}
              </div>
            </div>

            <p style="color:#94a3b8;font-size:14px;line-height:1.8;">
              This code expires in 10 minutes. If you did not request a password reset, you may safely ignore this email.
            </p>
          </div>

          <div style="padding:20px;text-align:center;border-top:1px solid #1e293b;color:#64748b;font-size:13px;background:#020617;">
            ECExchange Security System
          </div>
        </div>
      </div>
      `,
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