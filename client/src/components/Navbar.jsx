import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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
        padding: "14px 18px",
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
          gap: "16px"
        }}
      >
        {/* LOGO */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            minWidth: 0
          }}
        >
          <Link to="/">
            <img
              src="/logo.gif"
              alt="logo"
              style={{
                width: "150px",
                maxWidth: "40vw",
                height: "auto",
                display: "block"
              }}
            />
          </Link>

          <span
            style={{
              color: "#b3b3b3",
              fontSize: "12px",
              whiteSpace: "nowrap"
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
            border: "1px solid #1DB954",
            color: "#1DB954",
            borderRadius: "8px",
            padding: "8px 12px",
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
          marginTop: "18px",
          padding: "16px",
          borderRadius: "16px",
          background: "#111",
          border: "1px solid #1DB954"
        }}
      >
        <Link to="/" onClick={() => setMenuOpen(false)}>
          Home
        </Link>

        <Link to="/resources" onClick={() => setMenuOpen(false)}>
          Resources
        </Link>

        <Link to="/about" onClick={() => setMenuOpen(false)}>
          About
        </Link>

        {!token ? (
          <Link to="/auth" onClick={() => setMenuOpen(false)}>
            Login
          </Link>
        ) : (
          <button
            onClick={() => {
              logout();
              setMenuOpen(false);
            }}
            style={{
              width: "fit-content"
            }}
          >
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