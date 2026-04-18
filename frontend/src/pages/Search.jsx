// src/pages/Search.jsx
import { useState } from "react";
import API from "../axios";

const EXPLORE_CHIPS = [
  "Northeast India", "Rajasthan", "Western Ghats",
  "Uttarakhand", "Odisha coast", "Chhattisgarh", "Ladakh valleys",
];

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (q) => {
    const searchQuery = q ?? query;
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const res = await API.get(`/search?query=${searchQuery}`);
      setResults(res.data);
      setSearched(true);
      setQuery(searchQuery);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div style={{ background: "#FAF7F2", minHeight: "100vh", fontFamily: "Georgia, serif" }}>

      {/* ── HERO SECTION ── */}
      <div style={{ position: "relative", width: "100%", height: 340, overflow: "hidden", borderRadius: "0 0 24px 24px" }}>

        {/* Background Image */}
        <img
          src="/images/search.jpg"
          alt="Jaisalmer Desert"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Gradient Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.2))",
          }}
        />

        {/* Hero Content */}
        <div style={{
          position: "relative",
          zIndex: 3,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "0 28px 32px"
        }}>
          <div style={{ fontSize: 11, letterSpacing: "0.12em", color: "rgba(255,235,190,0.7)", textTransform: "uppercase", marginBottom: 6 }}>
            KhojIndia · Discovery Search
          </div>

          <div style={{ fontSize: 30, color: "#FFF5E0", marginBottom: 6 }}>
            Find India's hidden gems
          </div>

          <div style={{ fontSize: 14, color: "rgba(255,235,190,0.75)", marginBottom: 22 }}>
            Search by name, district, or state — AI filters out the obvious
          </div>

          {/* Search bar */}
          <div style={{
            display: "flex",
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(8px)",
            borderRadius: 12,
            overflow: "hidden"
          }}>
            <input
              type="text"
              placeholder="Try 'Dzukou Valley', 'Rajasthan', 'hidden waterfall'..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                flex: 1,
                padding: "13px 16px",
                border: "none",
                outline: "none",
                fontSize: 14,
                background: "transparent"
              }}
            />

            <button
              onClick={() => handleSearch()}
              disabled={loading}
              style={{
                padding: "13px 22px",
                background: loading ? "#9A6040" : "#C4622D",
                color: "#fff",
                border: "none",
                cursor: "pointer"
              }}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ padding: "24px 20px" }}>

        {searched ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <span>Results for "{query}"</span>
              <span>{results.length} found</span>
            </div>

            {results.length > 0 ? (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 16
              }}>
                {results.map((place) => (
                  <PlaceCard key={place._id} place={place} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: 40 }}>
                No hidden gems found
              </div>
            )}
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

function PlaceCard({ place }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      overflow: "hidden",
      border: "1px solid #eee"
    }}>
      <img
        src={place.mediaUrl}
        alt=""
        style={{ width: "100%", height: 160, objectFit: "cover" }}
      />

      <div style={{ padding: 14 }}>
        <div style={{ fontSize: 12, color: "#888" }}>
          {place.district}, {place.state}
        </div>

        <div style={{ fontSize: 18, fontWeight: "bold" }}>
          {place.localName}
        </div>

        <div style={{ fontSize: 14, color: "#555" }}>
          {place.description}
        </div>

        {/* FIXED TAGS */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
  {place.hashtags?.map((tag) => (
    <span
      key={tag}
      style={{
        fontSize: 11,
        padding: "4px 10px",
        borderRadius: 999,
        background: "rgba(122, 79, 43, 0.12)",  // transparent brown
        color: "#7A4F2B",
        border: "1px solid rgba(122, 79, 43, 0.2)",
        fontWeight: 500,
        letterSpacing: "0.02em",
      }}
    >
      #{tag.replace(/^#/, "")}
    </span>
  ))}
</div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ textAlign: "center", padding: 40 }}>
      
    </div>
  );
}

export default Search;