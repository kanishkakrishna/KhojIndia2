import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../axios";

function PlaceDetails() {
  const { id } = useParams(); // URL se ID nikal li
  const { user } = useAuth();
  
  const [place, setPlace] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [loading, setLoading] = useState(true);

  // Data fetch karne ka logic
  useEffect(() => {
    const fetchPlaceAndReviews = async () => {
      try {
        const placeRes = await API.get(`/places/${id}`);
        setPlace(placeRes.data);

        const reviewsRes = await API.get(`/places/${id}/reviews`);
        setReviews(reviewsRes.data);
      } catch (err) {
        console.error("Error fetching details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaceAndReviews();
  }, [id]);

  // Naya review daalne ka logic
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.trim()) return;

    try {
      const res = await API.post(`/places/${id}/reviews`, { comment: newReview });
      // Naya review list mein sabse upar add kar do bina page refresh kiye
      setReviews([res.data, ...reviews]); 
      setNewReview(""); // Input box khali kar do
    } catch (err) {
      alert("Review post karne mein error aayi. Login check karein.");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading Yatra...</div>;
  if (!place) return <div className="text-center mt-10 text-red-500">Place not found!</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* --- Upar ka Hissa: Place Details --- */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <img src={place.mediaUrl} alt={place.localName} className="w-full h-96 object-cover" />
        <div className="p-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{place.localName}</h1>
          <p className="text-gray-500 font-medium mb-4">📍 {place.district}, {place.state}</p>
          <p className="text-gray-700 leading-relaxed text-lg">{place.description}</p>
          
          <div className="mt-4 text-sm text-gray-400">
            Contributed by: {place.contributedBy || "Anonymous Yatri"}
          </div>
        </div>
      </div>

      {/* --- Neeche ka Hissa: Yatriyon ki Charcha (Reviews) --- */}
      <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-4 border-b pb-2">Yatriyon ki Charcha 🗣️</h2>

        {/* Review Form (Sirf logged-in users ke liye) */}
        {user ? (
          <form onSubmit={handleReviewSubmit} className="mb-6 flex gap-2">
            <input
              type="text"
              placeholder="Aapka is jagah ke baare mein kya khayal hai?"
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              className="flex-1 border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-md font-bold hover:bg-blue-700 transition">
              Post
            </button>
          </form>
        ) : (
          <p className="mb-6 text-orange-600 bg-orange-100 p-3 rounded-md">
            ⚠️ Charcha mein shamil hone ke liye kripya pehle Login karein.
          </p>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-gray-500 italic">Abhi tak kisi yatri ne charcha nahi ki hai. Pehle banne ka mauka payein!</p>
          ) : (
            reviews.map((rev) => (
              <div key={rev._id} className="bg-white p-4 rounded-md shadow-sm border-l-4 border-blue-500">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-800">{rev.userName}</span>
                  <span className="text-xs text-gray-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-700">{rev.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default PlaceDetails;