// src/pages/Leaderboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";

function Leaderboard() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get("http://localhost:9000/api/leaderboard");
        setLeaders(res.data);
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">🏆 Top Contributors</h2>
      <div className="bg-white rounded-xl shadow">
        {leaders.map((user, index) => (
          <div
            key={user._id}
            className="flex items-center justify-between border-b last:border-none px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl font-semibold">{index + 1}.</span>
              <span className="text-lg">{user.username}</span>
            </div>
            <span className="text-blue-600 font-bold">{user.coins} 🪙</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Leaderboard;
