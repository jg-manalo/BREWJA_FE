import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext); // get logout from context
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // send user to login (or '/')
  };

  return (
    <nav className="bg-black/20 backdrop-blur-md p-4 flex justify-start w-full items-center sticky top-0 z-50 border-b border-white/10">
      {/* Logo / Brand */}
      <div className='grow'>
        <Link to="/" className='text-5xl font-bold logo-header bg-gradient-to-b from-amber-200 to-amber-500 bg-clip-text text-transparent'>
          Brewja
        </Link>
      </div>
      <div className='flex gap-4 justify-content items-end body-text text-xl text-white'>
        {!user ? (
          <>
            <Link to="/login" className='border-2 border-orange-400 bg-transparent backdrop-blur-2xl hover:text-yellow-400 px-4 p-2 rounded-2xl mb-4"'>
              Log-in
            </Link>
            <Link to="/register" className='bg-amber-800 hover:bg-amber-700 hover:text-yellow-400 px-4 p-2 rounded-2xl mb-4"'>
              Sign-up
            </Link>
          </>
        ) : (
          <div className='flex gap-4 text-xl'>
            <Link to={`/user/${user?.id}`} className='hover:underline'>{user?.name}</Link>
            <Link onClick={handleLogout} className='hover:underline'>Log-out</Link>
          </div>
        )}
      </div>

    </nav>
  );
}
