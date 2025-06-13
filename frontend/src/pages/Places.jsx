// src/pages/Places.jsx
import { useEffect, useState } from "react";
import axios from "axios";

function Places() {
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error messages

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setIsLoading(true); // Set loading to true before fetching
        setError(null);     // Clear any previous errors

        // Use environment variable for API base URL for better maintainability
        // Assuming VITE_APP_API_URL or REACT_APP_API_URL is configured in your .env file
        const API_BASE_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:9000";
        const res = await axios.get(`${API_BASE_URL}/api/places`);
        
        // --- THE CRUCIAL CHANGE IS HERE ---
        // Access the 'places' property from the response data
        if (res.data && Array.isArray(res.data.places)) {
          setPlaces(res.data.places);
        } else {
          // Log a warning and set an error if the expected data structure is not found
          console.warn("API response for places did not contain an array at 'res.data.places'", res.data);
          setError("Invalid places data received from server.");
        }
        // --- END OF CHANGE ---

      } catch (err) {
        console.error("Error fetching places:", err);
        setError("Failed to load places. Please try again later."); // User-friendly error message
      } finally {
        setIsLoading(false); // Set loading to false after fetching (whether success or error)
      }
    };

    fetchPlaces();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="p-4 max-w-7xl mx-auto"> {/* Added max-w-7xl and mx-auto for better centering on larger screens */}
      <h2 className="text-3xl font-bold mb-6 text-center">🗺️ All Contributed Places</h2>
      
      {isLoading ? (
        // Display loading message while data is being fetched
        <p className="text-center text-gray-500 text-lg">Loading places...</p>
      ) : error ? (
        // Display error message if fetching fails
        <p className="text-center text-red-600 text-lg p-4 bg-red-100 rounded-lg">{error}</p>
      ) : places.length > 0 ? (
        // Display the places if data is available
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"> {/* Adjusted grid for more columns on larger screens */}
          {places.map((place) => (
            <div 
              key={place._id} 
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-5 flex flex-col justify-between border border-gray-200"
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{place.localName}</h3>
                <p className="text-sm text-gray-600 mb-3">
                  {place.district}, {place.state}
                </p>
                {place.description && ( // Only render description if it exists
                    <p className="mt-2 text-gray-700 text-base line-clamp-3">{place.description}</p>
                )}
              </div>
              {/* You might want to add a link or button here to view full details */}
              {/* <div className="mt-4 text-right">
                <button className="text-blue-600 hover:underline font-medium">View Details</button>
              </div> */}
            </div>
          ))}
        </div>
      ) : (
        // Display message if no places are found after loading
        <p className="text-center text-gray-500 text-lg p-4 bg-gray-50 rounded-lg">No places found yet. Be the first to contribute!</p>
      )}
    </div>
  );
}

export default Places;