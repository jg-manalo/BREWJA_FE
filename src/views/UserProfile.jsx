import {useState, useEffect} from 'react'
import { useParams,  useNavigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import AppToaster from '../components/AppToaster';

export default function UserProfile() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {token, logout} = useContext(AuthContext);
    const [user, setUser] = useState({
        name: '',
        username: '',
        email: '',
    });
    const [password, setPassword] = useState({
        current_password : '',
        new_password : '',
        new_password_confirmation : ''
    });
    const [error, setError] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [securityQuestion, setSecurityQuestion] = useState([]);
    const [security, setSecurity] = useState({
        reset_password_config_id : null,
        reset_password_config_answer : ""
    });
 

    
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
                navigate('/');
            }
        }

        fetchUser();
    }, [id, token, navigate]);

    useEffect(() => {
        const fetchSecurityQuestions = async () => {
            try {
                const response = await fetch("/api/security-questions");
                if (!response.ok) {
                throw new Error("Failed to fetch security questions");
                }
                const data = await response.json();
                setSecurityQuestion(data);
            } catch (error) {
                console.error("Error fetching security questions:", error);
            } 
        };
        fetchSecurityQuestions();
     } , []);

    const handleUpdatePersonalInfo = async (e) => {
        e.preventDefault();
        const requestToast = toast.loading("Processing Request..."); 
        
        try{ 
            const res = await fetch(`/api/user/update-personal-info/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json',
                    Authorization : `Bearer ${token}`
                },
                body: JSON.stringify(user)
            });


            const data = await res.json();

            if (!res.ok) {
               const errorData = data.errors;
               throw errorData;
            }
            
            setUser(prev => ({
                ...prev,
                ...data,
            }));

            setError(null);

            if(data.message === "Nothing to update."){
                toast.success(data.message, {id: requestToast});
            } else{
                toast.success("Updated personal information successfully.", {id : requestToast}); 
                setTimeout(() => {
                    logout(); 
                }, 2000);
            }

        }catch(error){
            toast.error("Error updating new user data.", {id : requestToast});
            setError(error);
        }
    }
    const handleUpdateSecurityQna = async (e) => {
        e.preventDefault();
        const requestToast = toast.loading("Processing Request..."); 
        
        try{ 
            const res = await fetch(`/api/user/update-security-qna/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json',
                    Authorization : `Bearer ${token}`
                },
                body: JSON.stringify(security)
            });


            const data = await res.json();
            console.log(data);
            if (!res.ok) {
               const errorData = data.errors;
               throw errorData;
            }
            
            setUser(prev => ({
                ...prev,
                ...data,
            }));

            setError(null);

            if(data.message === "Nothing to update."){
                toast.success(data.message, {id: requestToast});
            } else{
                toast.success("Updated personal information successfully.", {id : requestToast});
            }

        }catch(error){
            toast.error("Error updating new user data.", {id : requestToast});
            setError(error);
        }
    }

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        const requestToast = toast.loading("Processing Request..."); 
        
        try{ 
            const res = await fetch(`/api/user/update-password/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json',
                    Authorization : `Bearer ${token}`
                },
                body: JSON.stringify(password)
            });


            const data = await res.json();
            console.log(data);
            if (!res.ok) {
               const errorData = data.errors;
               throw errorData;
            }
            
            setUser(prev => ({
                ...prev,
                ...data,
            }));

            setError(null);

            if(data.message === "Nothing to update."){
                toast.success(data.message, {id: requestToast});
            } else{
                toast.success("Updated personal information successfully.", {id : requestToast});
                setTimeout(() => {
                    logout(); 
                }, 2000);  
            }

        }catch(error){
            toast.error("Error updating password.", {id : requestToast});
            setError(error);
        }
    }

    const handleDeleteUser = async (e) => {
        e.preventDefault();
        const requestToast = toast.loading("Processing Request..."); 
        
        try{ 
            const res = await fetch(`/api/user/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json',
                    Authorization : `Bearer ${token}`
                },
            });


            const data = await res.json();
            console.log(data);
            if (!res.ok) {
               const errorData = data.errors;
               throw errorData;
            }
            
            setError(null);

            toast.success("Account deleted successfully.", {id : requestToast});
            setTimeout(() => {
                logout(); 
            }, 2000);  
        }catch(error){
            toast.error("Error deleting account.", {id : requestToast});
            setError(error);
        }
    }

    const formatString = (str) =>{
        if(!str) return "";

        return str.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    }

  return (
    <>
        <div className='update-profile-bg'>
            <MainLayout>
                <AppToaster/>
                <main className="flex flex-col justify-center items-center pt-8 pb-8 body-text">
                    {/* Added max-w-7xl to prevent cards from stretching too wide on huge screens */}
                    <div className='flex flex-col w-full max-w-7xl lg:grid lg:grid-cols-2 lg:gap-8 gap-y-6 px-4'>
                        
                        {/* --- CARD 1: PERSONAL INFO --- */}
                        <form onSubmit={handleUpdatePersonalInfo} className="flex flex-col h-full w-full">
                            {/* increased opacity to /95 and added shadow-xl for pop */}
                            <div className="bg-radial from-orange-100 via-amber-200/90 via-10% to-orange-300/80 rounded-2xl flex flex-col h-full justify-center p-6 md:p-8 gap-y-4 shadow-xl border border-amber-900/20">
                                <h1 className='emphasis-text text-2xl text-amber-950 mb-2'>Update Your Personal Information</h1>
                                
                                <div className="flex flex-col">
                                    {/* Removed <i>, added font-semibold and distinct text color */}
                                    <label htmlFor="full-name" className="font-sans font-semibold text-amber-900 mb-1">Full Name</label>  
                                    {/* Changed bg to stone-50 for higher contrast input area */}
                                    <input id="full-name" required value={user?.name} onChange={e => setUser({...user, name : e.target.value})} type="text" className="font-sans bg-stone-50 border border-stone-300 text-stone-900 rounded-lg w-full p-3 focus:ring-2 focus:ring-amber-500 outline-none transition-all"/>
                                </div>

                                <div className="flex flex-col items-start">
                                    <label htmlFor="username" className="font-sans font-semibold text-amber-900 mb-1">Username</label>  
                                    <input id="username" value={user?.username} onChange={e => setUser({...user, username : e.target.value})} required type="text" className="font-sans bg-stone-50 border border-stone-300 text-stone-900 rounded-lg w-full p-3 focus:ring-2 focus:ring-amber-500 outline-none transition-all"/>
                                    {error && <p className="font-bold text-rose-700 text-sm mt-1">{error.username}</p>}
                                </div>

                                <div className="flex flex-col items-start">
                                    <label htmlFor="email" className="font-sans font-semibold text-amber-900 mb-1">E-mail</label>  
                                    <input id="email" value={user?.email} onChange={e => setUser({...user, email : e.target.value})} required type="email" className="font-sans bg-stone-50 border border-stone-300 text-stone-900 rounded-lg w-full p-3 focus:ring-2 focus:ring-amber-500 outline-none transition-all"/>
                                    {error && <p className="font-bold text-rose-700 text-sm mt-1">{error.email}</p>}
                                </div>

                                <button className="mt-4 mx-auto cursor-pointer bg-gradient-to-b from-emerald-500 to-teal-800 hover:to-teal-700 text-white shadow-md hover:shadow-emerald-400/50 hover:scale-105 transition-all duration-200 border-2 border-green-950 px-8 py-3 rounded-xl font-bold tracking-wide">SAVE CHANGES</button>
                            </div>
                        </form>
                        
                        {/* --- CARD 2: SECURITY QUESTION --- */}
                        <form onSubmit={handleUpdateSecurityQna} className="flex flex-col h-full w-full">
                            <div className="bg-radial from-orange-100 via-amber-200/90 via-10% to-orange-300/80 rounded-2xl flex flex-col h-full justify-center p-6 md:p-8 gap-y-4 shadow-xl border border-amber-900/20">
                                <h1 className='emphasis-text text-2xl text-amber-950 mb-2'>Update Security Question</h1>
                                <p className='font-serif text-amber-950'>Whenever you feel your security is compromised, it is better to change your security question.</p>
                                <div className="flex flex-col">
                                    <label htmlFor="security-question" className="font-sans font-semibold text-amber-900 mb-1">New Security Question</label>  
                                    <select id="security-question" required className="font-sans bg-stone-50 border border-stone-300 text-stone-900 rounded-lg w-full p-3 focus:ring-2 focus:ring-amber-500 outline-none" value={security.reset_password_config_id ?? ""} onChange={ e =>{ 
                                        const val = e.target.value;
                                        const numValue = val? Number(val) : ""; 
                                        setSecurity({...security, reset_password_config_id : numValue});
                                        }}>
                                        <option disabled hidden value="" >Select a security question...</option>
                                        {securityQuestion.map((question) => (
                                            <option className="bg-white text-stone-900" key={question.id} value={question.id}>{formatString(question.config)} </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col">
                                    <label htmlFor="security-answer" className="font-sans font-semibold text-amber-900 mb-1">New Security Answer</label>  
                                    <input id="security-answer" value={security.reset_password_config_answer ?? ''} onChange={e => setSecurity({...security, reset_password_config_answer : e.target.value.toUpperCase()})} required type="text" className="font-sans uppercase bg-stone-50 border border-stone-300 text-stone-900 rounded-lg w-full p-3 focus:ring-2 focus:ring-amber-500 outline-none"/>
                                </div>

                                <button className="mt-4 mx-auto cursor-pointer bg-gradient-to-b from-emerald-500 to-teal-800 hover:to-teal-700 text-white shadow-md hover:shadow-emerald-400/50 hover:scale-105 transition-all duration-200 border-2 border-green-950 px-8 py-3 rounded-xl font-bold tracking-wide">SAVE CHANGES</button>
                            </div>
                        </form>

                        {/* --- CARD 3: PASSWORD (Fixed Security Logic) --- */}
                        <form onSubmit={handleUpdatePassword} className="flex flex-col h-full w-full">
                            <div className="bg-radial from-orange-100 via-amber-200/90 via-10% to-orange-300/80 rounded-2xl flex flex-col h-full justify-center p-6 md:p-8 gap-y-4 shadow-xl border border-amber-900/20">
                                <h1 className='emphasis-text text-2xl text-amber-950 mb-2'>Update Password</h1>
                                
                                {/* ADDED: Current Password Field */}
                                <div className="flex flex-col items-start">
                                    <label htmlFor="current-password" className="font-sans font-semibold text-amber-900 mb-1">Current Password</label>  
                                    <input id="current-password" required type="password" value={password.current_password?? ''} onChange={e => setPassword({...password, current_password : e.target.value})} placeholder="Verify it's you..." className="font-sans bg-stone-50 border border-stone-300 text-stone-900 rounded-lg w-full p-3 focus:ring-2 focus:ring-amber-500 outline-none"/>
                                    {error && <p className="font-bold text-rose-700 text-sm mt-1">{error}</p>}    
                                </div>
                                
                                <hr className="border-amber-900/20 my-2"/>

                                <div className="flex flex-col items-start">
                                    <label htmlFor="new-password" className="font-sans font-semibold text-amber-900 mb-1">New Password</label>  
                                    <input id="new-password" required type="password" value={password.new_password?? ''} onChange={e => setPassword({...password, new_password : e.target.value})} className="font-sans bg-stone-50 border border-stone-300 text-stone-900 rounded-lg w-full p-3 focus:ring-2 focus:ring-amber-500 outline-none"/>
                                    {error && <p className="font-bold text-rose-700 text-sm mt-1">{error.new_password}</p>}    
                                </div>

                                <div className="flex flex-col items-start">
                                    <label htmlFor="confirm-password" className="font-sans font-semibold text-amber-900 mb-1">Confirm New Password</label>  
                                    <input id="confirm-password" required type="password" value={password.new_password_confirmation?? ''} onChange={e => setPassword({...password, new_password_confirmation : e.target.value})} className="font-sans bg-stone-50 border border-stone-300 text-stone-900 rounded-lg w-full p-3 focus:ring-2 focus:ring-amber-500 outline-none"/>
                                    {error && <p className="font-bold text-rose-700 text-sm mt-1">{error.new_password}</p>}    
                                    
                                    {/* {error && <p className="font-bold text-rose-700 text-sm mt-1">{error.email}</p>} */}
                                </div>

                                <button className="mt-4 mx-auto cursor-pointer bg-gradient-to-b from-emerald-500 to-teal-800 hover:to-teal-700 text-white shadow-md hover:shadow-emerald-400/50 hover:scale-105 transition-all duration-200 border-2 border-green-950 px-8 py-3 rounded-xl font-bold tracking-wide">UPDATE PASSWORD</button>
                            </div>
                        </form>

                        {/* --- CARD 4: DELETE ACCOUNT (Better centering) --- */}
                        <div className='flex flex-col h-full w-full'>    
                            <div className="bg-radial from-orange-100 via-amber-200/90 via-20% to-orange-300/80 backdrop-blur-sm rounded-2xl flex flex-col h-full justify-center items-center p-6 md:p-8 gap-y-6 shadow-xl border border-amber-900/20 text-center">
                                <div>
                                    <h1 className='emphasis-text text-2xl text-red-900 mb-2'>Delete Your Account</h1>
                                    <h2 className="font-serif text-amber-950">Tread with caution, this action cannot be undone.</h2>
                                </div>
                                <button onClick={() => setConfirmDelete(true)} className="cursor-pointer bg-gradient-to-b from-red-500 to-red-900 hover:to-red-800 text-white shadow-md hover:shadow-red-400/50 hover:scale-105 transition-all duration-200 border-2 border-red-950 px-8 py-3 rounded-xl font-bold tracking-wide">DELETE ACCOUNT</button>
                            </div>
                        </div>

                    </div>
                </main>    
                
                {/* MODAL (Kept mostly the same, just touched up colors) */}
                {confirmDelete && (
                    <form onSubmit={handleDeleteUser}  className="fixed inset-0 z-50 flex flex-col justify-center items-center w-full bg-black/70 backdrop-blur-sm p-4">
                        <div className="bg-gradient-to-br from-orange-100 via-amber-200 to-orange-300 rounded-2xl flex flex-col lg:max-w-xl w-[90%] justify-center p-8 gap-y-6 shadow-2xl border-2 border-amber-500">
                            <div className='flex justify-between items-start'>
                                <h1 className='emphasis-text text-xl grow text-amber-950 pr-4'>Are you sure you want to delete your account?</h1>
                                <button type="button" onClick={() => setConfirmDelete(false)} className='text-amber-900 hover:text-amber-700 font-bold px-2'>✕</button>
                            </div>
                            <h2 className="font-serif text-amber-950">All the adventures you have taken will be obliterated into oblivion.</h2>
                            <div className="flex justify-center gap-4">
                                <button type="button" onClick={() => setConfirmDelete(false)} className="cursor-pointer bg-transparent border-2 border-amber-900/30 text-amber-900 hover:bg-amber-900/10 px-6 py-3 rounded-xl font-bold">CANCEL</button>
                                <button className="cursor-pointer bg-gradient-to-b from-red-600 to-red-900 hover:shadow-red-500/50 hover:scale-105 border-2 border-red-950 px-8 py-3 rounded-xl text-white font-bold transition-all">GOODBYE</button>
                            </div>
                        </div>
                    </form>
                )}

            </MainLayout>             
        </div>
    </>
  );
}
