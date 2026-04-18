import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <style>{`
        .nav-wrapper {
          background-color: #1A2E1F;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          width: 100%;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
        }
        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 24px;
          height: 60px;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .desktop-menu {
          display: none; /* Mobile par hide rahega */
          align-items: center;
          gap: 24px;
        }
        .mobile-btn {
          display: block;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }
        .mobile-menu {
          display: flex;
          flex-direction: column;
          padding: 0 24px 16px;
          gap: 16px;
          border-top: 1px solid rgba(255,255,255,0.08);
          background-color: #1A2E1F;
        }
        
        /* Desktop Screen aate hi menu dikhega aur button gayab ho jayega */
        @media (min-width: 768px) {
          .desktop-menu { display: flex; }
          .mobile-btn { display: none; }
          .mobile-menu { display: none; }
        }
      `}</style>

      <nav className="nav-wrapper">
        <div className="nav-container">
          
          {/* Logo */}
          <Link to="/" className="nav-logo">
            <span>🧭</span>
            <span style={{ color: "#fff", fontSize: "18px", fontWeight: 600, letterSpacing: "-0.01em" }}>
              KhojIndia
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="desktop-menu">
            {[
              { to: "/places", label: "Places" },
              { to: "/search", label: "Search" },
              { to: "/leaderboard", label: "Leaderboard" },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                style={{
                  color: "rgba(255,255,255,0.75)",
                  fontSize: "14px",
                  textDecoration: "none",
                  borderBottom: "2px solid transparent",
                  paddingBottom: "2px",
                  transition: "color 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = "#fff";
                  e.target.style.borderBottomColor = "#E8A87C";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "rgba(255,255,255,0.75)";
                  e.target.style.borderBottomColor = "transparent";
                }}
              >
                {label}
              </Link>
            ))}

            <div style={{ width: "1px", height: "18px", background: "rgba(255,255,255,0.15)" }} />

            <Link
              to="/ai-planner"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                background: "rgba(196,98,45,0.25)",
                border: "1px solid rgba(196,98,45,0.55)",
                color: "#F5C4B3",
                fontSize: "13px",
                fontWeight: 500,
                padding: "6px 14px",
                borderRadius: "20px",
                textDecoration: "none",
              }}
            >
              ✦ AI Trip Planner
            </Link>

            <Link
              to="/contribute"
              style={{ color: "#9FE1CB", fontSize: "14px", fontWeight: 500, textDecoration: "none" }}
            >
              Contribute
            </Link>

            {/* Desktop Auth */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginLeft: "8px" }}>
              {user ? (
                <>
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "50%", background: "#C4622D",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "12px", color: "#fff", fontWeight: 500, flexShrink: 0
                  }}>
                    {user.name?.slice(0, 2).toUpperCase() || "ME"}
                  </div>
                  <button
                    onClick={logout}
                    style={{
                      background: "transparent", color: "rgba(255,255,255,0.6)",
                      border: "1px solid rgba(255,255,255,0.15)", padding: "6px 12px",
                      borderRadius: "6px", fontSize: "13px", cursor: "pointer",
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" style={{
                    color: "rgba(255,255,255,0.75)", fontSize: "14px", border: "1px solid rgba(255,255,255,0.2)",
                    padding: "6px 18px", borderRadius: "6px", textDecoration: "none",
                  }}>
                    Login
                  </Link>
                  <Link to="/signup" style={{
                    background: "#C4622D", color: "#fff", fontSize: "14px", fontWeight: 500,
                    padding: "6px 18px", borderRadius: "6px", textDecoration: "none",
                  }}>
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <button className="mobile-btn" onClick={() => setMenuOpen(!menuOpen)}>
            <div style={{ width: "22px", height: "2px", background: "#fff", marginBottom: "5px", borderRadius: "2px" }} />
            <div style={{ width: "22px", height: "2px", background: "#fff", marginBottom: "5px", borderRadius: "2px" }} />
            <div style={{ width: "22px", height: "2px", background: "#fff", borderRadius: "2px" }} />
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {menuOpen && (
          <div className="mobile-menu">
            {[
              { to: "/places", label: "Places" },
              { to: "/search", label: "Search" },
              { to: "/leaderboard", label: "Leaderboard" },
              { to: "/contribute", label: "Contribute" },
            ].map(({ to, label }) => (
              <Link key={to} to={to} onClick={() => setMenuOpen(false)}
                style={{ color: "rgba(255,255,255,0.8)", fontSize: "15px", textDecoration: "none", paddingTop: "12px" }}>
                {label}
              </Link>
            ))}

            <Link to="/ai-planner" onClick={() => setMenuOpen(false)}
              style={{
                display: "inline-flex", alignItems: "center", gap: "5px", background: "rgba(196,98,45,0.25)",
                border: "1px solid rgba(196,98,45,0.55)", color: "#F5C4B3", fontSize: "13px", fontWeight: 500,
                padding: "7px 16px", borderRadius: "20px", textDecoration: "none", width: "fit-content", marginTop: "8px"
              }}>
              ✦ AI Trip Planner
            </Link>

            <div style={{ display: "flex", gap: "10px", paddingTop: "8px" }}>
              {user ? (
                <button onClick={() => { logout(); setMenuOpen(false); }}
                  style={{ background: "transparent", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.2)", padding: "7px 20px", borderRadius: "6px", fontSize: "14px", cursor: "pointer" }}>
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)}
                    style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", border: "1px solid rgba(255,255,255,0.2)", padding: "7px 20px", borderRadius: "6px", textDecoration: "none" }}>
                    Login
                  </Link>
                  <Link to="/signup" onClick={() => setMenuOpen(false)}
                    style={{ background: "#C4622D", color: "#fff", fontSize: "14px", fontWeight: 500, padding: "7px 20px", borderRadius: "6px", textDecoration: "none" }}>
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;