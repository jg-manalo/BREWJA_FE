import AppToaster from "../components/AppToaster";
import {useState, useEffect} from 'react'
import MainLayout from '../layouts/MainLayout'
import toast from 'react-hot-toast';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import LeafBadge from "../components/LeafBadgeButton";
import { leafTypeColors } from "../constants/LeafTypeColors";
import ImageHandler from "../components/images/ImageHandler";
import { useNavigate } from "react-router-dom";

export default function CreateBrew(){
    const navigate = useNavigate();
    const [showLeafOption, setShowLeafOption] = useState(false);
    const {token} = useContext(AuthContext);
    const [leafType, setLeafType] = useState([]);
    const [error, setError] = useState("");
    const [brew ,setBrew] = useState({
        title : '',
        description : '',
        leaf_type: null,
        minutes: null,
        seconds: null,
        sweetener: 'None',
        tsp_sweetener : null,
        fluid_oz : null,
        is_private : false,
        image : null
    });

    useEffect(() => {
        return () => {
            if (brew.imagePreview && brew.imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(brew.imagePreview);
            }
        };
    }, [brew.imagePreview]);

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
                setError("");
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
            const formData = new FormData();

            const appendIfPresent = (key, value) => {
                if (value !== null && value !== undefined) {
                    formData.append(key, value);
                }
            };

            appendIfPresent('title', brew.title);
            appendIfPresent('description', brew.description);
            appendIfPresent('leaf_type', brew.leaf_type);
            appendIfPresent('minutes', brew.minutes);
            appendIfPresent('seconds', brew.seconds);
            appendIfPresent('sweetener', brew.sweetener);
            appendIfPresent('tsp_sweetener', brew.tsp_sweetener);
            appendIfPresent('fluid_oz', brew.fluid_oz);
            formData.append('is_private', brew.is_private ? 'true' : 'false');

            if (brew.image instanceof File) {
                formData.append('image', brew.image);
            }

            // Debug: Log FormData payload
            for (let [key, value] of formData.entries()) {
                if (value instanceof File) {
                    console.log(`FormData: ${key} = [File] name: ${value.name}, size: ${value.size}`);
                } else {
                    console.log(`FormData: ${key} =`, value);
                }
            }

            const res = await fetch(`/api/brewprofile/`,{
                method: 'POST',
                headers: {
                    Authorization : `Bearer ${token}`
                },
                body : formData
            });

            const contentType = res.headers.get('content-type') || '';
            let data = null;

            if (contentType.includes('application/json')) {
                data = await res.json();
            } else {
                const textBody = await res.text();
                data = textBody ? { message: textBody } : null;
            }

            console.log(data);
                
            if (!res.ok) {
               const errorData = data?.errors || data?.message || "Error creating brew profile.";
               throw errorData;
            }else{
                toast.success("Brew profile created successfully.", {id : requestToast});
                navigate('/');
            }

        }catch(err){
            toast.error("Error creating brew profile.", {id : requestToast});
            setError(err);
            console.log(err)
        }
    }

    const handleUploadImage = (e) => {
        const file = e.target.files[0];

        if(!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error("File size exceeds 2MB limit.");
            return;
        }

        // Revoke previous URL to prevent memory leaks
        if (brew.imagePreview) {
            URL.revokeObjectURL(brew.imagePreview);
        }

        setBrew({...brew, image : file, imagePreview : URL.createObjectURL(file)});
    }

    const handleImageRevoke = () => {
        if (brew.imagePreview && brew.imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(brew.imagePreview);
        }
        setBrew({ ...brew, image: null, imagePreview: null });
    }


    return (
        <>
            <div className="create-brews-page-bg">
                <MainLayout>
                    <main className="flex flex-col min-h-screen pt-8 pb-8 w-full font-serif">
                        <AppToaster />
                        <form onSubmit={handleSubmitBrew} className='flex gap-y-4 lg:max-w-full lg:w-full  justify-center '>
                            <div className="flex flex-col rounded-lg p-4 gap-y-4 bg-linear-45 from-indigo-100 to-red-100 shadow-xl lg:w-[50%]  h-fit">
                                <div className="flex flex-row items-start">
                                    <div className="flex flex-grow">
                                        <label className="inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={brew.is_private || false} onChange={() => setBrew({...brew, is_private : !brew.is_private})} className="sr-only peer"/>
                                            <div className="bg-indigo-300 relative w-9 h-5 bg-neutral-quaternary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-soft dark:peer-focus:ring-brand-soft rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-buffer after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand"></div>
                                            <span className="select-none ms-3 text-sm font-medium text-heading">{brew.is_private? `Private` : `Public`}</span>
                                        </label>
                                    </div>
                                    <LeafBadge typeId={brew.leaf_type} leafList={leafType} onEdit={() => setShowLeafOption(true)}>
                                        {brew.leaf_type 
                                        ? leafType.find(l => l.id == brew.leaf_type)?.type 
                                        : `Select Leaf Type`}                                     
                                    </LeafBadge>
                                    {error && (<p className="text-red-500 lg:text-xs font-serif">{error.leaf_type}</p>)}
                                </div>
                                <div className="flex flex-col items-center gap-y-4 w-full">
                                    <ImageHandler
                                        onUpload={handleUploadImage}
                                        onRemove={handleImageRevoke}
                                        imagePreview={brew.imagePreview}
                                    />
                                    <input required type="text" className="text-center w-full text-4xl emphasis-text" placeholder="Brew Title" value={brew.title?? ''} onChange={e => setBrew({...brew, title : e.target.value})}/>
                                    <textarea className="w-full text-justify" maxLength={255} placeholder="description" id="" value={brew.description} onChange={e => setBrew({...brew, description : e.target.value})}></textarea>
                                </div>
                                <hr />
                                <div className="flex justify-center">
                                    <h1 className="font-bold complementary-emphasis text-2xl">Steeping Info</h1>
                               </div>
                                <div className="flex gap-x-2">
                                    <label htmlFor="fluid-oz">Fluid oz:</label>
                                    <input required type="number" className="flex flex-col" min={0} placeholder="8 (oz)" id="fluid-oz" value={brew.fluid_oz?? ''} onChange={e => setBrew({...brew, fluid_oz : e.target.valueAsNumber})}/>
                                </div>
                                {error && (<p className="text-red-500 lg:text-xs font-serif">{error.fluid_oz}</p>)}
                                <div className="flex items-start gap-x-2">
                                    <label htmlFor="sweetener">Sweetener:</label>
                                    <select name="" id="sweetener" value={brew.sweetener?? 'None'} onChange={e => setBrew({...brew, sweetener : e.target.value})}>
                                        <option value="None">None</option>
                                        <option value="Honey">Honey</option>
                                        <option value="Sugar">Sugar</option>
                                    </select>
                                </div>
                                {brew.sweetener !== 'None' && (
                                    <div className="flex items-start gap-x-2 ">
                                        <label htmlFor="tsp-sweetener">tsp:</label>
                                        <input type="number" className="flex flex-col"min={0} placeholder="1 tsp" id="tsp-sweetener" value={brew.tsp_sweetener?? ""} onChange={e => setBrew({...brew, tsp_sweetener: isNaN(e.target.valueAsNumber) ? null : e.target.valueAsNumber})}/>
                                    </div>
                                )}
                               <div className="flex items-center justify-start gap-2 flex-wrap">
                                    <label htmlFor="minute" className="whitespace-nowrap font-medium">Minute/s:</label>
                                    
                                    {/* Minutes Input */}
                                    <input 
                                        required 
                                        placeholder="mins" 
                                        type="number" 
                                        min={0} 
                                        step={1} 
                                        id="minute" 
                                        value={brew.minutes ?? ''} 
                                        onChange={e => setBrew({ ...brew, minutes: parseInt(e.target.value) })}
                                        className="w-20 p-1 rounded border border-gray-400 text-center" 
                                    />
                                    <label htmlFor="seconds" className="whitespace-nowrap font-medium">Second/s:</label>

                                    {/* Seconds Input */}
                                    <input 
                                        required 
                                        placeholder="secs" 
                                        type="number" 
                                        min={0} 
                                        step={1} 
                                        id="seconds" 
                                        value={brew.seconds ?? ''} 
                                        onChange={e => setBrew({ ...brew, seconds: parseInt(e.target.value) })}
                                        className="w-20 p-1 rounded border border-gray-400 text-center" 
                                    />
                                    
                                </div>
                                {error && (<p className="text-red-500 lg:text-xs font-serif">{error.steep_duration}</p>)}
                                <button className="mt-4 mx-auto cursor-pointer bg-gradient-to-b from-emerald-500 to-teal-800 hover:to-teal-700 text-white shadow-md hover:shadow-emerald-400/50 hover:scale-105 transition-all duration-200 border-2 border-green-950 px-8 py-3 rounded-xl font-bold tracking-wide">Save</button>
                            </div>
                            {showLeafOption && (
                                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm">
                                    <div className="bg-linear-45 from-indigo-100 to-red-100 rounded-2xl flex flex-col lg:max-w-xl w-[90%] justify-center h-fit p-8 gap-y-6 shadow-2xl border-2 border-red-900">
                                        <div className="flex flex-col gap-y-1">    
                                            <div className="flex justify-end">
                                                <button type="button" onClick={() => setShowLeafOption(false)} className="text-amber-900 hover:text-amber-700 font-bold px-2 cursor-pointer">✕</button>
                                            </div>
                                            <h1 className="emphasis-text text-4xl m-auto">Leaf Type</h1>
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-2 gap-y-2 items-center">
                                            {leafType.map((leaf) => (
                                                <div key={leaf.id} className={`${leafTypeColors[leaf.id]} rounded-full flex items-center gap-3 px-4 py-2`}>
                                                    <input type="radio" required name="leaf_selection" value={leaf.id} checked={brew.leaf_type == leaf.id} onChange={e => setBrew({...brew, leaf_type : e.target.value})} id={`leaf-${leaf.id}`} className="cursor-pointer"/> 
                                                    <label htmlFor={`leaf-${leaf.id}`}>{leaf.type}</label> 
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