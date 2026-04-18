// src/pages/Contribute.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../axios";

// 🎨 Swap this to any background image you prefer
const BG_IMAGE = "/images/contributee.jpg";

function Contribute() {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    localName: "",
    state: "",
    district: "",
    description: "",
    media: null,
  });

  const [loading, setLoading] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setForm((prev) => ({ ...prev, [name]: file }));
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setForm((prev) => ({ ...prev, media: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !token) {
      toast.error("Please login first to contribute a place.");
      return;
    }

    if (form.media && form.media.size > 5 * 1024 * 1024) {
      toast.error("Image size exceeds 5MB limit. Please choose a smaller image.");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("AI Bouncer is scanning your place... 🕵️‍♂️");

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "media" && value === null) return;
      data.append(key, value);
    });

    try {
      await API.post("/contribute", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.dismiss(loadingToast);
      toast.success("Awesome! Your Hidden Gem is live! 🎉 You earned 1 Coin!");

      setForm({ localName: "", state: "", district: "", description: "", media: null });
      setPreviewUrl(null);
      setFileInputKey(Date.now());
    } catch (err) {
      console.error("Contribution error:", err);
      toast.dismiss(loadingToast);

      if (err.response && err.response.status === 403) {
        toast.error(
          (t) => (
            <span>
              <b>AI Bouncer Stopped You! 🛑</b>
              <br />
              <span style={{ fontSize: "14px", color: "#555", display: "block", marginTop: "4px" }}>
                {err.response.data.reason}
              </span>
            </span>
          ),
          { duration: 6000 }
        );
      } else {
        toast.error(err.response?.data?.error || "❌ Failed to contribute place.");
      }
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = user && token;
  const charCount = form.description.length;
  const charPct = Math.min((charCount / 1000) * 100, 100);

  return (
    <div 
  className="relative min-h-screen" 
  style={{ fontFamily: "'Lato', sans-serif" }}
>
  {/* ── Background Layer (Fixed Effect) ── */}
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <img
      src={BG_IMAGE}
      alt="Background"
      className="w-full h-full object-cover"
      style={{ 
        objectPosition: "center",
        // Agar brightness ya saturation chahiye toh yahan add kar sakte ho
        filter: "brightness(0.4)" 
      }}
    />
  </div>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Lato:wght@400;600;700&display=swap');

        .contribute-input {
          width: 100%;
          background: rgba(255, 252, 245, 0.85);
          border: 1.5px solid rgba(201, 123, 43, 0.25);
          border-radius: 12px;
          padding: 12px 16px;
          font-family: 'Lato', sans-serif;
          font-size: 14px;
          color: #2d1a0e;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          box-sizing: border-box;
        }
        .contribute-input:focus {
          border-color: #c97b2b;
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 0 0 0 3px rgba(201, 123, 43, 0.12);
        }
        .contribute-input::placeholder {
          color: #b09070;
        }

        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #c97b2b, #e8a04a);
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 14px;
          font-family: 'Lato', sans-serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 18px rgba(201, 123, 43, 0.35);
        }
        .submit-btn:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(201, 123, 43, 0.45);
        }
        .submit-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
        }

        .drop-zone {
          border: 2px dashed rgba(201, 123, 43, 0.45);
          border-radius: 14px;
          padding: 24px 16px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          background: rgba(255, 249, 238, 0.7);
        }
        .drop-zone.over, .drop-zone:hover {
          border-color: #c97b2b;
          background: rgba(255, 243, 220, 0.85);
        }

        .field-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #c97b2b;
          margin-bottom: 6px;
          display: block;
        }

        .form-card {
          animation: slideUp 0.5s ease both;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .step-badge {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #c97b2b, #e8a04a);
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
      `}</style>

      <div
  style={{
    minHeight: "100vh",
    position: "relative", // Z-index ke liye zaroori hai
    // Peela parda hata kar "Dark Premium" parda dala hai
    background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(6,6,6,0.9) 100%)",
    paddingTop: "48px",
    paddingBottom: "64px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    zIndex: 1
  }}
>
        {/* ── Hero Header ── */}
        <div style={{ textAlign: "center", marginBottom: "36px", padding: "0 16px" }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.55)",
              backdropFilter: "blur(14px)",
              borderRadius: "20px",
              padding: "24px 40px",
              border: "1px solid rgba(255,255,255,0.7)",
              boxShadow: "0 4px 24px rgba(180,100,20,0.1)",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "4px",
                textTransform: "uppercase",
                color: "#c97b2b",
                fontWeight: 700,
                marginBottom: "8px",
              }}
            >
              KhojIndia · Hidden Gems
            </p>
            <h1
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                fontWeight: 900,
                color: "#2d1a0e",
                lineHeight: 1.15,
                marginBottom: "10px",
              }}
            >
              Share a Hidden{" "}
              <span style={{ color: "#c97b2b" }}>Gem</span> 💎
            </h1>
            <p style={{ color: "#6b4226", fontSize: "14px", maxWidth: "380px", lineHeight: 1.6 }}>
              Be the Yatri who puts it on the map. Our AI Bouncer ensures only truly hidden places make it through.
            </p>
          </div>
        </div>

        {/* ── Form Card / Auth Guard ── */}
        <div
          className="form-card"
          style={{
            width: "100%",
            maxWidth: "520px",
            padding: "0 16px",
            boxSizing: "border-box",
          }}
        >
          {!isAuthenticated ? (
            /* ── Not Logged In ── */
            <div
              style={{
                background: "rgba(255,252,245,0.9)",
                backdropFilter: "blur(14px)",
                borderRadius: "24px",
                border: "1px solid rgba(255,220,160,0.7)",
                boxShadow: "0 8px 40px rgba(120,60,0,0.12)",
                padding: "48px 32px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "3.5rem", marginBottom: "16px" }}>🔒</div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.5rem",
                  color: "#2d1a0e",
                  marginBottom: "8px",
                }}
              >
                Yatri Login Required
              </h2>
              <p style={{ color: "#7a5c3a", fontSize: "14px", marginBottom: "28px", lineHeight: 1.6 }}>
                Join our community of explorers to contribute hidden places and earn coins!
              </p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                <Link
                  to="/login"
                  style={{
                    background: "linear-gradient(135deg, #c97b2b, #e8a04a)",
                    color: "#fff",
                    padding: "11px 28px",
                    borderRadius: "50px",
                    fontWeight: 700,
                    fontSize: "14px",
                    textDecoration: "none",
                    boxShadow: "0 4px 14px rgba(201,123,43,0.35)",
                  }}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  style={{
                    background: "rgba(255,255,255,0.85)",
                    color: "#c97b2b",
                    padding: "11px 28px",
                    borderRadius: "50px",
                    fontWeight: 700,
                    fontSize: "14px",
                    textDecoration: "none",
                    border: "1.5px solid #e8c48a",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          ) : (
            /* ── Contribution Form ── */
            <div
              style={{
                background: "rgba(255,252,245,0.9)",
                backdropFilter: "blur(16px)",
                borderRadius: "24px",
                border: "1px solid rgba(255,220,160,0.6)",
                boxShadow: "0 8px 48px rgba(120,60,0,0.14)",
                padding: "36px 32px",
              }}
            >
              {/* Greeting */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "28px",
                  paddingBottom: "20px",
                  borderBottom: "1px solid #f0e0c8",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #c97b2b, #e8a04a)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    flexShrink: 0,
                  }}
                >
                  🧭
                </div>
                <div>
                  <p style={{ fontSize: "12px", color: "#b09070", marginBottom: "2px" }}>
                    Logged in as
                  </p>
                  <p
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 700,
                      color: "#2d1a0e",
                      fontSize: "15px",
                    }}
                  >
                    {user?.name || user?.email || "Yatri"}
                  </p>
                </div>
                <div
                  style={{
                    marginLeft: "auto",
                    background: "#fef3e2",
                    color: "#b8660a",
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "4px 12px",
                    borderRadius: "50px",
                    border: "1px solid #f5d9a8",
                  }}
                >
                  🪙 Earn 1 Coin
                </div>
              </div>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                {/* Place Name */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <div className="step-badge">1</div>
                    <label className="field-label" style={{ margin: 0 }}>Place Name</label>
                  </div>
                  <input
                    className="contribute-input"
                    name="localName"
                    placeholder="e.g., Hidden Waterfall of Dudhsagar"
                    value={form.localName}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* State + District side by side */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <div className="step-badge">2</div>
                    <label className="field-label" style={{ margin: 0 }}>Location</label>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <input
                      className="contribute-input"
                      name="state"
                      placeholder="State (e.g., Goa)"
                      value={form.state}
                      onChange={handleChange}
                      required
                    />
                    <input
                      className="contribute-input"
                      name="district"
                      placeholder="District (e.g., North Goa)"
                      value={form.district}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <div className="step-badge">3</div>
                    <label className="field-label" style={{ margin: 0 }}>Description</label>
                  </div>
                  <textarea
                    className="contribute-input"
                    name="description"
                    placeholder="Tell the story — the vibe, the hidden path, the local lore... (min 50 characters)"
                    value={form.description}
                    onChange={handleChange}
                    required
                    minLength={50}
                    maxLength={1000}
                    style={{ minHeight: "130px", resize: "vertical" }}
                  />
                  {/* Character bar */}
                  <div style={{ marginTop: "6px" }}>
                    <div
                      style={{
                        height: "3px",
                        borderRadius: "4px",
                        background: "#f0e0c8",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${charPct}%`,
                          background:
                            charCount < 50
                              ? "#e88a3a"
                              : charCount > 900
                              ? "#e85c3a"
                              : "#6bbf7a",
                          borderRadius: "4px",
                          transition: "width 0.2s",
                        }}
                      />
                    </div>
                    <p
                      style={{
                        fontSize: "11px",
                        color: charCount < 50 ? "#c97b2b" : "#a08060",
                        textAlign: "right",
                        marginTop: "4px",
                      }}
                    >
                      {charCount < 50
                        ? `${50 - charCount} more chars needed`
                        : `${charCount}/1000`}
                    </p>
                  </div>
                </div>

                {/* Photo Upload */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <div className="step-badge">4</div>
                    <label className="field-label" style={{ margin: 0 }}>
                      Photo <span style={{ color: "#e85c3a" }}>*</span>
                    </label>
                  </div>

                  {previewUrl ? (
                    /* Preview */
                    <div style={{ position: "relative", borderRadius: "14px", overflow: "hidden" }}>
                      <img
                        src={previewUrl}
                        alt="preview"
                        style={{ width: "100%", height: "180px", objectFit: "cover", display: "block" }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 50%)",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewUrl(null);
                          setForm((p) => ({ ...p, media: null }));
                          setFileInputKey(Date.now());
                        }}
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "10px",
                          background: "rgba(255,255,255,0.9)",
                          border: "none",
                          borderRadius: "50%",
                          width: "30px",
                          height: "30px",
                          cursor: "pointer",
                          fontWeight: 700,
                          fontSize: "14px",
                          color: "#2d1a0e",
                        }}
                      >
                        ✕
                      </button>
                      <p
                        style={{
                          position: "absolute",
                          bottom: "10px",
                          left: "14px",
                          color: "#fff",
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        📷 {form.media?.name}
                      </p>
                    </div>
                  ) : (
                    /* Drop zone */
                    <label
                      className={`drop-zone${dragOver ? " over" : ""}`}
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      style={{ display: "block", cursor: "pointer" }}
                    >
                      <input
                        name="media"
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                        key={fileInputKey}
                        required
                        style={{ display: "none" }}
                      />
                      <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>🖼️</div>
                      <p style={{ color: "#2d1a0e", fontWeight: 700, fontSize: "14px", marginBottom: "4px" }}>
                        Drop your photo here
                      </p>
                      <p style={{ color: "#b09070", fontSize: "12px" }}>
                        or <span style={{ color: "#c97b2b", fontWeight: 700 }}>click to browse</span> · Max 5MB
                      </p>
                    </label>
                  )}
                </div>

                {/* AI Bouncer hint */}
                <div
                  style={{
                    background: "rgba(255,243,220,0.8)",
                    border: "1px solid #f5d9a8",
                    borderRadius: "12px",
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                  }}
                >
                  <span style={{ fontSize: "18px", flexShrink: 0 }}>🤖</span>
                  <p style={{ fontSize: "12px", color: "#7a5020", lineHeight: 1.6 }}>
                    <b>AI Bouncer</b> will verify your place isn't already famous or a duplicate. Only truly hidden gems pass!
                  </p>
                </div>

                {/* Submit */}
                <button className="submit-btn" type="submit" disabled={loading}>
                  {loading ? (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                      <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>🔍</span>
                      Scanning & Uploading...
                    </span>
                  ) : (
                    "Submit My Hidden Gem 🗺️"
                  )}
                </button>
                <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Contribute;