import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/auth");
  };

  return (
    <header
      style={{
        background: "#181818",
        padding: "14px 30px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #2a2a2a"
      }}
    >
      {/* LOGO AREA */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px", paddingLeft: "35%" }}>
        
         
             <Link to="/"><img src="/src/assets/logo.gif" height="85" width="200"/></Link>

        <span style={{ color: "#b3b3b3", fontSize: "14px" }}>
          Learn • Share • Grow
        </span>
      </div>

      {/* NAV LINKS */}
{/* NAV LINKS */}
<nav
  style={{
    display: "flex",
    gap: "22px",
    alignItems: "center",
    padding: "8px 16px",
    borderRadius: "999px",
    backgroundColor: "#181818",
    border: "1px solid #1DB954"
  }}
>
  <Link to="/">Home</Link>
  <Link to="/resources">Resources</Link>
  <Link to="/about">About</Link>

  {!token ? (
    <Link to="/auth">Login</Link>
  ) : (
    <button onClick={logout}>Logout</button>
  )}

  {/* CLOCK */}
  <span style={{ color: "#b3b3b3", fontSize: "13px" }}>
    {time.toLocaleTimeString()}
  </span>
</nav>
    </header>
  );
}