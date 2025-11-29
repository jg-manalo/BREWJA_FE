import {useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import AppToaster from '../components/AppToaster';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
export default function ForgotPassword(){

    const formatString = (str) =>{
        if(!str) return "";

        return str.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    }

    const navigate = useNavigate();
    const [securityQuestion, setSecurityQuestion] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState("");
    const [form, setForm] = useState({
        username: '',
        reset_password_config_id: null,
        reset_password_config_answer: '',
        new_password: '',
        new_password_confirmation: ''
    });

    const handleResetPassword = async (e) => {
        e.preventDefault();
        const requestToast = toast.loading("Processing Request...");

        try{
            const request = await fetch('/api/reset-password', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });
            
            if (!request.ok) {
                const errorData = await request.json();
                console.log(errorData);
                throw errorData;
            }
            toast.success("Password reset successful.", {id : requestToast});
            navigate('/login')
        } catch (error) {
         toast.error(error.message, {id : requestToast});
        }
    } 

    useEffect(() => {
        const fetchSecurityQuestions = async () => {
          try {
            const response = await fetch("/api/security-questions");
            if (!response.ok) {
              throw new Error("Failed to fetch security questions");
            }
            const data = await response.json()
            setSecurityQuestion(data);
          } catch (error) {
            console.error("Error fetching security questions:", error);
          } 
        };
        fetchSecurityQuestions();
      } , []);

    return(
        <>
            <div className="forgot-password-page-bg">
                <MainLayout>
                    <AppToaster/>
                    <main className="flex flex-col pt-8 lg:pb-8 min-h-screen body-text text-xl">
                        {/* <AppToaster/> */}
                        <form onSubmit={handleResetPassword} className="flex flex-col justify-center items-center w-full">
                            <div className="bg-radial from-orange-100 via-amber-200/90 via-10% to-orange-300/60 rounded-2xl flex flex-col lg:max-w-xl w-[80%] justify-center p-4 md:p-8 gap-y-2 md:gap-y-4">
                                <h1 className="flex justify-center emphasis-text lg:text-6xl text-4xl mx-auto">Forgot Password</h1>
                                <div className="flex flex-col gap-y-4">
                                    <div className="flex flex-col items-start">
                                        <label htmlFor="username"><i>Username</i></label>  
                                        <input id="username" value={form.username?? ''} onChange={e => setForm({...form, username : e.target.value})} required type="text" className="rounded-lg w-full p-2 bg-stone-200"/>
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <label htmlFor="security-question"><i>Security Question</i></label>  
                                        <select id="security-question" required className="rounded-lg w-full p-2 bg-stone-200" value={selectedQuestion} onChange={ e =>{ 
                                            const val = e.target.value;
                                            const numValue = val? Number(val) : ""; 
                                            setForm({...form, reset_password_config_id : numValue});
                                            setSelectedQuestion(numValue)}}>
                                            <option className="w-[80%] " disabled hidden value="" >Select a security question...</option>
                                            {securityQuestion.map((question) => (
                                                <option className="bg-amber-500/10 w-[80%]"key={question.id} value={question.id}>{formatString(question.config)} </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <label htmlFor="security-answer"><i>Security Answer</i></label>  
                                        <input id="security-answer" autoComplete="off" value={form.reset_password_config_answer?? ''} onChange={e => setForm({...form, reset_password_config_answer : e.target.value.toUpperCase()})} required type="text" className="rounded-lg w-full p-2 bg-stone-200"/>
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <label htmlFor="password"><i>New Password</i></label>  
                                        <input id="password" value={form.new_password?? ''} onChange={e => setForm({...form, new_password : e.target.value})} required type="password" className="rounded-lg w-full p-2 bg-stone-200"/>
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <label htmlFor="password-confirmation"><i>Confirm New Password</i></label>  
                                        <input id="password-confirmation" value={form.new_password_confirmation?? ''} onChange={e => setForm({...form, new_password_confirmation : e.target.value})} disabled={!form.new_password} required type="password" className={`rounded-lg w-full p-2 ${!form.new_password ? "bg-stone-200/40" :  "bg-stone-200"}`}/>
                                    </div>
                                    <div className="flex flex-col justify-items-center">
                                         <button className="mx-auto cursor-pointer bg-radial from-emerald-100 via-green-600 to-teal-900 hover:shadow-emerald-400 hover:scale-110 hover:shadow-lg/50 border-2 border-green-950 px-8 py-4 rounded-2xl text-gray-950 font-bold" >RESET PASSWORD</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </main>
                </MainLayout>
            </div>
        </>
    );
}