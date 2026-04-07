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
    media: null, // 'image' ko 'media' kar diya backend match karne ke liye
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

    if (form.media && form.media.size > 5 * 1024 * 1024) {
      alert("Image size exceeds 5MB limit. Please choose a smaller image.");
      return;
    }

    setLoading(true);

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "media" && value === null) return;
      data.append(key, value);
    });

    try {
      const res = await API.post("/contribute", data, {
        headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        },
      });
      alert("✅ Place contributed successfully! You earned 1 Coin!");
      
      // Form reset
      setForm({
        localName: "",
        state: "",
        district: "",
        description: "",
        media: null,
      });
      setFileInputKey(Date.now());
      
    } catch (err) {
      console.error("Contribution error:", err);
      // Backend se jo proper error message aayega (jaise 50 character wala), wo yahan dikhega
      alert(err.response?.data?.error || "❌ Failed to contribute place.");
    } finally {
      setLoading(false);
    }
  };

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
            placeholder="Local Name (e.g., Hidden Waterfall)"
            value={form.localName}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="state"
            placeholder="State (e.g., Maharashtra)"
            value={form.state}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            name="district"
            placeholder="District (e.g., Pune)"
            value={form.district}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          
          <div>
            <textarea
              name="description"
              placeholder="Describe the beauty and experience of this place..."
              value={form.description}
              onChange={handleChange}
              className="w-full border p-2 rounded min-h-[120px]"
              required
              minLength={50}
              maxLength={1000}
            />
            <p className="text-xs text-gray-500 text-right">
              {form.description.length}/1000 (Min 50 chars)
            </p>
          </div>

          <div className="border p-2 rounded bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload a beautiful photo <span className="text-red-500">*</span>
            </label>
            <input
              name="media" // Backend match karne ke liye media kiya
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="w-full"
              key={fileInputKey}
              required // Photo zaroori hai!
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition font-bold"
            disabled={loading}
          >
            {loading ? "Uploading to KhojIndia..." : "Submit Place"}
          </button>
        </form>
      )}
    </div>
  );
}

export default Contribute;