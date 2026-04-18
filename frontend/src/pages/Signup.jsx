// src/pages/Signup.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(username, email, password);
      navigate("/");
    } catch (err) {
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Georgia, serif",
      overflow: "hidden",
    }}>

      {/* ── Background image ── */}
      <img
        src="/images/signup.jpg"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center",
          filter: "brightness(1.0) contrast(0.5) saturate(0.5)"
        }}
      />

      {/* Dark overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(10, 20, 12, 0.0)",
      }}/>

      {/* Bottom tagline */}
      <div style={{
        position: "absolute", bottom: 20, left: 0, right: 0,
        textAlign: "center", zIndex: 3,
        fontSize: 11, color: "rgba(255,245,220,0.45)",
        letterSpacing: "0.1em", fontFamily: "Georgia, serif",
      }}>
        DISCOVER · CONTRIBUTE · EXPLORE
      </div>

      {/* ── Form card ── */}
      <div style={{
        position: "relative", zIndex: 3,
        width: 340,
        background: "rgba(255, 251, 244, 0.97)",
        borderRadius: 20,
        padding: "36px 32px 32px",
        border: "0.5px solid rgba(180,160,120,0.3)",
        margin: "40px 16px",
      }}>

        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: "#C4622D",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="3" fill="#fff"/>
              <path d="M7 1 L7 3 M7 11 L7 13 M1 7 L3 7 M11 7 L13 7"
                stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontSize: 15, color: "#2A1A0A", fontFamily: "Georgia, serif" }}>
            KhojIndia
          </span>
        </div>

        <h2 style={{
          fontSize: 22, color: "#2A1A0A", fontWeight: "normal",
          marginBottom: 4, fontFamily: "Georgia, serif",
        }}>
          Create your account
        </h2>
        <p style={{
          fontSize: 13, color: "#7A6A5A", marginBottom: 28,
          lineHeight: 1.5, fontFamily: "Georgia, serif",
        }}>
          Join a community uncovering India's forgotten places
        </p>

        <form onSubmit={handleSubmit}>

          {/* Username */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Username</label>
            <input
              type="text"
              placeholder="e.g. mountain_khoji"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#C4622D"}
              onBlur={(e) => e.target.style.borderColor = "#D8C8B0"}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#C4622D"}
              onBlur={(e) => e.target.style.borderColor = "#D8C8B0"}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#C4622D"}
              onBlur={(e) => e.target.style.borderColor = "#D8C8B0"}
            />
          </div>

          {/* Error */}
          {error && (
            <p style={{
              fontSize: 13, color: "#A32D2D",
              background: "#FCEBEB",
              border: "0.5px solid #F09595",
              borderRadius: 8, padding: "8px 12px",
              marginBottom: 14, fontFamily: "Georgia, serif",
            }}>
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: 13,
              background: loading ? "#5A8A6A" : "#2D5A3A",
              color: "#E8F5E9",
              border: "none", borderRadius: 10,
              fontSize: 15, cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "Georgia, serif",
              letterSpacing: "0.02em",
            }}
          >
            {loading ? "Creating account..." : "Begin your khoj"}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "20px 0 16px" }}>
          <div style={{ flex: 1, height: "0.5px", background: "#D8C8B0" }}/>
          <span style={{ fontSize: 12, color: "#B0A090", fontFamily: "Georgia, serif" }}>
            already a khoji?
          </span>
          <div style={{ flex: 1, height: "0.5px", background: "#D8C8B0" }}/>
        </div>

        <div style={{ textAlign: "center", fontSize: 13, color: "#7A6A5A", fontFamily: "Georgia, serif" }}>
          <span
            onClick={() => navigate("/login")}
            style={{ color: "#C4622D", cursor: "pointer" }}
          >
            Sign in to your account
          </span>
        </div>

      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  fontSize: 11,
  color: "#7A6A5A",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginBottom: 5,
  fontFamily: "Georgia, serif",
};

const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  border: "0.5px solid #D8C8B0",
  borderRadius: 10,
  fontSize: 14,
  color: "#2A1A0A",
  background: "#FFFDF8",
  outline: "none",
  fontFamily: "Georgia, serif",
  transition: "border-color 0.15s",
};

export default Signup;