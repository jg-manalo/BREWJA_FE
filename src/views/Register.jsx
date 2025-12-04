import MainLayout from "../layouts/MainLayout";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AppToaster from "../components/AppToaster";
import toast from "react-hot-toast";

export default function Register() {

  const navigate = useNavigate();
  const [securityQuestion, setSecurityQuestion] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [error, setError] = useState({});
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    reset_password_config_id: null,
    reset_password_config_answer: ''
  });


  const formatString = (str) =>{
    if(!str) return "";

    return str.toLowerCase().split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

   const handleRegister = async (e) => {
    e.preventDefault();
    const requestToast = toast.loading("Processing Request...");
    
    try{
      const request = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });


      if (!request.ok) {
        const errorData = await request.json();
        toast.error("Registration failed.");
        throw errorData.errors;
      }

        toast.success("Registration successful.", {id : requestToast});
        navigate('/login');
    } catch (error) {
      toast.error("Registration failed.", {id : requestToast});
      setError(error);
    }

  }
  
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

  return (
    <>
      <div className="sign-up-bg">
        <MainLayout>
          <main className="flex flex-col pt-8 lg:pb-8 min-h-screen font-serif">
            <AppToaster/>      
            <form onSubmit={handleRegister} className="flex flex-col justify-center items-center w-full">
              <div className="bg-radial from-orange-100 via-amber-200/90 via-10% to-orange-300/60 rounded-2xl flex flex-col lg:max-w-xl w-[80%] justify-center p-4 md:p-8 gap-y-2 md:gap-y-4">
                <h1 className="flex justify-center emphasis-text text-amber-950 lg:text-6xl text-4xl mx-auto">Brewja Guild</h1>
                <div className="flex flex-col gap-y-4">
                  <div className="flex flex-col">
                    <label htmlFor="full-name" className="">Full Name</label>  
                    <input id="full-name" value={form.name?? ''} onChange={e => setForm({...form, name : e.target.value})}required type="text" className="bg-stone-200 rounded-lg w-full p-2"/>
                  </div>
                  <div className="flex flex-col items-start">
                    <label htmlFor="username">Username</label>  
                    <input id="username" value={form.username?? ''} onChange={e => setForm({...form, username : e.target.value})} required type="text" className="rounded-lg w-full p-2 bg-stone-200"/>
                    {error && <p className="font-bold text-rose-700">{error.username}</p>}
                  </div>
                  <div className="flex flex-col items-start">
                    <label htmlFor="email">E-mail</label>  
                    <input id="email" value={form.email?? ''} onChange={e => setForm({...form, email : e.target.value })} required type="email" className="rounded-lg w-full p-2 bg-stone-200"/>
                    {error && <p className="font-bold text-rose-700">{error.email}</p>}
                  </div>
                  <div className="flex flex-col items-start">
                    <label htmlFor="security-question">Security Question</label>  
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
                  <div>
                    <label htmlFor="security-answer">Security Answer</label>  
                    <input id="security-answer" value={form.reset_password_config_answer?? ''} onChange={e => setForm({...form, reset_password_config_answer : e.target.value.toUpperCase()})} required type="text" className={`uppercase rounded-lg p-2 ${!selectedQuestion ? "bg-stone-200/40" : " bg-stone-200"} w-full`} disabled={!form.reset_password_config_id} />
                  </div>
                  <div className="flex flex-col justify-items-center">
                    <button className="mt-4 mx-auto cursor-pointer bg-gradient-to-b from-emerald-500 to-teal-800 hover:to-teal-700 text-white shadow-md hover:shadow-emerald-400/50 hover:scale-105 transition-all duration-200 border-2 border-green-950 px-8 py-3 rounded-xl font-bold tracking-wide" >REGISTER</button>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <Link to="/login">
                      <p className="mx-auto font-semibold italic cursor-pointer">Already a member? Log-in here.</p>
                    </Link>
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
