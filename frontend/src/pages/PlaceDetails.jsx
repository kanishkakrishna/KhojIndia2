import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

function PlaceDetails() {
  const { id } = useParams(); // URL se ID nikal li
  const { user } = useAuth();
  
  const [place, setPlace] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState("");
  
  // AI Vibe States
  const [aiVibe, setAiVibe] = useState(null);
  const [loadingVibe, setLoadingVibe] = useState(false);

  // Page load hote hi Place aur Reviews mangwao
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

  // Naya Review Add karne ka function
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // Login check
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first to add a review.");
      return;
    }

    try {
      const res = await API.post(`/places/${id}/reviews`, { comment: newComment }, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      setReviews([res.data, ...reviews]); // Naya review list mein upar add kar do
      setNewComment("");
      toast.success("Review added!");
    } catch (err) {
      toast.error("Error adding review.");
    }
  };

  // 🚀 THE MAGIC AI BUTTON FUNCTION
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

  if (!place) return <div className="text-center mt-20 text-xl font-bold animate-pulse text-blue-600">Loading Hidden Gem... 🌍</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      {/* 🖼️ Hero Image Section */}
      <div className="w-full h-[400px] rounded-3xl overflow-hidden shadow-lg relative">
        <img src={place.mediaUrl} alt={place.localName} className="w-full h-full object-cover" />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold shadow">
          🪙 Discovered by {place.contributedBy}
        </div>
      </div>

      {/* 📝 Details Section */}
      <div className="mt-8">
        <h1 className="text-4xl font-extrabold text-gray-900">{place.localName}</h1>
        <p className="text-lg text-gray-500 mt-2 font-medium">📍 {place.district}, {place.state}</p>

        {/* 🚀 AI Hashtags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {place.hashtags?.map((tag, i) => (
            <span key={i} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
              {tag}
            </span>
          ))}
        </div>

        <p className="mt-6 text-gray-700 text-lg leading-relaxed whitespace-pre-wrap bg-gray-50 p-6 rounded-2xl">
          {place.description}
        </p>
      </div>

      <hr className="my-10 border-gray-200" />

      {/* 🤖 THE AI VIBE CHECKER UI */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-2xl border border-purple-100 mb-10 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-indigo-900 flex items-center gap-2">
            ✨ AI Vibe Check
          </h3>
          <button 
            onClick={getAiVibe}
            disabled={loadingVibe || reviews.length === 0}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md"
          >
            {loadingVibe ? "Scanning..." : "Check Vibe"}
          </button>
        </div>
        
        {aiVibe ? (
          <p className="text-lg text-indigo-800 font-medium bg-white p-4 rounded-xl shadow-sm border border-indigo-50 leading-relaxed">
            "{aiVibe}"
          </p>
        ) : (
          <p className="text-gray-500 italic">
            {reviews.length === 0 
              ? "No reviews yet. Add a review to unlock AI Vibe!" 
              : "Click the button to let AI summarize the yatris' experiences."}
          </p>
        )}
      </div>

      {/* 💬 Comments/Reviews Section */}
      <div>
        <h3 className="text-2xl font-bold mb-6">Yatri Reviews ({reviews.length})</h3>
        
        {/* Add Review Form */}
        <form onSubmit={handleReviewSubmit} className="mb-8 flex gap-3">
          <input
            type="text"
            placeholder="Share your experience or ask a question..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-grow border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="bg-blue-600 text-white px-6 rounded-xl font-bold hover:bg-blue-700 transition">
            Post
          </button>
        </form>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="text-gray-500 text-center py-4">Be the first to review this place!</div>
          ) : (
            reviews.map((rev) => (
              <div key={rev._id} className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
                <div className="font-bold text-sm text-gray-800 mb-1">{rev.userName}</div>
                <div className="text-gray-700">{rev.comment}</div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}

export default PlaceDetails;