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
    <nav className="bg-black/20 backdrop-blur-md p-4 flex justify-start w-full items-center sticky top-0 z-50 border-b border-white/10">
      {/* Logo / Brand */}
      <div className='grow'>
        <Link to="/" className='text-4xl font-bold logo-header bg-gradient-to-b from-amber-200 to-amber-500 bg-clip-text text-transparent'>
          Brewja
        </Link>
      </div>
      <div className='flex gap-8 justify-content items-end body-text text-white'>
        {!user ? (
          <>
            <Link to="/login" className='border-2 border-orange-400 bg-transparent backdrop-blur-2xl hover:text-yellow-400 px-4 p-2 rounded-2xl mb-4"'>
              Login
            </Link>
            <Link to="/register" className='bg-amber-800 hover:bg-amber-700 hover:text-yellow-400 px-4 p-2 rounded-2xl mb-4"'>
              Sign-up
            </Link>
          </>
        ) : (
          <>
            <Link to={`/user/${user?.id}`}>{user?.name}</Link>
            <Link onClick={handleLogout}>Log-out</Link>
          </>
        )}
      </div>

    </nav>
  );
}
