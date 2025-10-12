import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';

function formatSecondsToMMSS(totalSeconds) {
  if (totalSeconds == null || Number.isNaN(Number(totalSeconds))) return '—';
  const secs = Math.max(0, Math.floor(Number(totalSeconds)));
  const minutes = Math.floor(secs / 60);
  const seconds = secs % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export default function TeaDetails() {
  const { id } = useParams();
  const [teas, setTeas] = useState([]);
  useEffect(() => {
    const fetchBrewProfiles = async () => {
      try {
        await fetch(`/api/brewprofile/${id}`)
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
  }, [id]);

  const tea = teas[0]; // show first (or only) profile

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto p-6">
        {!tea ? (
          <div className="bg-white p-6 rounded shadow-md">
            <h1 className="text-2xl font-semibold mb-2">Tea Details</h1>
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden md:flex">
            {/* Image */}
            {tea.imageUrl && (
              <div className="md:w-1/3">
                <img
                  src={tea.imageUrl}
                  alt={tea.name || 'Tea image'}
                  className="w-full h-48 object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-6 md:flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{tea.title || `Tea #${id}`}</h2>
                  <p className="text-sm text-gray-500">{tea.user || 'Unknown origin'}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-green-100 text-green-800 text-sm px-2 py-1 rounded">
                    {tea.leaf_type}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-gray-700">{tea.description || 'No description available.'}</p>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Steep time</p>
                  <p className="text-lg font-medium">
                    {formatSecondsToMMSS(tea.steep_duration)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Sweetener</p>
                  <p className="text-lg font-medium">
                    {tea.sweetener !== "None" ? tea.sweetener : '—'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Sweetener Quantity</p>
                  <p className="text-lg font-medium">{tea.tsp_sweetener ? tea.tsp_sweetener + " tsp": "—" }</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Volume</p>
                  <p className="text-lg font-medium">8 oz</p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Start Timer
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
                  Edit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}