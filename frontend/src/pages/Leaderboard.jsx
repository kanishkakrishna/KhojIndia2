// src/pages/Leaderboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";

function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const API_BASE_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:9000";
        const res = await axios.get(`${API_BASE_URL}/api/leaderboard`);
        
        // --- THE CHANGE IS HERE ---
        // Access the 'leaderboard' property from the response data
        if (res.data && Array.isArray(res.data.leaderboard)) {
          setLeaders(res.data.leaderboard);
        } else {
          // Handle cases where 'leaderboard' property might be missing or not an array
          console.warn("API response did not contain an array at 'res.data.leaderboard'", res.data);
          setError("Invalid leaderboard data received.");
        }
        // --- END OF CHANGE ---

      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
        setError("Failed to load leaderboard. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-center">🏆 Top Contributors</h2>
      
      {isLoading ? (
        <p className="text-center text-gray-500 text-lg">Loading leaderboard...</p>
      ) : error ? (
        <p className="text-center text-red-600 text-lg">{error}</p>
      ) : leaders.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          {leaders.map((user, index) => (
            <div
              key={user._id}
              className="flex items-center justify-between border-b border-gray-100 last:border-none px-4 py-3 sm:px-6"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl font-extrabold text-gray-700 w-8 text-center">
                  {index + 1}.
                </span>
                <span className="text-lg font-medium text-gray-800">
                  {user.username}
                </span>
              </div>
              <span className="text-blue-600 font-bold text-xl flex items-center gap-1">
                {user.coins} <span className="text-yellow-500">🪙</span>
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg">No contributors found yet.</p>
      )}
    </div>
  );
}

export default Leaderboard;