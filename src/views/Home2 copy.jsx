import MainLayout from '../layouts/MainLayout';
import Card from '../components/Card';
import { useState, useEffect } from 'react';

export default function Home() {
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
    <MainLayout>
     <div className="w-full py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-2 items-stretch">
        {teas.length > 0 ? (
          teas.map((tea) => <Card key={tea.id} tea={tea} />)
        ) : (
          <p className="text-gray-500 text-center col-span-full">Loading teas...</p>
        )}
      </div>
    </div>

    </MainLayout>
  );
}
