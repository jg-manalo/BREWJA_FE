import {useState, useEffect} from 'react'
import toast from 'react-hot-toast';
import LeafBadge from "../LeafBadgeButton";
import ImageHandler from  "../images/ImageHandler";
import { leafTypeColors } from "../../constants/LeafTypeColors";
import { visibilityColors } from "../../constants/VisibilityColors";
import { apiPromise } from '../../utils/api/apiPromise';


export default function EditBrewModal({previousData, onClose, token}){
    const [showLeafOption, setShowLeafOption] = useState(false);
    const [leafType, setLeafType] = useState([]);
    const [error, setError] = useState("");
   
    const [brew ,setBrew] = useState({
        title : previousData?.title || '',
        description : previousData?.description || '',
        leaf_type: previousData?.leaf_type_id || null,
        minutes: Math.floor(previousData?.duration / 60) || null,
        seconds: previousData.duration != null ? previousData.duration % 60 : null,
        sweetener: previousData?.sweetener || null,
        tsp_sweetener : previousData?.tsp_sweetener || null,
        fluid_oz : previousData?.fluid_oz || null,
        is_private : previousData?.is_private || false,
    });

    const [brewImage, setBrewImage] = useState({
        image : previousData?.image || null,
        imagePreview : previousData?.image || null,
    });
 
    useEffect ( () => {
        const fetchLeafType = async () => {
            try {
                const data = await apiPromise('/api/leaf-type/', {
                    requestMethod: 'GET',
                    token: token
                });
                setLeafType(data);
                setError("");
            } catch (err) {
                toast.error(err);
            }
        };
        fetchLeafType();
    }, [token])

    const handleSubmitBrew = async (e) => {
        e.preventDefault();

        await toast.promise(apiPromise(`/api/brewprofile/${previousData.id}`, {
            requestMethod : 'PUT',
            token : token,
            objectBody : brew
        }), {
            loading: 'Processing Request...',
            success: (data) => {
                onClose(); 
                return data.message; 
            },
            error: (err) => {
                setError(err); 
                console.log(err);
                return "Error creating brew profile.";
            },
        });
    };

    const handleUploadImage = async (e) => {
        const file = e.target.files[0];

        if(!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size exceeds 5MB limit.");
            throw new Error("File size exceeds 5MB limit.");
        }

        const objectUrl = URL.createObjectURL(file);

        
        const formData = new FormData();
        formData.append('image', file);
       
        setBrewImage({...brewImage, imagePreview : objectUrl, image : null});
        
        try{
            const data = await apiPromise(`/api/brewprofile/${previousData.id}/upload-image/`, {
                requestMethod: 'POST',
                contentType: 'multipart/form-data',
                token: token,
                objectBody: formData,
            });

            if(data.error){
                URL.revokeObjectURL(brewImage.imagePreview);
                toast.error("Image upload failed.");
                throw data.error;
            }
            setBrewImage({...brewImage, imagePreview : objectUrl, image : data.image});
        }catch(err){
            toast.error(err?.message || "Image upload failed.");
            console.log(err);
            return;
        }
    }

    const handleImageRevoke = async () => {
        const previousImageState = { ...brewImage };

        setBrewImage({ ...brewImage, image: null, imagePreview: null });

        try {
            const data = await apiPromise(`/api/brewprofile/${previousData.id}/remove-image/`, {
                requestMethod: 'DELETE',
                token: token,
            });

            if (data.error) {
                throw data.error;
            }

            // if (previousImageState.imagePreview && previousImageState.imagePreview.startsWith('blob:')) {
            //     URL.revokeObjectURL(previousImageState.imagePreview);
            // }

        } catch (err) {
            setBrewImage(previousImageState);
            
            toast.error("Image removal failed.");
            console.log(err);
        }
    }


   return (
        <>
            <main className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-serif">
                <button 
                    onClick={onClose}
                    className='absolute top-4 right-4 text-stone-50 hover:scale-110 cursor-pointer font-bold z-10 bg-white/20 hover:bg-white/40 rounded-full w-10 h-10 flex items-center justify-center backdrop-blur-md transition-all' 
                >
                    ✕
                </button>

                <form onSubmit={handleSubmitBrew} className='flex flex-col w-full max-w-lg lg:max-w-2xl max-h-[90vh] shadow-2xl rounded-xl overflow-hidden relative'>
                    
                    <div className="flex flex-col p-6 gap-y-4 bg-linear-45 from-indigo-100 to-red-100 overflow-y-auto custom-scrollbar">
                        
                        <div className="flex flex-row items-start justify-between">
                            <div className="flex flex-grow gap-2">
                                <select name="visibility" id="visibility" value={brew.is_private} onChange={e => setBrew({...brew, is_private : e.target.value === 'true' ? true : false})} className={`${brew.is_private? visibilityColors['Private'] : visibilityColors['Public']} px-3 py-1 rounded-md text-sm font-medium border border-black/5`}>
                                    <option value="false">Public</option>
                                    <option value="true">Private</option>
                                </select>
                            </div>
                            <div className='flex justify-end'>
                                <LeafBadge typeId={brew.leaf_type} leafList={leafType} onEdit={() => setShowLeafOption(true)}>
                                    {brew.leaf_type ? leafType.find(l => l.id == brew.leaf_type)?.type : `Select Leaf Type`}                                     
                                </LeafBadge>
                            </div>
                        </div>
                        {error && (<p className="text-red-500 lg:text-xs font-serif">{error.leaf_type}</p>)}

                        <div className="flex flex-col items-center gap-y-4 w-full">
                            <ImageHandler 
                                onUpload={handleUploadImage} 
                                onRemove={handleImageRevoke} 
                                imagePreview={brewImage?.imagePreview} 
                            />
                            <input required type="text" className="text-center w-full text-3xl lg:text-4xl emphasis-text bg-transparent border-b border-transparent hover:border-stone-300 focus:border-stone-500 focus:outline-none transition-colors" placeholder="Brew Title" value={brew.title?? ''} onChange={e => setBrew({...brew, title : e.target.value})}/>
                            
                            <textarea className="w-full text-justify bg-white/50 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200" rows={3} maxLength={255} placeholder="Describe your brew..." id="" value={brew.description} onChange={e => setBrew({...brew, description : e.target.value})}></textarea>
                        </div>

                        <hr className="border-stone-300/50 my-2" />

                        <div className="flex justify-center">
                            <h1 className="font-bold complementary-emphasis text-xl text-stone-700">Steeping Info</h1>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label htmlFor="fluid-oz" className="text-sm font-semibold text-stone-600">Fluid oz:</label>
                                <input required type="number" className="p-2 rounded bg-white/60 border border-stone-200" min={0} placeholder="8" id="fluid-oz" value={brew.fluid_oz?? ''} onChange={e => setBrew({...brew, fluid_oz : e.target.valueAsNumber})}/>
                                {error && (<p className="text-red-500 text-xs">{error.fluid_oz}</p>)}
                            </div>

                            <div className="flex flex-col gap-1">
                                <label htmlFor="sweetener" className="text-sm font-semibold text-stone-600">Sweetener:</label>
                                <select className="p-2 rounded bg-white/60 border border-stone-200" id="sweetener" value={brew.sweetener?? 'None'} onChange={e => setBrew({...brew, sweetener : e.target.value})}>
                                    <option value="None">None</option>
                                    <option value="Honey">Honey</option>
                                    <option value="Sugar">Sugar</option>
                                </select>
                            </div>

                            {brew.sweetener !== 'None' && (
                                <div className="flex flex-col gap-1 sm:col-span-2">
                                    <label htmlFor="tsp-sweetener" className="text-sm font-semibold text-stone-600">Amount (tsp):</label>
                                    <input type="number" className="p-2 rounded bg-white/60 border border-stone-200 w-full" min={0} placeholder="1" id="tsp-sweetener" value={brew.tsp_sweetener?? ""} onChange={e => setBrew({...brew, tsp_sweetener: isNaN(e.target.valueAsNumber) ? null : e.target.valueAsNumber})}/>
                                </div>
                            )}
                        </div>

                          <div className="flex items-center justify-start gap-2 flex-wrap">
                                <label htmlFor="minute" className="whitespace-nowrap font-semibold text-sm text-stone-600">Minute/s:</label>
                                
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
                                <label htmlFor="seconds" className="whitespace-nowrap font-semibold text-sm text-stone-600">Second/s:</label>

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

                        <button className="mt-6 w-full cursor-pointer bg-gradient-to-b from-emerald-500 to-teal-800 hover:to-teal-700 text-white shadow-md hover:shadow-emerald-400/50 active:scale-95 transition-all duration-200 border-2 border-green-950/20 px-8 py-3 rounded-xl font-bold tracking-wide uppercase text-sm">
                            Save Brew Profile
                        </button>
                    </div>

                    {/* Leaf Type Modal (Nested Overlay) */}
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
        </>
    );
}