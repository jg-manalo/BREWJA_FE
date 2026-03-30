export default function Pagination({ totalPages, currentPage, onPageChange, meta, links }) {
  const isLaravelPagination = Boolean(meta?.current_page && meta?.last_page);
  const resolvedCurrentPage = isLaravelPagination ? meta.current_page : currentPage;
  const resolvedTotalPages = isLaravelPagination ? meta.last_page : totalPages;
  
  const getVisiblePages = () => {
    const maxVisible = 5;

    if (resolvedTotalPages <= maxVisible) {
      return Array.from({ length: resolvedTotalPages }, (_, i) => i + 1);
    }

    let startPage = Math.max(1, resolvedCurrentPage - Math.floor(maxVisible / 2));
    let endPage = startPage + maxVisible - 1;

    if (endPage > resolvedTotalPages) {
      endPage = resolvedTotalPages;
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const visiblePages = getVisiblePages();
  const canGoPrev = isLaravelPagination ? Boolean(links?.prev) : resolvedCurrentPage > 1;
  const canGoNext = isLaravelPagination ? Boolean(links?.next) : resolvedCurrentPage < resolvedTotalPages;

  if (resolvedTotalPages <= 1) return null;

  return (
    <div className="flex justify-center w-full items-center gap-4 mt-8">

      {isLaravelPagination && (
        <button
          onClick={() => onPageChange(1)}
          disabled={resolvedCurrentPage === 1}
          className={`px-4 py-2 rounded font-bold ${
            resolvedCurrentPage === 1
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-green-400 hover:bg-green-500 text-black'
          }`}
        >
          First
        </button>
      )}
      
      <button
        onClick={() => onPageChange(resolvedCurrentPage - 1)}
        disabled={!canGoPrev}
        className={`px-4 py-2 rounded font-bold ${
          !canGoPrev
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-green-400 hover:bg-green-500 text-black'
        }`}
      >
        Prev
      </button>

      <div className="flex gap-2">
        
        {visiblePages[0] > 1 && (
           <span className="text-white self-end mb-1">...</span>
        )}

        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded text-xl font-bold transition-colors ${
              resolvedCurrentPage === page
                ? 'bg-yellow-300 text-black scale-110' 
                : 'text-white hover:bg-gray-700'
            }`}
          >
            {page}
          </button>
        ))}

          {visiblePages[visiblePages.length - 1] < resolvedTotalPages && (
           <span className="text-white self-end mb-1">...</span>
        )}
      </div>

      <button
        onClick={() => onPageChange(resolvedCurrentPage + 1)}
        disabled={!canGoNext}
        className={`px-4 py-2 rounded font-bold ${
          !canGoNext
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
            : 'bg-green-400 hover:bg-green-500 text-black'
        }`}
      >
        Next
      </button>

      {isLaravelPagination && (
        <button
          onClick={() => onPageChange(resolvedTotalPages)}
          disabled={resolvedCurrentPage === resolvedTotalPages}
          className={`px-4 py-2 rounded font-bold ${
            resolvedCurrentPage === resolvedTotalPages
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-green-400 hover:bg-green-500 text-black'
          }`}
        >
          Last
        </button>
      )}

    </div>
  );
}