import { useEffect, useState } from "react";
import API from "../axios";

const BG_URL =
  "/images/leaderr.avif";

/* ── Medal config for top 3 ── */
const MEDAL = [
  {
    label: "I",
    ring: "#D4A853",
    glow: "rgba(212,168,83,0.55)",
    textColor: "#D4A853",
    crownColor: "#D4A853",
    rowBg: "linear-gradient(90deg, rgba(212,168,83,0.12) 0%, transparent 70%)",
    badge: "🥇",
  },
  {
    label: "II",
    ring: "#B8C4CF",
    glow: "rgba(184,196,207,0.45)",
    textColor: "#B8C4CF",
    crownColor: "#B8C4CF",
    rowBg: "linear-gradient(90deg, rgba(184,196,207,0.09) 0%, transparent 70%)",
    badge: "🥈",
  },
  {
    label: "III",
    ring: "#CD7F32",
    glow: "rgba(205,127,50,0.45)",
    textColor: "#CD7F32",
    crownColor: "#CD7F32",
    rowBg: "linear-gradient(90deg, rgba(205,127,50,0.1) 0%, transparent 70%)",
    badge: "🥉",
  },
];

/* ── Crown SVG ── */
function Crown({ color }) {
  return (
    <svg
      viewBox="0 0 24 14"
      fill={color}
      style={{ width: 18, height: 11, display: "block", filter: `drop-shadow(0 0 5px ${color})` }}
    >
      <path d="M0 14 L2 4 L7 10 L12 0 L17 10 L22 4 L24 14 Z" />
    </svg>
  );
}

/* ── Sparkle / Khoji-coin icon ── */
function KhojiStar({ color, glow }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={color}
      style={{
        width: 16,
        height: 16,
        filter: `drop-shadow(0 0 6px ${glow || color})`,
        flexShrink: 0,
      }}
    >
      <path d="M12 2l1.8 5.6a2 2 0 001.3 1.3L20.7 10.7l-5.6 1.8a2 2 0 00-1.3 1.3L12 19.4l-1.8-5.6a2 2 0 00-1.3-1.3L3.3 10.7l5.6-1.8a2 2 0 001.3-1.3L12 2z" />
    </svg>
  );
}

/* ── Podium block for rank 1/2/3 ── */
function PodiumCard({ user, index }) {
  const m = MEDAL[index];
  const heights = [140, 100, 80]; // podium heights
  const order = [1, 0, 2]; // display order: 2nd | 1st | 3rd

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 0,
        animation: `podiumRise 0.7s ${0.15 * index}s both`,
      }}
    >
      <style>{`
        @keyframes podiumRise {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Crown (only for #1) */}
      {index === 0 && (
        <div style={{ marginBottom: 6 }}>
          <Crown color={m.crownColor} />
        </div>
      )}

      {/* Avatar circle */}
      <div
        style={{
          width: index === 0 ? 72 : 58,
          height: index === 0 ? 72 : 58,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
          border: `2.5px solid ${m.ring}`,
          boxShadow: `0 0 18px ${m.glow}, inset 0 0 12px rgba(0,0,0,0.3)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: index === 0 ? "1.65rem" : "1.3rem",
          fontFamily: "'Playfair Display', serif",
          fontWeight: 800,
          color: m.textColor,
          marginBottom: 10,
          letterSpacing: "-0.02em",
          position: "relative",
          zIndex: 1,
        }}
      >
        {(user?.username?.[0] || "?").toUpperCase()}
      </div>

      {/* Username */}
      <span
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: index === 0 ? "0.85rem" : "0.78rem",
          fontWeight: 600,
          color: m.textColor,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: 6,
          maxWidth: 90,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          textAlign: "center",
        }}
      >
        {user?.username || "—"}
      </span>

      {/* Coins */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          background: "rgba(0,0,0,0.35)",
          border: `1px solid ${m.ring}44`,
          borderRadius: 100,
          padding: "4px 12px",
          marginBottom: 12,
        }}
      >
        <KhojiStar color={m.textColor} glow={m.glow} />
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            fontSize: "0.85rem",
            color: m.textColor,
            letterSpacing: "0.04em",
          }}
        >
          {user?.coins ?? "—"}
        </span>
      </div>

      {/* Podium pillar */}
      <div
        style={{
          width: index === 0 ? 110 : 90,
          height: heights[index],
          background: `linear-gradient(180deg, ${m.ring}33 0%, ${m.ring}11 100%)`,
          border: `1px solid ${m.ring}44`,
          borderBottom: "none",
          borderRadius: "10px 10px 0 0",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          paddingTop: 14,
        }}
      >
        <span
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontSize: index === 0 ? "1.5rem" : "1.1rem",
            color: m.textColor,
            opacity: 0.7,
          }}
        >
          {m.label}
        </span>
      </div>
    </div>
  );
}

