import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';

export default function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            console.error("Login failed:", err);
            setError(err?.message || 'Login failed');
        }
    };

    return (
        <MainLayout>
            <div className="min-h-[70vh] flex items-center justify-center bg-yellow-50 p-6">
                <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg ring-1 ring-gray-100 overflow-hidden">
                    <div className="p-6 flex flex-col items-center">
                        <div className="relative w-28 h-28 mb-4">
                            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white text-2xl font-semibold border-4 border-white shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 14a4 4 0 10-8 0m8 0v1a3 3 0 01-3 3H9a3 3 0 01-3-3v-1" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 7a3 3 0 100-6 3 3 0 000 6z" />
                                </svg>
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full shadow">ID</div>
                        </div>

                        <h2 className="text-xl font-semibold text-gray-800">Member Login</h2>
                        <p className="text-sm text-gray-500 mb-4">Scan your credentials to enter</p>

                        {error && <div className="text-sm text-red-600 mb-2">{error}</div>}

                        <form onSubmit={handleSubmit} className="w-full">
                            <div className="bg-gray-50 rounded-md p-3 mb-3 ring-1 ring-gray-100">
                                <label className="text-xs text-gray-500">Username</label>
                                <input
                                    className="w-full bg-transparent focus:outline-none mt-1 text-gray-800 font-medium"
                                    type="text"
                                    placeholder="jane.doe"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="bg-gray-50 rounded-md p-3 mb-4 ring-1 ring-gray-100">
                                <label className="text-xs text-gray-500">Password</label>
                                <input
                                    className="w-full bg-transparent focus:outline-none mt-1 text-gray-800 font-medium"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <button className="flex-1 bg-green-700 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full shadow">
                                    Log in
                                </button>
                            </div>
                        </form>

                        <Link to="/register"className="mt-4 text-xs text-gray-400">New Member?</Link>
                        <Link to="/forgot-password"className="mt-4 text-xs text-gray-400">Forgot password?</Link>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}
