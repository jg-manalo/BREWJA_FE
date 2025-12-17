import AppToaster from "../components/AppToaster";
import {useState, useEffect, useCallback} from 'react'
import MainLayout from '../layouts/MainLayout'
import toast from 'react-hot-toast';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { leafTypeColors } from "../constants/LeafTypeColors";
import Pagination from "../components/Pagination";
import { visibilityColors } from "../constants/VisibilityColors";
export default function StartBrewing(){
    const [isPrivate, setIsPrivate] = useState(false);
    const {token} = useContext(AuthContext);
    const [brewProfile, setBrewProfile] = useState([]);
    const [iotStatus, setIOTStatus] = useState({
        connectivity : 'OFFLINE',
        current_handle : null
    });
    const [searchQuery, setSearchQuery] = useState("");        
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const totalPages = Math.ceil(brewProfile.length/ itemsPerPage);
    const currentData = brewProfile.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


    const fetchBrewProfiles = useCallback(async (query= "") => {
        try{
            let url = isPrivate? '/api/brewprofile/owned-private' : '/api/brewprofile'
            
            if(query){
                url += `?title=${encodeURIComponent(query)}`
            }

            // console.log("Fetching URL:", url);
            const headers = (isPrivate && token) ? { Authorization: `Bearer ${token}` } 
                : undefined;
            const res = await fetch(url, {
                method : 'GET',
                headers: headers
            });

            if (!res.ok){
                throw new Error("Failed to fetch brew profiles.");
            }

            const data = await res.json();
            const profileList = Array.isArray(data) 
                ? data 
                : (data.data && Array.isArray(data.data) ? data.data : []);


            setBrewProfile(profileList);
        } catch(err){
            console.error(err);
            toast.error("Error fetching brew profiles.");
        }
    }, [token, isPrivate]);

    useEffect ( () => {
        fetchBrewProfiles("");
    }, [fetchBrewProfiles]);

    useEffect(() => {
        if(currentPage > 0 && isPrivate){
            setCurrentPage(1);
        }
    }, [isPrivate, currentPage]);

    // useEffect ( () => {
    //     const fetchIoTData = async () => {

    //     }
    // }, [iotStatus]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchBrewProfiles(searchQuery);
    }

    const handleBrew = (e) => {
       e.preventDefault();
       setIOTStatus({...iotStatus, current_handle : e.target.value, connectivity : 'BUSY'});
    }

    const formatSecondsToMMSS = (totalSeconds) => {
        if (totalSeconds == null || Number.isNaN(Number(totalSeconds))) return '—';
        const secs = Math.max(0, Math.floor(Number(totalSeconds)));
        const minutes = Math.floor(secs / 60);
        const seconds = secs % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    return (
        <>
            <div className="update-profile-bg">
                <MainLayout>
                    <main className="flex flex-col items-center min-h-screen pt-8 pb-8 gap-y-4 w-full font-serif">
                        <AppToaster />
                         <div className="flex flex-col rounded-lg p-4 items-center justify-center w-[50%] bg-linear-45 from-indigo-100 to-red-100">
                            <h1>IOT Device</h1>
                            <div className="flex flex-col gap-x-2 justify-evenly items-center">
                                <h1>Status: {iotStatus.connectivity}</h1>
                                {iotStatus.current_handle && (
                                    <h1>Currently Handling: {iotStatus.current_handle}</h1>
                                )}
                            </div>
                         </div>
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
                                {currentData.length > 0 && (
                                    <form className="flex flex-col gap-y-4">
                                        {currentData.map((profile) => (
                                            <div key={profile.id} className="flex flex-col justify-center border-2 border-neutral-950 rounded-lg p-4 bg-linear-45 from-indigo-100
                                             to-red-100 backdrop-blur-md lg:hover:scale-105 hover:cursor-pointer">
                                                <div className="lg:grid lg:grid-cols-4 w-full gap-x-8 lg:gap-x-4 justify-center items-center">
                                                    <div className="lg:justify-items-start grid grid-cols-1 w-full">
                                                        <p className="text-xl text-md font-bold mb-2">{profile.title}</p>
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
                                                    <div className="flex justify-center">
                                                        <button value={profile.title} onClick={handleBrew} className="border-2 border-green-900 rounded-full w-12 h-12 bg-green-500 cursor-pointer">&#9654;</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </form>
                                )}
                            </div>
                            <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage}/>
                         </div>
                    </main>
                </MainLayout>
            </div>
        </>
    );
}