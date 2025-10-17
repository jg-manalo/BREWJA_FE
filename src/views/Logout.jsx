import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // adjust path if needed

export default function Logout() {
  const { logout } = AuthContext(); // your logout function from context
  const navigate = useNavigate();

  useEffect(() => {
    logout();          // clear tokens, user info, etc.
    navigate('/login'); // redirect after logout
  }, [logout, navigate]);

  return null; // or <p>Logging out...</p> if you want feedback
}