/* ── Single leaderboard row (rank 4+) ── */
function LeaderRow({ user, index, delay }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "15px 24px",
        borderBottom: "1px solid rgba(245,237,216,0.06)",
        background: "transparent",
        transition: "background 0.2s",
        animation: `rowSlide 0.5s ${delay}s both`,
        cursor: "default",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(245,237,216,0.04)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <style>{`
        @keyframes rowSlide {
          from { opacity: 0; transform: translateX(-16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        {/* Rank number */}
        <span
          style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
            fontSize: "1.05rem",
            color: "rgba(245,237,216,0.25)",
            width: 28,
            textAlign: "right",
            flexShrink: 0,
          }}
        >
          {index + 4}
        </span>

        {/* Avatar initial */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(245,237,216,0.07)",
            border: "1px solid rgba(245,237,216,0.14)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.9rem",
            fontWeight: 700,
            fontFamily: "'Playfair Display', serif",
            color: "rgba(245,237,216,0.55)",
            flexShrink: 0,
          }}
        >
          {(user.username?.[0] || "?").toUpperCase()}
        </div>

        {/* Username */}
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.9rem",
            fontWeight: 500,
            color: "rgba(245,237,216,0.72)",
            letterSpacing: "0.04em",
          }}
        >
          {user.username}
        </span>
      </div>

      {/* Coins */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "rgba(0,0,0,0.3)",
          border: "1px solid rgba(245,237,216,0.1)",
          borderRadius: 100,
          padding: "5px 14px",
        }}
      >
        <KhojiStar color="rgba(212,168,83,0.7)" glow="rgba(212,168,83,0.3)" />
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            fontSize: "0.88rem",
            color: "rgba(245,237,216,0.65)",
          }}
        >
          {user.coins}
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN LEADERBOARD COMPONENT
═══════════════════════════════════════════ */
export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await API.get("/leaderboard");
        if (res.data && Array.isArray(res.data.leaderboard)) {
          setLeaders(res.data.leaderboard);
        } else {
          setError("Invalid leaderboard data received.");
        }
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
        setError("Failed to load leaderboard. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const top3 = leaders.slice(0, 3);
  const rest = leaders.slice(3);

  // Podium display order: silver(1) | gold(0) | bronze(2)
  const podiumOrder = [1, 0, 2];

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 110,
        paddingBottom: 80,
        paddingLeft: 16,
        paddingRight: 16,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
      `}</style>

      {/* ── Background Layer ── */}
<div 
  style={{ 
    position: "fixed", 
    inset: 0, 
    zIndex: -2, 
    overflow: "hidden",
    backgroundColor: "#000" // Image load hone se pehle kaala parda
  }}
>
  <img
    src={BG_URL}
    alt="Background"
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",        // Ye 'background-size: cover' ka kaam karega
      objectPosition: "center",  // Ye 'background-position: center' ka kaam karega
      filter: "brightness(0.28) saturate(1.1)", // Jo tumne set kiya tha wahi hai
    }}
  />
