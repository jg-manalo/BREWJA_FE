export default function Pagination({ totalPages, currentPage, onPageChange }) {
  
  // 1. Helper function to calculate which page numbers to show
  const getVisiblePages = () => {
    const maxVisible = 5; // Limit to 5 page buttons

    // If total pages are less than the max, just show all of them
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = startPage + maxVisible - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center w-full items-center gap-4 mt-8">
      
      {/* --- PREV BUTTON --- */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded font-bold ${
          currentPage === 1 
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-green-400 hover:bg-green-500 text-black'
        }`}
      >
        Prev
      </button>

      {/* --- PAGE NUMBERS (Dynamic Window) --- */}
      <div className="flex gap-2">
        
        {/* Optional: Show "1..." if we are far ahead */}
        {visiblePages[0] > 1 && (
           <span className="text-white self-end mb-1">...</span>
        )}

        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded text-xl font-bold transition-colors ${
              currentPage === page
                ? 'bg-yellow-300 text-black scale-110' 
                : 'text-white hover:bg-gray-700'
            }`}
          >
            {page}
          </button>
        ))}

        {/* Optional: Show "...50" if we are not at the end */}
        {visiblePages[visiblePages.length - 1] < totalPages && (
           <span className="text-white self-end mb-1">...</span>
        )}
      </div>

      {/* --- NEXT BUTTON --- */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 rounded font-bold ${
          currentPage === totalPages
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
            : 'bg-green-400 hover:bg-green-500 text-black'
        }`}
      >
        Next
      </button>

    </div>
  );
}