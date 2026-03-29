import {leafTypeColors} from "../constants/LeafTypeColors"

export default function LeafBadge ({typeId, leafList, onEdit}) {
   const activeColor = leafTypeColors[typeId] || 'hover:underline text-gray-900';
   const label = typeId ? leafList.find(l => l.id == typeId)?.type : 'Select Leaf Type';
    return (
        <button
            type="button" 
            onClick={onEdit}
            className={`cursor-pointer px-3 py-1 rounded-lg font-serif font-medium text-sm shafont-medium transition-colors ${activeColor}`}
        >
            {label}
        </button>
    );
} 