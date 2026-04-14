import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../axios"; // Make sure your axios is correctly configured

function Places() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  // Component load hote hi backend se saare places mangwao
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await API.get("/places");
        // Check karo backend kya bhej raha hai: res.data array hai ya res.data.places
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
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-bold animate-pulse text-blue-600">
          Loading Hidden Gems... 🌍
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Explore KhojIndia 🇮🇳
      </h1>
      
      {places.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <p className="text-xl">No places found yet.</p>
          <p>Be the first Yatri to contribute a hidden gem!</p>
          <Link to="/contribute" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">
            Contribute Now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Saare places pe loop chalao aur unka mast Card banao */}
          {places.map((place) => (
            <Link to={`/place/${place._id}`} key={place._id} className="block group">
              <div className="border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white h-full flex flex-col">
                
                {/* 🖼️ Photo Section */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={place.mediaUrl}
                    alt={place.localName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* 🪙 Coins Badge on Top of Image */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                    🪙 {place.coins || 1}
                  </div>
                </div>

                {/* 📝 Details Section */}
                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-xl font-bold text-gray-800 truncate mb-1">
                    {place.localName}
                  </h2>
                  <p className="text-sm text-gray-500 font-medium mb-3 flex items-center gap-1">
                    📍 {place.district}, {place.state}
                  </p>
                  
                  {/* 🚀 THE AI HASHTAGS (Isi ka toh intezar tha!) */}
                  <div className="flex flex-wrap gap-1.5 mt-auto mb-3">
                    {place.hashtags && place.hashtags.length > 0 ? (
                      place.hashtags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded border border-indigo-100"
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400 italic">No tags yet</span>
                    )}
                  </div>
                  
                  {/* 👤 Contributor Footer */}
                  <div className="mt-auto pt-3 border-t border-gray-100 text-xs text-gray-400 flex justify-between items-center">
                    <span>Discovered by</span>
                    <span className="font-bold text-gray-600 truncate max-w-[120px]">
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
  );
}

export default Places;