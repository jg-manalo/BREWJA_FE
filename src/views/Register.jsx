import MainLayout from "../layouts/MainLayout";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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
    
    try{
      const request = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      console.log(form);
      if (!request.ok) {
        const errorData = await request.json();
        throw errorData.errors;
      } else{
        navigate('/login');
      }

    } catch (error) {
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
      <div className="login-page-bg">
        <MainLayout>        
          <main className="flex flex-col pt-8 min-h-screen body-text text-xl">
            <form onSubmit={handleRegister} className="flex flex-col justify-center items-center w-full">
              <div className="bg-radial from-orange-100 via-amber-200/90 via-10% to-orange-300/60 rounded-2xl flex flex-col lg:max-w-xl w-[80%] justify-center p-4 md:p-8 gap-y-2 md:gap-y-4">
                <h1 className="flex justify-center emphasis-text lg:text-6xl text-4xl mx-auto">Brewja Guild</h1>
                <div className="flex flex-col gap-y-4">
                  <div className="flex flex-col">
                    <label htmlFor="full-name" className=""><i>Full Name</i></label>  
                    <input id="full-name" value={form.name?? ''} onChange={e => setForm({...form, name : e.target.value})}required type="text" className="bg-stone-200 rounded-lg w-full p-2"/>
                  </div>
                  <div className="flex flex-col items-start">
                    <label htmlFor="username"><i>Username</i></label>  
                    <input id="username" value={form.username?? ''} onChange={e => setForm({...form, username : e.target.value})} required type="text" className="rounded-lg w-full p-2 bg-stone-200"/>
                    {error && <p className="font-bold text-rose-700"><i>{error.username}</i></p>}
                  </div>
                  <div className="flex flex-col items-start">
                    <label htmlFor="email"><i>E-mail</i></label>  
                    <input id="email" value={form.email?? ''} onChange={e => setForm({...form, email : e.target.value })} required type="email" className="rounded-lg w-full p-2 bg-stone-200"/>
                    {error && <p className="font-bold text-rose-700"><i>{error.email}</i></p>}
                  </div>
                  <div className="flex flex-col items-start">
                    <label htmlFor="security-question"><i>Security Question</i></label>  
                    <select id="security-question" required className="rounded-lg w-full p-2 bg-stone-200" value={selectedQuestion} onChange={e => setForm({...form, reset_password_config_id: e.target.value}) || setSelectedQuestion(e.target.value)}>
                      <option className="w-[80%] " disabled hidden value="">Select a security question...</option>
                      {securityQuestion.map((question) => (
                        <option className="bg-amber-500/10 w-[80%]"key={question.id} value={question.id}>  {formatString(question.config)} </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="security-answer"><i>Security Answer</i></label>  
                    <input id="security-answer" value={form.reset_password_config_answer?? ''} onChange={e => setForm({...form, reset_password_config_answer : e.target.value.toUpperCase()})} required type="text" className={`uppercase rounded-lg p-2 ${!selectedQuestion ? "bg-stone-200/40" : " bg-stone-200"} w-full`} disabled={!form.reset_password_config_id} />
                  </div>
                  <div className="flex flex-col justify-items-center">
                    <button className="mx-auto cursor-pointer bg-radial from-emerald-100 via-green-600 to-teal-900 hover:shadow-emerald-400 hover:scale-110 hover:shadow-lg/50 border-2 border-green-950 px-8 py-4 rounded-2xl text-gray-950 font-bold" >REGISTER</button>
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
