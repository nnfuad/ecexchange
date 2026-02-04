import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const navigate = useNavigate();

  // Modes:
  // login | signup | signup-otp | forgot | otp
  const [mode, setMode] = useState("login");

  const [form, setForm] = useState({
    name: "",
    roll: "",
    email: "",
    password: "",
    otp: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/resources");
    }
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // =====================
  // LOGIN
  // =====================
  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5050/api/auth/login",
        {
          email: form.email,
          password: form.password
        }
      );
      localStorage.setItem("token", res.data.token);
      navigate("/resources");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  // =====================
  // SIGNUP → SEND OTP
  // =====================
  const handleSignupRequest = async () => {
    try {
      await axios.post(
        "http://localhost:5050/api/auth/signup-request",
        {
          name: form.name,
          roll: form.roll,
          email: form.email,
          password: form.password
        }
      );
      alert("Signup OTP sent to your email");
      setMode("signup-otp");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  // =====================
  // SIGNUP → VERIFY OTP
  // =====================
  const handleSignupVerify = async () => {
    try {
      await axios.post(
        "http://localhost:5050/api/auth/signup-verify",
        {
          email: form.email,
          otp: form.otp
        }
      );
      alert("Signup successful. Please login.");
      setMode("login");
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
    }
  };

  // =====================
  // FORGOT PASSWORD → SEND OTP
  // =====================
  const handleForgotPassword = async () => {
    try {
      await axios.post(
        "http://localhost:5050/api/auth/forgot-password",
        { email: form.email }
      );
      alert("OTP sent to your email");
      setMode("otp");
    } catch {
      alert("Failed to send OTP");
    }
  };

  // =====================
  // RESET PASSWORD → VERIFY OTP
  // =====================
  const handleResetPassword = async () => {
    try {
      await axios.post(
        "http://localhost:5050/api/auth/reset-password",
        {
          email: form.email,
          otp: form.otp,
          password: form.password
        }
      );
      alert("Password reset successful");
      setMode("login");
    } catch (err) {
      alert(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div>
      <h1>
        {mode === "login" && "Login"}
        {mode === "signup" && "Signup"}
        {mode === "signup-otp" && "Verify Signup OTP"}
        {mode === "forgot" && "Forgot Password"}
        {mode === "otp" && "Reset Password"}
      </h1>

      {/* SIGNUP FIELDS */}
      {mode === "signup" && (
        <>
          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
          />
          <br />
          <input
            name="roll"
            placeholder="Roll"
            onChange={handleChange}
          />
          <br />
        </>
      )}

      {/* EMAIL */}
      {(mode === "login" ||
        mode === "signup" ||
        mode === "forgot" ||
        mode === "otp" ||
        mode === "signup-otp") && (
        <>
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />
          <br />
        </>
      )}

      {/* PASSWORD */}
      {(mode === "login" ||
        mode === "signup" ||
        mode === "otp") && (
        <>
          <input
            type="password"
            name="password"
            placeholder={
              mode === "otp" ? "New Password" : "Password"
            }
            onChange={handleChange}
          />
          <br />
        </>
      )}

      {/* OTP INPUT */}
      {(mode === "otp" || mode === "signup-otp") && (
        <>
          <input
            name="otp"
            placeholder="Enter OTP"
            onChange={handleChange}
          />
          <br />
        </>
      )}

      {/* ACTION BUTTONS */}
      {mode === "login" && (
        <button onClick={handleLogin}>Login</button>
      )}

      {mode === "signup" && (
        <button onClick={handleSignupRequest}>
          Send Signup OTP
        </button>
      )}

      {mode === "signup-otp" && (
        <button onClick={handleSignupVerify}>
          Verify OTP & Create Account
        </button>
      )}

      {mode === "forgot" && (
        <button onClick={handleForgotPassword}>
          Send OTP
        </button>
      )}

      {mode === "otp" && (
        <button onClick={handleResetPassword}>
          Reset Password
        </button>
      )}

      <br /><br />

      {/* MODE SWITCH LINKS */}
      {mode === "login" && (
        <>
          <p
            style={{ cursor: "pointer", color: "blue" }}
            onClick={() => setMode("signup")}
          >
            No account? Signup
          </p>
          <p
            style={{ cursor: "pointer", color: "blue" }}
            onClick={() => setMode("forgot")}
          >
            Forgot password?
          </p>
        </>
      )}

      {(mode === "signup" ||
        mode === "signup-otp" ||
        mode === "forgot" ||
        mode === "otp") && (
        <p
          style={{ cursor: "pointer", color: "blue" }}
          onClick={() => setMode("login")}
        >
          Back to Login
        </p>
      )}
    </div>
  );
}