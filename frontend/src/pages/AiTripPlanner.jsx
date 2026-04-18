import React, { useState } from 'react';
import axios from 'axios';

const BG = "/images/atp.avif";

const AiTripPlanner = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [tripPlan, setTripPlan] = useState(null);
  const [error, setError] = useState('');

  const generatePlan = async () => {
    if (!prompt) return;
    setLoading(true);
    setError('');
    setTripPlan(null);
    try {
      const response = await axios.post('http://127.0.0.1:9000/api/plan-trip', { prompt });
      setTripPlan(response.data);
    } catch (err) {
      setError('Oops! The AI Planner is currently unavailable. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => e.key === 'Enter' && generatePlan();

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", color: '#F5EDD8', position: 'relative' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .planner-input {
          flex: 1;
          background: rgba(245,237,216,0.07);
          border: 1px solid rgba(245,237,216,0.2);
          border-radius: 100px;
          padding: 14px 22px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.92rem;
          color: #F5EDD8;
          outline: none;
          transition: border-color 0.2s;
        }
        .planner-input::placeholder { color: rgba(245,237,216,0.38); }
        .planner-input:focus { border-color: rgba(212,168,83,0.5); }

        .btn-plan {
          background: #C4622D;
          color: #fff;
          border: none;
          padding: 14px 28px;
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.2s, transform 0.15s;
          min-width: 160px;
        }
        .btn-plan:hover:not(:disabled) { background: #b3561f; transform: translateY(-1px); }
        .btn-plan:disabled { background: rgba(196,98,45,0.4); cursor: not-allowed; }

        .glass-card {
          background: rgba(16,13,7,0.55);
          backdrop-filter: blur(18px);
          border: 1px solid rgba(245,237,216,0.1);
          border-radius: 20px;
          padding: 28px;
        }

        .day-card {
          background: rgba(245,237,216,0.04);
          border: 1px solid rgba(245,237,216,0.08);
          border-left: 3px solid #C4622D;
          border-radius: 12px;
          padding: 18px 20px;
          margin-bottom: 12px;
        }

        .info-chip {
          background: rgba(245,237,216,0.05);
          border: 1px solid rgba(245,237,216,0.1);
          border-radius: 14px;
          padding: 16px 20px;
          flex: 1;
        }

        .section-label {
          font-size: 0.65rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #D4A853;
          margin-bottom: 14px;
          font-weight: 600;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.55s both; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.25);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
          vertical-align: middle;
          margin-right: 8px;
        }
      `}</style>

      <>
        {/* ── Layer 1: Background Image ── */}
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: -2,
          overflow: 'hidden',
          backgroundColor: '#100d07'
        }}>
          <img
            src={BG}
            alt="background"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              filter: 'brightness(0.32) saturate(1.1)',
            }}
          />
        </div>

        {/* ── Layer 2: Dark Gradient Overlay ── */}
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          background: 'linear-gradient(to bottom, rgba(16,13,7,0.3) 0%, rgba(16,13,7,0.6) 100%)',
        }} />
      </>

      {/* Content */}
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '120px 24px 80px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <p style={{ fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(212,168,83,0.75)', marginBottom: 12 }}>
            Powered by GenAI
          </p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.02em',
          }}>
            AI Trip <em style={{ color: '#C4622D', fontStyle: 'italic' }}>Planner</em>
          </h1>
          <p style={{ marginTop: 12, color: 'rgba(245,237,216,0.45)', fontSize: '0.9rem', fontWeight: 300 }}>
            Tell us your vibe — we'll craft the perfect Khoji itinerary.
          </p>
        </div>

        {/* Input bar */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <input
            className="planner-input"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKey}
            placeholder="E.g., Serene waterfall near Jamshedpur this weekend…"
          />
          <button className="btn-plan" onClick={generatePlan} disabled={loading}>
            {loading ? <><span className="spinner" />Planning…</> : 'Plan My Trip →'}
          </button>
        </div>

        {/* ── Advisory Note — always visible below input ── */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
          background: 'rgba(212,168,83,0.08)',
          border: '1px solid rgba(212,168,83,0.22)',
          borderRadius: 14,
          padding: '14px 18px',
          marginBottom: 32,
        }}>
          <span style={{ fontSize: '1.1rem', marginTop: 1 }}>📋</span>
          <div>
            <p style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#D4A853',
              marginBottom: 6,
            }}>
              Planning Guidelines
            </p>
            <ul style={{
              margin: 0,
              paddingLeft: 16,
              color: 'rgba(245,237,216,0.6)',
              fontSize: '0.82rem',
              lineHeight: 1.8,
            }}>
              <li>Trips exceeding 4 days will be thoughtfully curated to a <strong style={{ color: 'rgba(245,237,216,0.85)' }}>4-day itinerary</strong>.</li>
              <li>All destinations are planned <strong style={{ color: 'rgba(245,237,216,0.85)' }}>within India</strong> only.</li>
            </ul>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(196,98,45,0.12)', border: '1px solid rgba(196,98,45,0.3)',
            borderRadius: 14, padding: '14px 20px', color: '#f5a07a',
            fontSize: '0.88rem', textAlign: 'center', marginBottom: 24,
          }}>
            {error}
          </div>
        )}

        {/* Results */}
        {tripPlan && (
          <div className="glass-card fade-up">

            {/* Title + destination */}
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              fontWeight: 700, marginBottom: 4,
            }}>
              {tripPlan.title}
            </h2>
            <p style={{ color: '#D4A853', fontSize: '0.9rem', marginBottom: 24, fontWeight: 500 }}>
              📍 {tripPlan.destination}
            </p>

            {/* Weather + Route chips */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
              <div className="info-chip">
                <div className="section-label">⛅ Weather</div>
                <p style={{ fontSize: '0.88rem', color: 'rgba(245,237,216,0.7)', lineHeight: 1.6 }}>{tripPlan.weather}</p>
              </div>
              <div className="info-chip">
                <div className="section-label">🚗 Route</div>
                <p style={{ fontSize: '0.88rem', color: 'rgba(245,237,216,0.7)', lineHeight: 1.6 }}>{tripPlan.route}</p>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(245,237,216,0.08)', marginBottom: 24 }} />

            {/* Itinerary */}
            <div className="section-label">📅 Your Itinerary</div>

            {tripPlan?.itinerary?.map((dayPlan, i) => (
              <div key={i} className="day-card">
                <p style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700, fontSize: '1rem',
                  color: '#C4622D', marginBottom: 10,
                }}>
                  Day {dayPlan?.day}
                </p>
                <ul style={{ paddingLeft: 18 }}>
                  <li style={{
                    fontSize: '0.87rem', color: 'rgba(245,237,216,0.68)',
                    lineHeight: 1.7, marginBottom: 4,
                  }}>
                    {dayPlan?.activity}
                  </li>
                </ul>
              </div>
            ))}

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(245,237,216,0.08)', margin: '20px 0' }} />

            {/* Tips */}
            <div className="section-label">💡 Khoji Pro Tips</div>
            <ul style={{ paddingLeft: 18 }}>
              {tripPlan.tips.map((tip, i) => (
                <li key={i} style={{
                  fontSize: '0.87rem', color: 'rgba(245,237,216,0.58)',
                  fontStyle: 'italic', lineHeight: 1.7, marginBottom: 6,
                }}>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiTripPlanner;