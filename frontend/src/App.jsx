// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Contribute from "./pages/Contribute";
import Places from "./pages/Places";
import Search from "./pages/Search";
import Leaderboard from "./pages/Leaderboard";
import Navbar from "./components/Navbar";
import Welcome from "./pages/homepage";

function App() {
  return (
    <BrowserRouter>
      <Navbar /> {/* ✅ Add this above Routes */}
      <Routes>
        <Route path="/" element={<Welcome/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/contribute" element={<Contribute />} />
        <Route path="/places" element={<Places />} />
        <Route path="/search" element={<Search />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

