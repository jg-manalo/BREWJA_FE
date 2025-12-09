import MainLayout from '../layouts/MainLayout';
import Card from '../components/Card';
import { useState, useEffect } from 'react';

export default function CommunityBrews() {
  const [teas, setTeas] = useState([]);

  useEffect(() => {
    const fetchBrewProfiles = async () => {
      try {
        await fetch('/api/brewprofile/')
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            setTeas(Array.isArray(data.data) ? data.data : [data]);
          });

      } catch (error) {
        console.error('Error fetching brew profiles:', error);
      }
    };

    fetchBrewProfiles();
  }, []);

  return (
    <div className='update-profile-bg bg-gray-900/60'>
      <MainLayout>
        <div className="min-h-screen  py-8">
          <h1 className="text-4xl font-bold text-yellow-300 text-center mb-8 shadow-md">
            Community Brew Profiles
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-2 items-stretch">
            {teas.length > 0 ? (
              teas.map((tea) => (
                <Card
                  key={tea.id}
                  tea={tea}
                  className="bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-transform duration-200"
                />
              ))
            ) : (
              <p className="text-gray-400 text-center col-span-full">Loading teas...</p>
            )}
          </div>
        </div>
      </MainLayout>
    </div>
  );
}
