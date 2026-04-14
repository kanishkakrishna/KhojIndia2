// src/pages/Contribute.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast"; // ✅ Toast Import Kiya
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
    media: null, 
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

    if (!user || !token) {
      toast.error("Please login first to contribute a place.");
      return;
    }

    if (form.media && form.media.size > 5 * 1024 * 1024) {
      toast.error("Image size exceeds 5MB limit. Please choose a smaller image.");
      return;
    }

    setLoading(true);
    // ⏳ Toast Loading Start
    const loadingToast = toast.loading("AI Bouncer is scanning your place... 🕵️‍♂️");

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
      
      // ✅ Success Alert
      toast.dismiss(loadingToast);
      toast.success("Awesome! Your Hidden Gem is live! 🎉 You earned 1 Coin!");
      
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
      toast.dismiss(loadingToast); // Loading roko

      // 🚨 AI BOUNCER REJECTION (403 Error pakda)
      if (err.response && err.response.status === 403) {
        toast.error(
          (t) => (
            <span>
              <b>AI Bouncer Stopped You! 🛑</b><br/>
              <span style={{ fontSize: "14px", color: "#555", display: "block", marginTop: "4px" }}>
                {err.response.data.reason}
              </span>
            </span>
          ),
          { duration: 6000 } // 6 seconds ke liye dikhega
        );
      } else {
        // Normal Validation Error
        toast.error(err.response?.data?.error || "❌ Failed to contribute place.");
      }
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
              name="media" 
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="w-full"
              key={fileInputKey}
              required 
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition font-bold"
            disabled={loading}
          >
            {loading ? "Scanning & Uploading..." : "Submit Place"}
          </button>
        </form>
      )}
    </div>
  );
}

export default Contribute;