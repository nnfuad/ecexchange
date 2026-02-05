import { useState } from "react";

export default function Auth() {
  const [mode, setMode] = useState("login"); // login | signup
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    roll: "",
    email: "",
    password: ""
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async e => {
  e.preventDefault();

  try {
    const url =
      mode === "login"
        ? "http://localhost:5050/api/auth/login"
        : "http://localhost:5050/api/auth/signup";

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Authentication failed");
      return;
    }

    // SAVE TOKEN
    localStorage.setItem("token", data.token);

    // REDIRECT
    window.location.href = "/";
  } catch (err) {
    alert("Server error");
  }
};

  return (
    <div style={pageStyle}>
      {/* GLASS CARD */}
      <div style={cardStyle}>
        {/* HEADER */}
        <h1 style={{ marginBottom: "6px" }}>
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h1>

        <p style={subText}>
          {mode === "login"
            ? "Login to access ECE resources"
            : "Join ECE’s resource sharing platform"}
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <>
              <input
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                required
              />

              <input
                name="roll"
                placeholder="Roll Number"
                onChange={handleChange}
                required
              />
            </>
          )}

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
          />

          {/* PASSWORD WITH TOGGLE */}
          <div style={{ position: "relative" }}>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={handleChange}
              required
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              style={eyeStyle}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button type="submit" style={{ marginTop: "16px" }}>
            {mode === "login" ? "Login" : "Sign Up"}
          </button>
        </form>

        {/* FOOTER */}
        <div style={{ marginTop: "22px", fontSize: "14px" }}>
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <span
                style={linkStyle}
                onClick={() => setMode("signup")}
              >
                Sign up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                style={linkStyle}
                onClick={() => setMode("login")}
              >
                Login
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===============================
   STYLES
=============================== */

const pageStyle = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background:
    "radial-gradient(circle at top, #1DB95422, #000 60%)"
};

const cardStyle = {
  width: "380px",
  maxWidth: "92%",
  padding: "32px",
  borderRadius: "16px",
  background: "rgba(24, 24, 24, 0.65)",
  backdropFilter: "blur(14px)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
  textAlign: "center"
};

const subText = {
  color: "#b3b3b3",
  fontSize: "14px",
  marginBottom: "22px"
};

const linkStyle = {
  color: "#1DB954",
  cursor: "pointer",
  fontWeight: "500"
};

const eyeStyle = {
  position: "absolute",
  right: "12px",
  top: "37%",
  transform: "translateY(-50%)",
  cursor: "pointer",
  fontSize: "14px",
  opacity: 0.8
};