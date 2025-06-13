import { useState } from "react";
import { useAuth } from "../context/authContext";
import API from "../axios";

function Contribute() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    localName: "",
    state: "",
    district: "",
    description: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return alert("Please login first");

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const res = await API.post("/places", data, {
        headers: {
          "Content-Type": "multipart/form-data",
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

      // Optionally reset file input
      document.getElementById("imageInput").value = "";
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "❌ Failed to contribute place");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Contribute a Place</h2>
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
          id="imageInput"
          name="image"
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="w-full"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Contribute;
