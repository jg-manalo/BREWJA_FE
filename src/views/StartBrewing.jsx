import AppToaster from "../components/AppToaster";
import {useState, useEffect, useCallback} from 'react'
import MainLayout from '../layouts/MainLayout'
import toast from 'react-hot-toast';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { leafTypeColors } from "../constants/LeafTypeColors";
import Pagination from "../components/Pagination";

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
            console.log(url);
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
            toast.error(err.messsage);
        }
    }, [token, isPrivate]);

    useEffect ( () => {
        fetchBrewProfiles("");
    }, [fetchBrewProfiles]);

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
    return (
        <>
            <div className="create-brews-page-bg">
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
                         <div className="flex flex-col items-center rounded-lg p-4 gap-y-4 w-[90%] bg-linear-45 from-indigo-100 to-red-100">
                            <div className="w-full flex items-center justify-center">
                                <form onSubmit={handleSearch} className="flex gap-x-4 justify-center w-full">
                                    <select name="visibility" id="visibility" onChange={(e) => setIsPrivate(e.target.value === 'true')}>
                                        <option value="false">Public</option>
                                        <option value="true">Private</option>
                                    </select>
                                    <div className="flex w-[50%] justify-center gap-x-2">
                                        <input type="text" value={searchQuery?? ''} onChange={(e) => setSearchQuery(e.target.value)} className="w-full border-2 border-neutral-950 text-center rounded-full" placeholder="Brew Profile"/>
                                        <button>Search</button>
                                    </div>
                                </form>
                            </div>
                            <div className="overflow-x-auto w-full">
                                <table className="w-full text-justify">
                                    <thead>
                                        <tr align="center">
                                            <th>Title</th>
                                            <th>Creator</th>
                                            <th>Type</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-justify">
                                        {currentData.length > 0 && (
                                            currentData.map((tea) => (
                                                <tr align="justify" className="gap-x-4" key={tea.id}>
                                                    <td className="text-center px-4">{tea.title}</td>
                                                    <td align="center" className="px-4">{tea.user}</td>
                                                    <td align="center" className={`rounded-lg w-[10%] px-4 ${leafTypeColors[tea.leaf_type_id]}`}>{tea.leaf_type}</td>
                                                    <td align="center">
                                                        <form action="">
                                                            <button value={tea.title} className="cursor-pointer bg-gradient-to-b from-emerald-500 to-teal-800 hover:to-teal-700 text-white shadow-md hover:shadow-emerald-400/50 lg:hover:scale-105 transition-all duration-200 border-1 p-2 lg:border-2 border-green-950 lg:px-8 lg:py-3 rounded-full" onClick={handleBrew}>Brew</button>
                                                        </form>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage}/>
                         </div>
                    </main>
                </MainLayout>
            </div>
        </>
    );
}