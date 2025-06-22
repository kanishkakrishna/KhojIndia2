import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import API from "../axios";

function Contribute() {
  const { user } = useAuth();
  // Get token from localStorage
  const token = localStorage.getItem("token");
  
  const [form, setForm] = useState({
    localName: "",
    state: "",
    district: "",
    description: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check both user context and localStorage token
    if (!user || !token) {
      alert("Please login first to contribute a place.");
      return;
    }

    if (form.image && form.image.size > 5 * 1024 * 1024) {
      alert("Image size exceeds 5MB limit. Please choose a smaller image.");
      return;
    }

    setLoading(true);

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "image" && value === null) return;
      data.append(key, value);
    });

    try {
      const res = await API.post("/contribute", data, {
        headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`  // Use token from localStorage
        },
      });
      alert("✅ Place contributed successfully!");
      setForm({
        localName: "",
        state: "",
        district: "",
        description: "",
        image: null,
      });
      setFileInputKey(Date.now());
    } catch (err) {
      console.error("Contribution error:", err);
      alert(err.response?.data?.error || "❌ Failed to contribute place.");
    } finally {
      setLoading(false);
    }
  };

  // Check both user context and localStorage token for UI
  const isAuthenticated = user && token;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Contribute a Place</h2>
      
      {!isAuthenticated ? (
        <div className="text-center">
          <p className="mb-4">You must be logged in to contribute.</p>
          <div className="flex gap-4 justify-center">
            <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              Login
            </Link>
            <Link to="/signup" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
              Signup
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="localName"
            placeholder="Local Name"
            value={form.localName}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="district"
            placeholder="District"
            value={form.district}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="image"
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
            key={fileInputKey}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      )}
    </div>
  );
}

export default Contribute;