import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext';
import MainLayout from '../layouts/MainLayout';
import AppToaster from '../components/AppToaster';
import toast from 'react-hot-toast';
export default function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: '',
        password: ''
    });


    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            await login(form.username, form.password);
            navigate('/');
        } catch (err){
            toast.error(err.message);
        }
    };

    return (
        <>
            <div className="login-page-bg">
                <MainLayout>
                    <main className="flex flex-col pt-8 lg:pb-8 min-h-screen body-text text-xl">
                        <AppToaster/>      
                        <form onSubmit={handleLogin} className="flex flex-col justify-center items-center w-full">
                            <div className="bg-radial from-orange-100 via-amber-200/90 via-10% to-orange-300/60 rounded-2xl flex flex-col lg:max-w-xl w-[80%] justify-center p-4 md:p-8 gap-y-2 md:gap-y-4">
                                <h1 className="flex justify-center emphasis-text lg:text-6xl text-4xl mx-auto">Brewja Guild</h1>
                                <div className="flex flex-col gap-y-4">
                                    <div className="flex flex-col items-start">
                                        <label htmlFor="username"><i>Username</i></label>  
                                        <input id="username" value={form.username?? ''} onChange={e => setForm({...form, username : e.target.value})} required type="text" className="rounded-lg w-full p-2 bg-stone-200"/>
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <label htmlFor="password"><i>Password</i></label>  
                                        <input id="password" value={form.password?? ''} onChange={e => setForm({...form, password : e.target.value})} required type="password" className="rounded-lg w-full p-2 bg-stone-200"/>
                                    </div>
                                    <div className="flex flex-col justify-items-center">
                                        <button className="mx-auto cursor-pointer bg-radial from-blue-100 via-blue-600 to-blue-900 hover:shadow-sky-400 hover:scale-110 hover:shadow-lg/50 border-2 border-sky-950 px-8 py-4 rounded-2xl text-gray-950 font-bold" >LOG-IN</button>
                                    </div>
                                    <div className="flex flex-col justify-center items-center">
                                    <Link to="/register">
                                        <p className="mx-auto font-semibold italic cursor-pointer">Not a member? Sign-up here.</p>
                                    </Link>
                                    <Link to="/forgot-password">
                                        <p className="mx-auto font-semibold italic cursor-pointer">Forgot password?</p>
                                    </Link>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </main>
                </MainLayout>
            </div>
        </>
    )
}
