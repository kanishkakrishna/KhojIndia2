// src/pages/Places.jsx
import { useEffect, useState } from "react";
import axios from "axios";

function Places() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await axios.get("http://localhost:9000/api/places");
        setPlaces(res.data);
      } catch (err) {
        console.error("Error fetching places:", err);
      }
    };

    fetchPlaces();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">All Contributed Places</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {places.map((place) => (
          <div key={place._id} className="bg-white rounded-xl shadow p-4">
            <h3 className="text-xl font-semibold">{place.localName}</h3>
            <p className="text-sm text-gray-600">
              {place.district}, {place.state}
            </p>
            <p className="mt-2">{place.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Places;
