import { formatSecondsToMMSS } from '../utils/formatting/formatSecondsToMMSS';
import {useState, useEffect, useCallback} from 'react'
import MainLayout from '../layouts/MainLayout'
import toast from 'react-hot-toast';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { leafTypeColors } from "../constants/LeafTypeColors";
import Pagination from "../components/Pagination";
import { visibilityColors } from "../constants/VisibilityColors";
import BrewModal from "../components/modals/BrewModal";
import BrewDeletionModal from "../components/BrewDeletionModal";
import EditBrewModal from "../components/modals/EditBrewModal";

export default function MyBrews(){
    const [isPrivate, setIsPrivate] = useState(false);
    const {token} = useContext(AuthContext);
    const [brewProfile, setBrewProfile] = useState([]);
    const [previewTea, setPreviewTea] = useState(null);
    const [teaToDelete, setTeaToDelete] = useState(null);
    const [teaToEdit, setTeaToEdit] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationMeta, setPaginationMeta] = useState({ current_page: 1, last_page: 1 });
    const [paginationLinks, setPaginationLinks] = useState({ first: null, last: null, prev: null, next: null });

    const fetchBrewProfiles = useCallback(async (page = 1, title="") => {
        try{
            
            let url = isPrivate
                ? `/api/brewprofile/owned?visibility=1&page=${page}&per_page=8`
                : `/api/brewprofile/owned?visibility=0&page=${page}&per_page=8`;
            
            if(title){
                url += `&title=${encodeURIComponent(title)}`;
            }
            
            const res = await fetch(url,{
                method : 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json',
                    Authorization : `Bearer ${token}`
                }
            })

            if (!res.ok){
                throw new Error("Failed to fetch brew profiles.");
            }

            const data = await res.json();
            const profileList = Array.isArray(data) 
                ? data 
                : (data.data && Array.isArray(data.data) ? data.data : []);


            setBrewProfile(profileList);
            setPaginationMeta({
                current_page: data?.meta?.current_page ?? page,
                last_page: data?.meta?.last_page ?? 1,
            });
            setPaginationLinks({
                first: data?.links?.first ?? null,
                last: data?.links?.last ?? null,
                prev: data?.links?.prev ?? null,
                next: data?.links?.next ?? null,
            });
        } catch(err){
            console.error(err);
            toast.error("Error fetching brew profiles.");
        }
    }, [token, isPrivate]);

    useEffect ( () => {
        fetchBrewProfiles(currentPage, appliedSearch);
    }, [fetchBrewProfiles, currentPage, appliedSearch, teaToEdit]);

    
    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        setAppliedSearch(searchQuery);
    }

    useEffect(() => {
        setCurrentPage(1);
    }, [isPrivate]);

   

    useEffect(() => {
            if (previewTea || teaToDelete || teaToEdit) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'unset';
            }

            return () => {
                document.body.style.overflow = 'unset';
            };
     }, [previewTea, teaToDelete, teaToEdit]);

    const handleDelete = async () => {
    
        const requestToast = toast.loading("Processing Request..."); 
        
        try{ 
            const res = await fetch(`/api/brewprofile/${teaToDelete.id}`, {
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
            
            toast.success("Brew profile delted successfully.", {id : requestToast});
            setTeaToDelete(null);
            fetchBrewProfiles(currentPage, appliedSearch);
        }catch(error){
            toast.error(error.message, {id : requestToast});
        }
    }

    return (
        <>
            <div className="my-brews-page-bg">
                <MainLayout>
                    <main className="flex flex-col items-center min-h-screen pt-8 pb-8 gap-y-4 w-full font-serif">
                        {/* <AppToaster /> */}
                        <h1 className="emphasis-text text-4xl lg:text-6xl font-bold text-yellow-300 mb-8 shadow-md">My Brew Profiles</h1>
                         <div className="flex flex-col items-center rounded-lg p-4 gap-y-4 w-[90%] bg-white/40">
                            <div className="w-full flex items-center justify-center">
                                <form onSubmit={handleSearch} className="flex gap-x-4 justify-center w-full">
                                    <select name="visibility" id="visibility" onChange={(e) => setIsPrivate(e.target.value === 'true')} className={`rounded-full p-2 font-bold ${isPrivate ? visibilityColors['Private'] : visibilityColors['Public']}`}>
                                        <option value="false">Public</option>
                                        <option value="true">Private</option>
                                    </select>
                                    <div className="flex lg:w-[90%] w-full justify-center gap-x-2">
                                        <input type="text" value={searchQuery?? ''} onChange={(e) => setSearchQuery(e.target.value)} className="flex grow w-full border-2 border-neutral-950 text-center rounded-full bg-linear-45 from-indigo-100 to-red-100 backdrop-blur-xl" placeholder="Search Brew Profile"/>
                                        <div className="relative flex flex-col items-center">
                                            <button className="z-1 lg:size-16 size-12 text-sm rounded-full bg-radial-[at_75%_25%] from-sky-100 via-cyan-300/70 to-purple-600 to-75% shadow-2x hover:ring-1 hover:ring-amber-300 hover:drop-shadow-xl hover:drop-shadow-cyan-200">
                                                Search
                                            </button>
                                            <div className="-mt-2 bg-amber-950 w-8 h-4 rounded-b-md shadow-lg z-0"></div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="flex flex-col w-full">
                                {brewProfile.length > 0 && (
                                    <form className="flex flex-col gap-y-4">
                                        {brewProfile.map((profile) => (
                                            <div key={profile.id} className="flex flex-col justify-center border-2 border-neutral-950 rounded-lg p-4 bg-linear-45 from-indigo-100
                                             to-red-100 backdrop-blur-md lg:hover:scale-105 hover:cursor-pointer">
                                                <div className="lg:grid lg:grid-cols-4 w-full gap-x-8 lg:gap-x-4 justify-center items-center">
                                                    {/* <div className="lg:justify-items-start grid grid-cols-1 w-full transition-all duration-500 ease-in-out hover:bg-gradient-to-b hover:from-amber-200 hover:to-amber-500 hover:bg-clip-text hover:text-transparent "> */}
                                                 <div className="lg:justify-items-start grid grid-cols-1 w-full">
                                                    <div className="bg-clip-text text-transparent
                                                    bg-[linear-gradient(to_right,theme(colors.black)_30%,theme(colors.amber.400/.8)_50%,theme(colors.black)_70%)]
                                                    bg-[length:300%_100%]
                                                    bg-left                                              
                                                    transition-[background-position] duration-[1500ms] ease-in-out
                                                    hover:bg-right" onClick={() => setPreviewTea(profile)}>
                                                        <p className="text-xl text-md font-bold mb-2">{profile.title}</p>
                                                        </div>
                                                        <p>By: {profile.user}</p>       
                                                    </div>
                                                    <div className="lg:grid  lg:grid-cols-1 lg:justify-items-center lg:align-items-center w-full">
                                                        <p className="text-center font-bold">Leaf Type</p>
                                                        <p className={`lg:w-[25%] text-center p-2 rounded-lg ${leafTypeColors[profile.leaf_type_id]}`}>{profile.leaf_type}</p>
                                                    </div>
                                                    <div className="grid grid-cols-1 justify-items-center align-items-center w-full">
                                                        <p className="text-center font-bold">Duration</p>
                                                        <p className="p-2 text-center">{formatSecondsToMMSS(profile.duration)}</p>
                                                    </div>
                                                    <div className="flex justify-center gap-x-4">
                                                        <button value={profile} type="button" onClick={() => setTeaToEdit(profile)}  className="border-2 border-blue-900 rounded-full p-2 bg-blue-500 cursor-pointer">Edit</button>
                                                        <button value={profile} type="button" onClick={() => setTeaToDelete(profile)}  className="border-2 border-red-900 rounded-full p-2  bg-red-500 cursor-pointer">Delete</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </form>
                                )}
                                {teaToDelete && (
                                    <BrewDeletionModal name={teaToDelete.title} onClose={() => setTeaToDelete(null)} onDelete={handleDelete}/> 
                                )}
                            </div>
                            <Pagination
                                totalPages={paginationMeta.last_page}
                                currentPage={paginationMeta.current_page}
                                onPageChange={setCurrentPage}
                                meta={paginationMeta}
                                links={paginationLinks}
                            />
                            {previewTea &&(
                                <BrewModal tea={previewTea} onClose={() => setPreviewTea(null)}/>
                            )}
                            {teaToEdit &&(<EditBrewModal previousData={teaToEdit} onClose={() => setTeaToEdit(null)} token={token}/> )}
                         </div>
                    </main>
                </MainLayout>
            </div>
        </>
    );
}