</div>
      {/* Vignette */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(10,8,4,0.75) 100%)",
          zIndex: -1,
        }}
      />
      {/* Bottom fade */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: 180,
          background: "linear-gradient(to top, rgba(10,8,4,0.95), transparent)",
          zIndex: -1,
        }}
      />

      {/* ── Header ── */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 52,
          animation: "fadeDown 0.7s both",
        }}
      >
        <p
          style={{
            fontSize: "0.68rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(212,168,83,0.7)",
            marginBottom: 12,
          }}
        >
          Hall of Fame
        </p>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2.4rem, 6vw, 4rem)",
            fontWeight: 800,
            lineHeight: 1.05,
            color: "#F5EDD8",
            letterSpacing: "-0.02em",
          }}
        >
          Legends of{" "}
          <em style={{ color: "#C4622D", fontStyle: "italic" }}>KhojIndia</em>
        </h1>
        <p
          style={{
            marginTop: 12,
            fontSize: "0.88rem",
            color: "rgba(245,237,216,0.38)",
            fontWeight: 300,
            letterSpacing: "0.03em",
          }}
        >
          Ranked by Khoji coins earned through discoveries
        </p>
      </div>

      {/* ── States ── */}
      {isLoading && (
        <div
          style={{
            maxWidth: 480,
            width: "100%",
            background: "rgba(245,237,216,0.05)",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(245,237,216,0.12)",
            borderRadius: 20,
            padding: "40px 32px",
            textAlign: "center",
          }}
        >
          {/* Shimmer placeholder rows */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              style={{
                height: 16,
                borderRadius: 8,
                marginBottom: 16,
                background:
                  "linear-gradient(90deg, rgba(245,237,216,0.06) 25%, rgba(245,237,216,0.12) 50%, rgba(245,237,216,0.06) 75%)",
                backgroundSize: "800px 100%",
                animation: `shimmer 1.4s ${i * 0.1}s infinite linear`,
                width: i % 2 === 0 ? "80%" : "60%",
                margin: "0 auto 16px",
              }}
            />
          ))}
          <p
            style={{
              color: "rgba(245,237,216,0.4)",
              fontSize: "0.85rem",
              letterSpacing: "0.08em",
              marginTop: 8,
            }}
          >
            Summoning legends…
          </p>
        </div>
      )}

      {error && !isLoading && (
        <div
          style={{
            maxWidth: 480,
            width: "100%",
            background: "rgba(196,98,45,0.12)",
            border: "1px solid rgba(196,98,45,0.35)",
            borderRadius: 20,
            padding: "32px",
            textAlign: "center",
          }}
        >
          <p style={{ color: "#f5a07a", fontSize: "0.95rem" }}>{error}</p>
        </div>
      )}

      {!isLoading && !error && leaders.length === 0 && (
        <div
          style={{
            maxWidth: 480,
            width: "100%",
            background: "rgba(245,237,216,0.05)",
            border: "1px solid rgba(245,237,216,0.12)",
            borderRadius: 20,
            padding: "48px 32px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.1rem",
              color: "rgba(245,237,216,0.55)",
            }}
          >
            No explorers yet.
            <br />
            <em style={{ color: "#C4622D" }}>Be the first Khoji.</em>
          </p>
        </div>
      )}

      {/* ── Main leaderboard ── */}
      {!isLoading && !error && leaders.length > 0 && (
        <div style={{ width: "100%", maxWidth: 680 }}>

          {/* ── PODIUM (top 3) ── */}
          {top3.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
                gap: 12,
                marginBottom: 40,
              }}
            >
              {podiumOrder.map((rank) =>
                top3[rank] ? (
                  <PodiumCard key={rank} user={top3[rank]} index={rank} />
                ) : null
              )}
            </div>
          )}

          {/* ── REST OF LEADERBOARD ── */}
          {rest.length > 0 && (
            <div
              style={{
                background: "rgba(245,237,216,0.04)",
                backdropFilter: "blur(18px)",
                border: "1px solid rgba(245,237,216,0.1)",
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
              }}
            >
              {/* Table header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 24px",
                  borderBottom: "1px solid rgba(245,237,216,0.08)",
                  background: "rgba(245,237,216,0.03)",
                }}
              >
                <span
                  style={{
                    fontSize: "0.65rem",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "rgba(245,237,216,0.3)",
                  }}
                >
                  Explorer
                </span>
                <span
                  style={{
                    fontSize: "0.65rem",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "rgba(245,237,216,0.3)",
                  }}
                >
                  Khoji Coins
                </span>
              </div>

              {rest.map((user, i) => (
                <LeaderRow key={user._id} user={user} index={i} delay={0.05 * i} />
              ))}
            </div>
          )}

          {/* Footer note */}
          <p
            style={{
              textAlign: "center",
              marginTop: 28,
              fontSize: "0.72rem",
              color: "rgba(245,237,216,0.2)",
              letterSpacing: "0.08em",
            }}
          >
            Coins are awarded for each verified hidden destination contributed.
          </p>
        </div>
      )}
    </div>
  );
}