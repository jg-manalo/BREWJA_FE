import MainLayout from '../layouts/MainLayout';
import Card from '../components/Card';
import { useState, useEffect } from 'react';
import Pagination from '../components/Pagination';
import BrewModal from "../components/modals/BrewModal";
export default function CommunityBrews() {
  const [teas, setTeas] = useState([]);
  const [previewTea, setPreviewTea] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState({ current_page: 1, last_page: 1 });
  const [paginationLinks, setPaginationLinks] = useState({ first: null, last: null, prev: null, next: null });
  
  useEffect(() => {
      const fetchBrewProfiles = async () => {
          try{
              const response = await fetch(`/api/brewprofile/?page=${currentPage}`);
              const data = await response.json();

              const profileList = Array.isArray(data?.data)
                ? data.data
                : Array.isArray(data)
                ? data
                : [];

              setTeas(profileList);
              setPaginationMeta({
                current_page: data?.meta?.current_page ?? currentPage,
                last_page: data?.meta?.last_page ?? 1,
              });
              setPaginationLinks({
                first: data?.links?.first ?? null,
                last: data?.links?.last ?? null,
                prev: data?.links?.prev ?? null,
                next: data?.links?.next ?? null,
              });
          } catch (error){
              console.error('Error fetching brew profiles:', error);      
          }
      };
      fetchBrewProfiles();
  }, [currentPage]);
  

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
 
 
  return (
    <div className={`update-profile-bg bg-gray-900/60 ${previewTea ? 'overflow-hidden h-screen' : ''} `}>
      <MainLayout>
        <div className="min-h-screen w-full py-8">
          <h1 className="text-4xl font-bold text-yellow-300 text-center mb-8 shadow-md">
            Community Brew Profiles
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-2 items-stretch">
            {teas.length > 0 ? (
              teas.map((tea) => (
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
            <Pagination
              totalPages={paginationMeta.last_page}
              currentPage={paginationMeta.current_page}
              onPageChange={setCurrentPage}
              meta={paginationMeta}
              links={paginationLinks}
            />
          </div>
        </div>
      </MainLayout>
      {previewTea &&(
        <BrewModal tea={previewTea} onClose={() => setPreviewTea(null)}/>
      )}
    </div>
  );
}
