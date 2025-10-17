import {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function UserProfile() {
    const {id} = useParams();
    const {token} = useContext(AuthContext);
    const [user, setUser] = useState({});

    
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
            }
        }

        fetchUser();
    }, [id, token]);
  return (
    <MainLayout>
        <div className='bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto mt-8'>
            <h2 className='text-2xl font-bold mb-4'>User Profile</h2>
            <label for="name"  className='text-gray-400'>Full Name</label>
            <div>
                <input id="name" className='border-gray-950 border rounded-md p-2 mb-4'type="text" value={user.name}/>
            </div>
            <label for="username" className='text-gray-400'>Username</label>
            <div>
                <input id ="username"className='border-gray-950 border rounded-md p-2 mb-4'type="text" value={user.username}/>
            </div>
            <label for="email" className='text-gray-400'>E-mail</label>
            <div>
                <input id="email" className='border-gray-950 border rounded-md p-2 mb-4'type="text" value={user.email}/>
            </div>
        </div>
    </MainLayout>
  )
}
