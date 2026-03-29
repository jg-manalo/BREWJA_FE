import { Link } from 'react-router-dom';
import defaultImage from '../assets/tea.png';

export default function Card({ tea, onViewDetails }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      <img
        src={tea.image ?? defaultImage}
        alt="Tea"
        className="w-full h-44 object-cover"
      />
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-xl font-semibold mb-2">{tea.title}</h2>
        <h3 className="text-l font-semibold mb-2">By: {tea.user}</h3>
        <p className="text-gray-600 flex-grow">
          {tea.description?.length > 100
            ? `${tea.description.slice(0, 120)}...`
            : tea.description}
        </p>

        <button
          onClick={onViewDetails}
          className="mt-4 cursor-pointer bg-green-600 text-white px-4 py-2 rounded self-start hover:bg-green-700 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
