// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // ✅ Naya Import
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Contribute from "./pages/Contribute";
import Places from "./pages/Places";
import Search from "./pages/Search";
import Leaderboard from "./pages/Leaderboard";
import Navbar from "./components/Navbar";
import Welcome from "./pages/homepage";
import PlaceDetails from "./pages/PlaceDetails";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} /> {/* ✅ Toaster Add Kiya */}
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Welcome/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/contribute" element={<Contribute />} />
        <Route path="/places" element={<Places />} />
        <Route path="/search" element={<Search />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/place/:id" element={<PlaceDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;