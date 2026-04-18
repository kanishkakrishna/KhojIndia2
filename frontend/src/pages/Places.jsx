import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../axios";

// 🎨 SWAP THIS URL to change the background image
const BG_IMAGE = "/images/stup.jpg";

function Places() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await API.get("/places");
        setPlaces(res.data.places || res.data);
      } catch (err) {
        console.error("❌ Failed to fetch places", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, []);

  if (loading) {
    return (
      <div
        className="min-h-screen flex justify-center items-center"
        style={{
          backgroundImage: `url(${BG_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="px-8 py-5 rounded-2xl text-center"
          style={{
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.35)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          }}
        >
          <div
            className="text-5xl mb-3"
            style={{ animation: "spin 2s linear infinite", display: "inline-block" }}
          >
            🧭
          </div>
          <p
            className="text-xl font-bold tracking-wide"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "#2d1a0e",
              textShadow: "0 1px 2px rgba(255,255,255,0.6)",
            }}
          >
            Discovering Hidden Gems...
          </p>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ fontFamily: "'Lato', sans-serif" }}
    >
      {/* --- Background Layer (Fixed) --- */}
      <div className="fixed inset-0 -z-10">
        <img
          src={BG_IMAGE}
          alt="background"
          className="w-full h-full object-cover object-top"
          style={{
            objectPosition: "center top",
            filter: "brightness(0.5)",
          }}
        />
      </div>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Lato:wght@400;700&display=swap');

        .place-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .place-card:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 20px 48px rgba(0,0,0,0.22);
        }
        .place-card img {
          transition: transform 0.5s ease;
        }
        .place-card:hover img {
          transform: scale(1.07);
        }
        .tag-pill {
          transition: background 0.2s;
        }
        .tag-pill:hover {
          background: #c97b2b;
          color: #fff;
        }
      `}</style>

      {/* Warm overlay */}
      <div
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(6,6,6,0.85) 100%)",
          minHeight: "100vh",
          paddingTop: "48px",
          paddingBottom: "64px",
        }}
      >
        {/* ─── Hero Header ─── */}
        <div className="text-center mb-10 px-4">
          <div
            style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.55)",
              backdropFilter: "blur(12px)",
              borderRadius: "24px",
              padding: "28px 48px",
              border: "1px solid rgba(255,255,255,0.7)",
              boxShadow: "0 4px 24px rgba(180,100,20,0.12)",
            }}
          >
            <p
              style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: "13px",
                letterSpacing: "4px",
                textTransform: "uppercase",
                color: "#c97b2b",
                fontWeight: 700,
                marginBottom: "8px",
              }}
            >
              Community · Driven · Discovery
            </p>
            <h1
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
                fontWeight: 900,
                color: "#2d1a0e",
                lineHeight: 1.1,
                marginBottom: "12px",
              }}
            >
              Explore <span style={{ color: "#c97b2b" }}>KhojIndia</span> 🇮🇳
            </h1>
            <p
              style={{
                color: "#5a3a1a",
                fontSize: "1rem",
                maxWidth: "480px",
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              Uncover India's secret places — shared by real Yatris, verified by AI.
            </p>
          </div>
        </div>

        {/* ─── Content ─── */}
        <div className="max-w-7xl mx-auto px-6 pt-4">
          {places.length === 0 ? (
            /* Empty State */
            <div
              className="text-center py-20 mx-auto max-w-md"
              style={{
                background: "rgba(255,255,255,0.6)",
                backdropFilter: "blur(12px)",
                borderRadius: "24px",
                border: "1px solid rgba(255,255,255,0.8)",
                padding: "48px 32px",
              }}
            >
              <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🗺️</div>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.6rem",
                  color: "#2d1a0e",
                  marginBottom: "8px",
                }}
              >
                No places found yet
              </h2>
              <p style={{ color: "#7a5c3a", marginBottom: "24px", lineHeight: 1.6 }}>
                Be the first Yatri to put a hidden gem on the map!
              </p>
              <Link
                to="/contribute"
                style={{
                  display: "inline-block",
                  background: "linear-gradient(135deg, #c97b2b, #e8a04a)",
                  color: "#fff",
                  padding: "12px 32px",
                  borderRadius: "50px",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  letterSpacing: "0.5px",
                  textDecoration: "none",
                  boxShadow: "0 4px 16px rgba(201,123,43,0.4)",
                  transition: "opacity 0.2s",
                }}
              >
                + Contribute Now
              </Link>
            </div>
          ) : (
            /* Places Grid */
            <div
              className="grid"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "24px",
                padding: "0 6px",
              }}
            >
              {places.map((place) => (
                <Link
                  to={`/place/${place._id}`}
                  key={place._id}
                  style={{ textDecoration: "none", display: "block" }}
                >
                  <div
                    className="place-card"
                    style={{
                      background: "rgba(255,252,245,0.88)",
                      backdropFilter: "blur(10px)",
                      borderRadius: "20px",
                      overflow: "hidden",
                      border: "1px solid rgba(255,220,160,0.6)",
                      boxShadow: "0 4px 20px rgba(120,60,0,0.10)",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Image */}
                    <div style={{ position: "relative", height: "192px", overflow: "hidden" }}>
                      <img
                        src={place.mediaUrl}
                        alt={place.localName}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      {/* Gradient overlay on image */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(to top, rgba(45,26,14,0.45) 0%, transparent 60%)",
                        }}
                      />
                      {/* Coins badge */}
                      <div
                        style={{
                          position: "absolute",
                          top: "12px",
                          right: "12px",
                          background: "rgba(255,255,255,0.92)",
                          backdropFilter: "blur(6px)",
                          borderRadius: "50px",
                          padding: "4px 10px",
                          fontSize: "11px",
                          fontWeight: 700,
                          color: "#b8660a",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        🪙 {place.coins || 1}
                      </div>
                    </div>

                    {/* Details */}
                    <div
                      style={{
                        padding: "16px",
                        display: "flex",
                        flexDirection: "column",
                        flexGrow: 1,
                      }}
                    >
                      <h2
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontSize: "1.15rem",
                          fontWeight: 700,
                          color: "#2d1a0e",
                          marginBottom: "4px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {place.localName}
                      </h2>
                      <p
                        style={{
                          fontSize: "12px",
                          color: "#9a6a3a",
                          fontWeight: 600,
                          marginBottom: "12px",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        📍 {place.district}, {place.state}
                      </p>

                      {/* Hashtags */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "6px",
                          marginTop: "auto",
                          marginBottom: "12px",
                        }}
                      >
                        {place.hashtags && place.hashtags.length > 0 ? (
                          place.hashtags.map((tag, index) => (
                            <span
                              key={index}
                              className="tag-pill"
                              style={{
                                background: "#fef3e2",
                                color: "#b8660a",
                                fontSize: "10px",
                                fontWeight: 700,
                                padding: "3px 9px",
                                borderRadius: "50px",
                                border: "1px solid #f5d9a8",
                                cursor: "default",
                              }}
                            >
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span style={{ fontSize: "11px", color: "#bbb", fontStyle: "italic" }}>
                            No tags yet
                          </span>
                        )}
                      </div>

                      {/* Contributor footer */}
                      <div
                        style={{
                          borderTop: "1px solid #f0e0c8",
                          paddingTop: "10px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: "11px",
                        }}
                      >
                        <span style={{ color: "#b09070" }}>Discovered by</span>
                        <span
                          style={{
                            fontWeight: 700,
                            color: "#5a3a1a",
                            maxWidth: "120px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {place.contributedBy || "Anonymous Yatri"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Places;