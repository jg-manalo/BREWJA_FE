import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Nav() {
  const { user, logout } = useContext(AuthContext); // get logout from context
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // send user to login (or '/')
  };

  return (
    <nav className="bg-purple-900 px-6 py-4 m-auto shadow-md flex justify-between items-center">
      {/* Logo / Brand */}
      <div className="flex flex-col items-center">
        <span className="text-white text-2xl font-bold tracking-wide flex items-center">
          <span className="text-3xl mr-2">🧙‍♀️</span>
          Brewha
        </span>
        <span className="text-purple-200 text-sm italic text-center">
          Magic Steeped, Secrets Sipped.
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex space-x-6 text-white">
        {!user ? (
          <Link
            to="/login"
            className="hover:text-purple-300 transition-colors"
          >
            Login
          </Link>
        ) : (
          <span className="bold bold flex flex-row gap-4 justify-between items-center w-full max-w-xs sm:max-w-md md:max-w-lg">
            <div>
              <Link to="/">Home</Link>
            </div>
            <div>
              <Link to={`/user/${user.id ?? ''}`}>{user.username}</Link>
            </div>
            <div>
              <button
                onClick={handleLogout}
                className="hover:text-purple-300 transition-colors cursor-pointer bg-transparent border-0 p-0"
                aria-label="Log out"
              >
                Log out
              </button>
            </div>
          </span>
        )}
      </div>
    </nav>
  );
}
