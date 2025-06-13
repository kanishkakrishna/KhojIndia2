// src/pages/Search.jsx
import { useState } from "react";
import axios from "axios";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    try {
      const res = await axios.get(`http://localhost:9000/api/search?query=${query}`);
      setResults(res.data);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search by name, district or state"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-md w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((place) => (
            <div key={place._id} className="bg-white rounded-xl shadow p-4">
              <h3 className="text-xl font-semibold">{place.localName}</h3>
              <p className="text-sm text-gray-600">
                {place.district}, {place.state}
              </p>
              <p className="mt-2">{place.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;
