import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Home,
  BookOpen,
  Info,
  LogIn,
  LogOut
} from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [time, setTime] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);

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
        padding: "12px 14px",
        borderBottom: "1px solid #2a2a2a",
        position: "sticky",
        top: 0,
        zIndex: 1000
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px"
        }}
      >
        {/* LOGO */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            minWidth: 0
          }}
        >
          <Link to="/">
            <img
              src="/logo.gif"
              alt="logo"
              style={{
                width: "130px",
                maxWidth: "40vw",
                height: "auto",
                display: "block"
              }}
            />
          </Link>

          <span
            style={{
              color: "#b3b3b3",
              fontSize: "11px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "120px"
            }}
          >
            Learn • Share • Grow
          </span>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "transparent",
            border: "1px solid rgba(29,185,84,0.65)",
            boxShadow: "0 0 14px rgba(29,185,84,0.45)",
            color: "#1DB954",
            textShadow: "0 0 12px rgba(29,185,84,0.9)",
            borderRadius: "8px",
            padding: "8px 10px",
            cursor: "pointer",
            fontSize: "18px"
          }}
        >
          ☰
        </button>
      </div>

      {/* NAVIGATION */}
      <nav
        style={{
          display: menuOpen ? "flex" : "none",
          flexDirection: "column",
          gap: "14px",
          marginTop: "14px",
          padding: "16px",
          borderRadius: "16px",
          background: "#111",
          border: "1px solid #1DB954",
          backdropFilter: "blur(12px)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.45)"
        }}
      >
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          style={navItemStyle}
        >
          <Home size={18} />
          Home
        </Link>

        <Link
          to="/resources"
          onClick={() => setMenuOpen(false)}
          style={navItemStyle}
        >
          <BookOpen size={18} />
          Resources
        </Link>

        <Link
          to="/about"
          onClick={() => setMenuOpen(false)}
          style={navItemStyle}
        >
          <Info size={18} />
          About
        </Link>

        {!token ? (
          <Link
            to="/auth"
            onClick={() => setMenuOpen(false)}
            style={navItemStyle}
          >
            <LogIn size={18} />
            Login
          </Link>
        ) : (
          <button
            onClick={() => {
              logout();
              setMenuOpen(false);
            }}
            style={{
              ...navItemStyle,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              width: "100%",
              textAlign: "left"
            }}
          >
            <LogOut size={18} />
            Logout
          </button>
        )}

        {/* CLOCK */}
        <span
          style={{
            color: "#b3b3b3",
            fontSize: "13px"
          }}
        >
          {time.toLocaleTimeString()}
        </span>
      </nav>
    </header>
  );
}

const navItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "12px 14px",
  borderRadius: "12px",
  color: "white",
  textDecoration: "none",
  background: "rgba(255,255,255,0.03)",
  transition: "all 0.25s ease"
};