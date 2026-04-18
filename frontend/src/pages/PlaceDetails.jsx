import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const BG_IMAGE = "/images/pd.avif";

function PlaceDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [place, setPlace] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [aiVibe, setAiVibe] = useState(null);
  const [loadingVibe, setLoadingVibe] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const placeRes = await API.get(`/places/${id}`);
        setPlace(placeRes.data);
        const reviewRes = await API.get(`/places/${id}/reviews`);
        setReviews(reviewRes.data);
      } catch (err) {
        toast.error("Failed to load details!");
      }
    };
    fetchData();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const token = localStorage.getItem("token");
    if (!token) { toast.error("Please login first to add a review."); return; }
    try {
      const res = await API.post(`/places/${id}/reviews`, { comment: newComment }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews([res.data, ...reviews]);
      setNewComment("");
      toast.success("Review added!");
    } catch (err) {
      toast.error("Error adding review.");
    }
  };

  const getAiVibe = async () => {
    setLoadingVibe(true);
    const toastId = toast.loading("AI is reading all reviews... 🧠");
    try {
      const res = await API.get(`/places/${id}/vibe`);
      setAiVibe(res.data.vibe);
      toast.success("Vibe check complete!", { id: toastId });
    } catch (err) {
      toast.error("AI is sleeping right now.", { id: toastId });
    } finally {
      setLoadingVibe(false);
    }
  };

  if (!place) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Lato', sans-serif", fontSize: "18px", fontWeight: 700, color: "#c97b2b" }}>
      Loading Hidden Gem... 🌍
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", position: "relative", fontFamily: "'Lato', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Lato:wght@400;600;700&display=swap');
        .review-input { width: 100%; padding: 12px 16px; border-radius: 10px; border: 1.5px solid rgba(201,123,43,0.25); background: rgba(255,252,245,0.9); font-family: 'Lato', sans-serif; font-size: 14px; color: #2d1a0e; outline: none; transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box; }
        .review-input:focus { border-color: #c97b2b; box-shadow: 0 0 0 3px rgba(201,123,43,0.12); }
        .review-input::placeholder { color: #b09070; }
      `}</style>

      {/* Background */}
      <img src={BG_IMAGE} alt="bg" style={{ position: "fixed", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, filter: "brightness(0.55) saturate(1.05)" }} />
      <div style={{ position: "fixed", inset: 0, background: "linear-gradient(160deg, rgba(0,0,0,0.45), rgba(0,0,0,0.65))", zIndex: 1 }} />

      <div style={{ position: "relative", zIndex: 2, maxWidth: "800px", margin: "0 auto", padding: "80px 16px 64px" }}>

        {/* Hero Image */}
        <div style={{ borderRadius: "24px", overflow: "hidden", boxShadow: "0 12px 48px rgba(0,0,0,0.3)", position: "relative", height: "380px" }}>
          <img src={place.mediaUrl} alt={place.localName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 55%)" }} />
          <div style={{ position: "absolute", top: "16px", right: "16px", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(6px)", padding: "5px 14px", borderRadius: "50px", fontSize: "13px", fontWeight: 700, color: "#b8660a" }}>
            🪙 {place.contributedBy}
          </div>
          {/* Title overlay on image */}
          <div style={{ position: "absolute", bottom: "20px", left: "24px" }}>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 900, color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,0.5)", marginBottom: "4px" }}>
              {place.localName}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "14px", fontWeight: 600 }}>📍 {place.district}, {place.state}</p>
          </div>
        </div>

        {/* Main Card */}
        <div style={{ background: "rgba(255,252,245,0.92)", backdropFilter: "blur(16px)", borderRadius: "24px", border: "1px solid rgba(255,220,160,0.6)", boxShadow: "0 8px 40px rgba(0,0,0,0.15)", padding: "32px", marginTop: "20px" }}>

          {/* Hashtags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
            {place.hashtags?.map((tag, i) => (
              <span key={i} style={{ background: "#fef3e2", color: "#b8660a", fontSize: "12px", fontWeight: 700, padding: "4px 12px", borderRadius: "50px", border: "1px solid #f5d9a8" }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Description */}
          <p style={{ color: "#4a3020", fontSize: "15px", lineHeight: 1.8, background: "rgba(255,243,220,0.5)", padding: "20px", borderRadius: "14px", border: "1px solid #f5e4c0", whiteSpace: "pre-wrap" }}>
            {place.description}
          </p>

          <hr style={{ margin: "28px 0", border: "none", borderTop: "1px solid #f0e0c8" }} />

          {/* AI Vibe Checker */}
          <div style={{ background: "rgba(255,243,220,0.7)", borderRadius: "16px", padding: "24px", border: "1px solid #f5d9a8", marginBottom: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "#2d1a0e" }}>✨ AI Vibe Check</h3>
              <button
                onClick={getAiVibe}
                disabled={loadingVibe || reviews.length === 0}
                style={{ background: "linear-gradient(135deg, #c97b2b, #e8a04a)", color: "#fff", border: "none", padding: "9px 20px", borderRadius: "50px", fontWeight: 700, fontSize: "13px", cursor: "pointer", opacity: (loadingVibe || reviews.length === 0) ? 0.5 : 1, fontFamily: "'Lato', sans-serif" }}
              >
                {loadingVibe ? "Scanning..." : "Check Vibe"}
              </button>
            </div>
            {aiVibe ? (
              <p style={{ color: "#5a3010", fontSize: "15px", fontStyle: "italic", lineHeight: 1.7, background: "rgba(255,255,255,0.7)", padding: "14px 18px", borderRadius: "10px" }}>"{aiVibe}"</p>
            ) : (
              <p style={{ color: "#9a7a5a", fontSize: "14px", fontStyle: "italic" }}>
                {reviews.length === 0 ? "No reviews yet. Add a review to unlock AI Vibe!" : "Click the button to let AI summarize the yatris' experiences."}
              </p>
            )}
          </div>

          {/* Reviews */}
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 700, color: "#2d1a0e", marginBottom: "16px" }}>
            Yatri Reviews ({reviews.length})
          </h3>

          {/* Add Review */}
          <form onSubmit={handleReviewSubmit} style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <input className="review-input" type="text" placeholder="Share your experience or ask a question..." value={newComment} onChange={(e) => setNewComment(e.target.value)} />
            <button type="submit" style={{ background: "linear-gradient(135deg, #c97b2b, #e8a04a)", color: "#fff", border: "none", padding: "12px 22px", borderRadius: "10px", fontWeight: 700, fontSize: "14px", cursor: "pointer", whiteSpace: "nowrap", fontFamily: "'Lato', sans-serif" }}>
              Post
            </button>
          </form>

          {/* Reviews List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {reviews.length === 0 ? (
              <p style={{ color: "#9a7a5a", textAlign: "center", padding: "16px", fontStyle: "italic" }}>Be the first to review this place!</p>
            ) : (
              reviews.map((rev) => (
                <div key={rev._id} style={{ background: "rgba(255,249,238,0.85)", border: "1px solid #f0e0c8", borderRadius: "12px", padding: "14px 16px" }}>
                  <div style={{ fontWeight: 700, fontSize: "13px", color: "#c97b2b", marginBottom: "4px" }}>{rev.userName}</div>
                  <div style={{ color: "#4a3020", fontSize: "14px", lineHeight: 1.6 }}>{rev.comment}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaceDetails;