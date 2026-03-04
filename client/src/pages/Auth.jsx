import { useState } from "react";

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    roll: "",
    email: "",
    password: "",
    otp: ""
  });

  const API = "https://ecexchange-api.onrender.com/api/auth";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const requestSignup = async () => {
    const res = await fetch(`${API}/signup-request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    alert("OTP sent to your email");
    setMode("signup-otp");
  };

  const verifySignup = async () => {
    const res = await fetch(`${API}/signup-verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, otp: form.otp })
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    localStorage.setItem("token", data.token);
    window.location.href = "/";
  };

  const login = async () => {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        password: form.password
      })
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    localStorage.setItem("token", data.token);
    window.location.href = "/";
  };

  const forgotPassword = async () => {
    const res = await fetch(`${API}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email })
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    alert("OTP sent to email");
    setMode("reset");
  };

  const resetPassword = async () => {
    const res = await fetch(`${API}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        otp: form.otp,
        password: form.password
      })
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    alert("Password reset successful");
    setMode("login");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "login") return login();
    if (mode === "signup") return requestSignup();
    if (mode === "signup-otp") return verifySignup();
    if (mode === "forgot") return forgotPassword();
    if (mode === "reset") return resetPassword();
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={{ marginBottom: "6px" }}>
          {mode === "login" && "Welcome Back"}
          {mode === "signup" && "Create Account"}
          {mode === "signup-otp" && "Verify OTP"}
          {mode === "forgot" && "Forgot Password"}
          {mode === "reset" && "Reset Password"}
        </h1>

        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <>
              <input name="name" value={form.name} placeholder="Full Name" onChange={handleChange} required />
              <input name="roll" value={form.roll} placeholder="Roll Number" onChange={handleChange} required />
            </>
          )}

          {(mode !== "signup-otp") && (
            <input
              name="email"
              type="email"
              value={form.email}
              placeholder="Email"
              onChange={handleChange}
              required
            />
          )}

          {(mode === "login" || mode === "signup" || mode === "reset") && (
            <div style={{ position: "relative" }}>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                placeholder="Password"
                onChange={handleChange}
                required
              />
              <span onClick={() => setShowPassword(!showPassword)} style={eyeStyle}>
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          )}

          {(mode === "signup-otp" || mode === "reset") && (
            <input
              name="otp"
              value={form.otp}
              placeholder="Enter OTP"
              onChange={handleChange}
              required
            />
          )}

          <button type="submit" style={{ marginTop: "16px" }}>
            Continue
          </button>
        </form>

        <div style={{ marginTop: "18px", fontSize: "14px" }}>
          {mode === "login" && (
            <>
              <span style={linkStyle} onClick={() => setMode("signup")}>Sign up</span>
              {" | "}
              <span style={linkStyle} onClick={() => setMode("forgot")}>Forgot password</span>
            </>
          )}

          {(mode === "signup" || mode === "signup-otp") && (
            <span style={linkStyle} onClick={() => setMode("login")}>
              Back to login
            </span>
          )}

          {(mode === "forgot" || mode === "reset") && (
            <span style={linkStyle} onClick={() => setMode("login")}>
              Back to login
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* STYLES */

const pageStyle = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "radial-gradient(circle at top, #1DB95422, #000 60%)"
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

const linkStyle = {
  color: "#1DB954",
  cursor: "pointer",
  fontWeight: "500"
};

const eyeStyle = {
  position: "absolute",
  right: "12px",
  top: "60%",
  transform: "translateY(-50%)",
  cursor: "pointer",
  fontSize: "14px"
};