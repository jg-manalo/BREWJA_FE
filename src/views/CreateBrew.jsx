import AppToaster from "../components/AppToaster";
import {useState, useEffect} from 'react'
import MainLayout from '../layouts/MainLayout'
import toast from 'react-hot-toast';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import defaultImage from '../assets/tea.png';

export default function CreateBrew(){
    const [showLeafOption, setShowLeafOption] = useState(false);
    const {token} = useContext(AuthContext);
    const [leafType, setLeafType] = useState([]);
    const [brew ,setBrew] = useState({
        title : '',
        description : '',
        leaf_type: null,
        minutes: null,
        seconds: null,
        sweetener: 'None',
        tsp_sweetener : null,
        fluid_oz : null,
        is_private : false
    });

    useEffect ( () => {
        const fetchLeafType = async () => {
            try{
                const res = await fetch ('/api/leaf-type/', {
                    method : 'GET',
                    headers: token ?  {
                        Authorization : `Bearer ${token}`
                    } : undefined
                });

                if (!res.ok){
                    throw new Error("Failed to fetch leaf types.");
                }
                const data = await res.json();
                setLeafType(data);
            } catch(err){
                toast.error(err);
            }
        }
        fetchLeafType();
    }, [token])

    const handleSubmitBrew = async (e) =>  {
        e.preventDefault();
        
        const requestToast = toast.loading("Processing Request..."); 

        try{
            const res = await fetch(`/api/brewprofile/`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json',
                    Authorization : `Bearer ${token}`
                },
                body : JSON.stringify(brew)
            });

            const data = await res.json();

                
            if (!res.ok) {
               const errorData = data.errors;
               throw errorData;
            }else{
                toast.success("Brew profile created successfully.", {id : requestToast}); 
            }

        }catch(err){
            toast.error(err, {id : requestToast});
        }
    }
    return (
        <>
            <div className="update-profile-bg">
                <MainLayout>
                    <AppToaster />
                    <main className="flex flex-col justify-center  pt-8 pb-8 body-text w-full">
                        <form onSubmit={handleSubmitBrew} className='flex flex-row gap-x-2 w-full  justify-center'>
                            <div className="flex flex-col min-h-[25%]  p-4 gap-y-4 bg-amber-300">
                                <div className="flex flex-col items-end">
                                    <button type="button" onClick={() => setShowLeafOption(true)} className="cursor-pointer">{brew.leaf_type 
                                        ? leafType.find(l => l.id == brew.leaf_type)?.type 
                                        : `Leaf Type`
                                    }</button>
                                </div>
                                <div className="flex flex-col items-center gap-y-4">
                                    <img src={defaultImage} width={128} height={128} alt="" />
                                    <input required type="text" placeholder="Brew Title" value={brew.title?? ''} onChange={e => setBrew({...brew, title : e.target.value})}/>
                                    <textarea maxLength={255} placeholder="description" id="" value={brew.description} onChange={e => setBrew({...brew, description : e.target.value})} className="border-2"></textarea>
                                    <label class="inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={brew.is_private || false} onClick={() => setBrew({...brew, is_private : !brew.is_private})} className="sr-only peer"/>
                                        <div class="relative w-9 h-5 bg-neutral-quaternary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-soft dark:peer-focus:ring-brand-soft rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-buffer after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand"></div>
                                        <span class="select-none ms-3 text-sm font-medium text-heading">{brew.is_private? `Private` : `Public`}</span>
                                    </label>
                                </div>
                            </div>
                            <div className="flex flex-col min-h-[50%] p-4 gap-y-4 bg-amber-300">
                               <div className="flex justify-center">
                                    <h1>Steeping Info</h1>
                               </div>
                                <div className="flex gap-x-2">
                                    <label htmlFor="fluid-oz">Fluid oz</label>
                                    <input required type="number" className="flex flex-col"min={0} id="fluid-oz" value={brew.fluid_oz?? ''} onChange={e => setBrew({...brew, fluid_oz : e.target.valueAsNumber})}/>
                                </div>
                                <div className="flex items-start gap-x-2">
                                    <label htmlFor="sweetener">Sweetener</label>
                                    <select name="" id="sweetener" value={brew.sweetener?? 'None'} onChange={e => setBrew({...brew, sweetener : e.target.value})}>
                                        <option value="None">None</option>
                                        <option value="Honey">Honey</option>
                                        <option value="Sugar">Sugar</option>
                                    </select>
                                </div>
                                {brew.sweetener !== 'None' && (
                                    <div className="flex items-start gap-x-2 ">
                                    
                                        <label htmlFor="tsp-sweetener">tsp</label>
                                        <input type="number" className="flex flex-col"min={0} placeholder="1 tsp" id="tsp-sweetener" value={brew.tsp_sweetener} onChange={e => setBrew({...brew, tsp_sweetener : e.target.valueAsNumber})}/>
                                    </div>
                                )}
                                <div className="flex items-start gap-x-2 justify-center ">
                                    <label htmlFor="duration">Duration</label>
                                    <input required placeholder="minutes" type="number" className="flex flex-col"min={0} step={1} id="duration" value={brew.minutes?? ''} onChange={e => setBrew({...brew, minutes : parseInt(e.target.value)})}/>
                                    <input required placeholder="seconds" type="number" className="flex flex-col"min={0} step={1} id="duration-s" value={brew.seconds?? ''} onChange={e => setBrew({...brew, seconds : parseInt(e.target.value)})}/>
                                </div>
                                <button className="mt-4 mx-auto cursor-pointer bg-gradient-to-b from-emerald-500 to-teal-800 hover:to-teal-700 text-white shadow-md hover:shadow-emerald-400/50 hover:scale-105 transition-all duration-200 border-2 border-green-950 px-8 py-3 rounded-xl font-bold tracking-wide">Save</button>
                            </div>
                            {showLeafOption && (
                                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm">
                                    <div className="bg-gradient-to-br from-orange-100 via-amber-200 to-orange-300 rounded-2xl flex flex-col lg:max-w-xl w-[90%] justify-center p-8 gap-y-6 shadow-2xl border-2 border-amber-500">
                                        <button type="button" onClick={() => setShowLeafOption(false)}>Close</button>
                                        <h1>Leaf Type</h1>
                                        <div>
                                            {leafType.map((leaf) => (
                                                <div key={leaf.id}>
                                                    <label htmlFor={`leaf-${leaf.id}`}>{leaf.type}</label> 
                                                    <input type="radio" required name="leaf_selection" value={leaf.id} checked={brew.leaf_type == leaf.id} onChange={e => setBrew({...brew, leaf_type : e.target.value})} id={`leaf-${leaf.id}`}/> 
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </form>
                    </main>
                </MainLayout>
            </div>
        </>
    );
}