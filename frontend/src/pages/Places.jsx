// src/pages/Places.jsx
import { useEffect, useState } from "react";
import API from "../axios"; // ✅ Use the custom API instance

function Places() {
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await API.get("/places"); // ✅ Cleaner call

        if (res.data && Array.isArray(res.data.places)) {
          setPlaces(res.data.places);
        } else {
          console.warn("Unexpected API response format:", res.data);
          setError("Invalid places data received from server.");
        }
      } catch (err) {
        console.error("Error fetching places:", err);
        setError("Failed to load places. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">🗺️ All Contributed Places</h2>

      {isLoading ? (
        <p className="text-center text-gray-500 text-lg">Loading places...</p>
      ) : error ? (
        <p className="text-center text-red-600 text-lg p-4 bg-red-100 rounded-lg">{error}</p>
      ) : places.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {places.map((place) => (
            <div
              key={place._id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-5 flex flex-col justify-between border border-gray-200"
            >
              <div>
                {place.mediaUrl && (
                  <div className="mb-4 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={place.mediaUrl}
                      alt={`Image of ${place.localName}`}
                      className="w-full h-48 object-cover object-center"
                    />
                  </div>
                )}

                <h3 className="text-xl font-semibold text-gray-900 mb-1">{place.localName}</h3>
                <p className="text-sm text-gray-600 mb-3">
                  {place.district}, {place.state}
                </p>
                {place.description && (
                  <p className="mt-2 text-gray-700 text-base line-clamp-3">
                    {place.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg p-4 bg-gray-50 rounded-lg">
          No places found yet. Be the first to contribute!
        </p>
      )}
    </div>
  );
}

export default Places;
