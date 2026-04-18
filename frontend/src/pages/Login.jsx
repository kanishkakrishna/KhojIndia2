import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

// Dot (.) check karo aur extension sahi karo (e.g., .jpg ya .avif)
const BG_IMAGE = "/images/loim.jpg"; 

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      alert("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Lato', sans-serif", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Lato:wght@400;600;700&display=swap');
        .login-input {
          width: 100%; padding: 12px 16px; border-radius: 10px; border: 1.5px solid rgba(201,123,43,0.15);
          background: rgba(255,255,255,0.9); font-family: 'Lato', sans-serif; font-size: 14px;
          color: #2d1a0e; outline: none; transition: all 0.2s; box-sizing: border-box;
        }
        .login-input:focus { border-color: #c97b2b; background: #fff; box-shadow: 0 0 0 3px rgba(201,123,43,0.1); }
        .login-btn {
          width: 100%; padding: 13px; border: none; border-radius: 10px; cursor: pointer; font-weight: 700;
          font-size: 15px; background: linear-gradient(135deg, #c97b2b, #e8a04a); color: #fff;
          box-shadow: 0 4px 16px rgba(201,123,43,0.3); transition: all 0.2s;
        }
        .login-btn:hover:not(:disabled) { transform: translateY(-1px); filter: brightness(1.1); }
      `}</style>

      {/* ── Background Image Layer ── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <img 
          src={BG_IMAGE} 
          alt="bg" 
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.6) saturate(0.8)" }} 
        />
        {/* Overlay ko light aur subtle kiya hai taaki peela-pan khatam ho */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))" }} />
      </div>

      {/* ── Login Card ── */}
      <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: "400px", padding: "0 20px" }}>
        <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderRadius: "28px", padding: "45px 35px", boxShadow: "0 20px 50px rgba(0,0,0,0.2)" }}>

          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <span style={{ fontSize: "3rem" }}>🧭</span>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 900, color: "#2d1a0e", marginTop: "10px" }}>
              Welcome Back
            </h1>
            <p style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#c97b2b", fontWeight: 700, marginTop: "5px" }}>
              KhojIndia · Yatri Portal
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div>
              <label style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#5a4a3a", display: "block", marginBottom: "8px" }}>Email Address</label>
              <input className="login-input" type="email" placeholder="yatri@khojindia.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#5a4a3a", display: "block", marginBottom: "8px" }}>Password</label>
              <input className="login-input" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <button className="login-btn" type="submit" disabled={loading} style={{ marginTop: "10px" }}>
              {loading ? "Identifying Yatri..." : "Explore Again 🗺️"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "14px", color: "#5a4a3a", marginTop: "25px" }}>
            New here?{" "}
            <Link to="/signup" style={{ color: "#c97b2b", fontWeight: 700, textDecoration: "none" }}>
              Join the journey →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;