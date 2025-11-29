import {useState, useEffect} from 'react'
import { useParams,  useNavigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import defaultImage from '../assets/tea.png';

export default function UserProfile() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {token} = useContext(AuthContext);
    const [user, setUser] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    
    useEffect(() => {
        const fetchUser = async () => {
            try{
                const res = await fetch(`/api/user/${id}`,{
                    method: 'GET',
                    headers: token ?  {
                        Authorization : `Bearer ${token}`
                    } : undefined
                });
                if (!res.ok) {
                    throw new Error("Failed to fetch user data");
                }
                const data = await res.json();
                setUser(data);
            }catch(err){
                console.error("Error fetching user data:", err);
                setError(err.message);
            }
        }

        fetchUser();
    }, [id, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const updateUser  = { ...user };

            if(!updateUser.password){
                delete updateUser.password;
                delete updateUser.password_confirmation;
            }

            const res = await fetch(`/api/user/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization : `Bearer ${token}`
                },
                body: JSON.stringify(user)
            });
            if (!res.ok) {
                throw new Error("Failed to update user data");
            }
            const data = await res.json();
            setUser(prev => ({
                ...prev,
                ...data,
                password: '',
                password_confirmation: ''
            }));
            console.log("User data updated successfully", data);
            setError(null);
            navigate(`/`);
        }catch(err){
            console.error("Error updating user data:", err);
            setError(err.message);
        }
    }
  return (
    <>
        <div className='update-profile-bg'>
            <MainLayout>
            <div className='bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto mt-8 grid min-h-screen w-full'>
                <h2 className='text-2xl font-bold mb-4'>Sorcerer's Profile</h2>
                <form onSubmit={handleSubmit} className='flex flex-row gap-4' >
                    <div>
                        <img src={defaultImage}
                                alt="Tea"
                                className="w-full h-44 object-cover"
                            />
                    </div>
                    <div>
                        <label htmlFor="name"  className='text-gray-400'>Full Name</label>
                        <div>
                            <input id="name" className='border-gray-950 border rounded-md p-2 mb-4'type="text" value={user.name}
                            onChange={e => setUser({...user, name : e.target.value})}
                            required
                            />
                        </div>
                        <label htmlFor="username" className='text-gray-400'>Username</label>
                        <div>
                            <input id ="username"className='border-gray-950 border rounded-md p-2 mb-4'type="text" value={user.username}
                            onChange={e => setUser({...user, username: e.target.value})}
                            required
                            />
                        </div>
                        <label htmlFor="email" className='text-gray-400'>E-mail</label>
                        <div>
                            <input id="email" className='border-gray-950 border rounded-md p-2 mb-4'type="text" value={user.email}
                            onChange={e => setUser({...user, email: e.target.value})}
                            />
                        </div>
                    </div>
                    <label htmlFor="password" className='text-gray-400'>New Password</label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            className='w-full pr-10 border-gray-950 border rounded-md p-2 mb-4'
                            value={user.password ?? ''}
                            onChange={e => {
                                const val = e.target.value;
                                // clear confirmation when password is emptied
                                setUser(prev => ({ 
                                ...prev, 
                                password: val, 
                                ...(val ? {} : { password_confirmation: '' })
                                }));
                            }}
                            minLength={8}
                        />
                        <button
                            type="button"
                            aria-label="Show password"
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                            onMouseDown={() => setShowPassword(true)}
                            onMouseUp={() => setShowPassword(false)}
                            onMouseLeave={() => setShowPassword(false)}
                            onTouchStart={() => setShowPassword(true)}
                            onTouchEnd={() => setShowPassword(false)}
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </button>
                    </div>

                    {user.password ? (
                    <>
                        <label htmlFor="password_confirmation" className='text-gray-400'>Confirm New Password</label>
                        <div className="relative">
                            <input
                                id="password_confirmation"
                                type={showPasswordConfirm ? 'text' : 'password'}
                                className='w-full pr-10 border-gray-950 border rounded-md p-2 mb-4'
                                value={user.password_confirmation ?? ''}
                                onChange={e => setUser({...user, password_confirmation: e.target.value})}
                                minLength={8}
                            />
                            <button
                                type="button"
                                aria-label="Show confirm password"
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                                onMouseDown={() => setShowPasswordConfirm(true)}
                                onMouseUp={() => setShowPasswordConfirm(false)}
                                onMouseLeave={() => setShowPasswordConfirm(false)}
                                onTouchStart={() => setShowPasswordConfirm(true)}
                                onTouchEnd={() => setShowPasswordConfirm(false)}
                            >
                                {showPasswordConfirm ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </>
                    ) : null}
                    <button className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 border rounded'>Update</button>
                    {error && <p className="text-red-500">{error}</p>}
                </form>
            </div>
            </MainLayout>             
        </div>
    </>
    
  
  );
}
