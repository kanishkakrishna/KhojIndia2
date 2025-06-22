import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-100 shadow-md">
      <Link to="/" className="text-xl font-bold">KhojIndia</Link>

      <div className="flex gap-4 items-center">
        <Link to="/places">Places</Link>
        <Link to="/search">Search</Link>
        <Link to="/leaderboard">Leaderboard</Link>

        {/* Always show Contribute link */}
        <Link 
          to="/contribute" 
          className={`${user ? "text-green-600 font-medium" : "text-gray-500"}`}
        >
          Contribute
        </Link>

        {user ? (
          <>
            <span className="text-gray-700">Hi, {user.username}</span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-blue-500">Login</Link>
            <Link to="/signup" className="text-blue-500">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;