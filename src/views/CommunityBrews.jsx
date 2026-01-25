import MainLayout from '../layouts/MainLayout';
import Card from '../components/Card';
import { useState, useEffect } from 'react';
import Pagination from '../components/Pagination';
import BrewModal from "../components/modals/BrewModal";
export default function CommunityBrews() {
  const [teas, setTeas] = useState([]);
  const [previewTea, setPreviewTea] = useState(null);
  
  useEffect(() => { 
      const fetchBrewProfiles = async () => {
          try{
              const response = await fetch('/api/brewprofile/');
              const data = await response.json();
              setTeas(Array.isArray(data.data) ? data.data : [data]);
          } catch (error){
              console.error('Error fetching brew profiles:', error);      
          }
      };
      fetchBrewProfiles();
  }, []);
  

  useEffect(() => {
            if (previewTea) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'unset';
            }

            return () => {
                document.body.style.overflow = 'unset';
            };
  }, [previewTea]);


  const handlePreviewTea = (tea) => {
      setPreviewTea(tea);
  }
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(teas.length/ itemsPerPage);
  const currentData = teas.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
 
 
  return (
    <div className={`update-profile-bg bg-gray-900/60 ${previewTea ? 'overflow-hidden h-screen' : ''} `}>
      <MainLayout>
        <div className="min-h-screen w-full py-8">
          <h1 className="text-4xl font-bold text-yellow-300 text-center mb-8 shadow-md">
            Community Brew Profiles
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-2 items-stretch">
            {currentData.length > 0 ? (
              currentData.map((tea) => (
                <Card
                  key={tea.id}
                  tea={tea}
                  onViewDetails={() => handlePreviewTea(tea)}
                  className="bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-transform duration-200"
                />
              ))
            ) : (
              <p className="text-gray-400 text-center col-span-full">Loading teas...</p>
            )}
          </div>
          <div className="flex justify-center items-center w-full mt-6">
            <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage}/>
          </div>
        </div>
      </MainLayout>
      {previewTea &&(
        <BrewModal tea={previewTea} onClose={() => setPreviewTea(null)}/>
      )}
    </div>
  );
}
