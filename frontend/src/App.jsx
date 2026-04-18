// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Contribute from "./pages/Contribute";
import Places from "./pages/Places";
import Search from "./pages/Search";
import Leaderboard from "./pages/Leaderboard";
import Navbar from "./components/Navbar";
import Welcome from "./pages/homepage";
import PlaceDetails from "./pages/PlaceDetails";
import AiTripPlanner from "./pages/AiTripPlanner";

function App() {
  return (
    <BrowserRouter>
      {/* ✅ Fixed spacing so toast doesn't overlap navbar */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            marginTop: "60px",
          },
        }}
      />

      <Navbar />

      {/* ✅ Prevent content from hiding behind fixed navbar */}
      <main className="pt-14">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/contribute" element={<Contribute />} />
          <Route path="/places" element={<Places />} />
          <Route path="/search" element={<Search />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/place/:id" element={<PlaceDetails />} />
          <Route path="/ai-planner" element={<AiTripPlanner />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;