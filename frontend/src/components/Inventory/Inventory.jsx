import MaterialRow from "./MaterialRow/MaterialRow";

const MaterialTable = ({
  currentMaterials,
  currentPage,
  setCurrentPage,
  totalPages,
  sortConfig,
  onSort,
}) => {
  const SortableHeader = ({ columnKey, children, className = "" }) => (
    <th
      className={`cursor-pointer transition-colors hover:bg-gray-100 ${className}`}
      onClick={() => onSort(columnKey)}
    >
      <div className="flex items-center gap-2">
        {children}
        <span className="inline-flex items-center">
          {sortConfig.key === columnKey ? (
            sortConfig.direction === "asc" ? (
              <svg
                className="h-4 w-4 text-gray-700"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M7 10l5-5 5 5H7z" />
              </svg>
            ) : (
              <svg
                className="h-4 w-4 text-gray-700"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M7 10l5 5 5-5H7z" />
              </svg>
            )
          ) : (
            <svg
              className="h-4 w-4 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M7 7l5-5 5 5M7 13l5 5 5-5"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          )}
        </span>
      </div>
    </th>
  );

  return (
    <div>
      <h2>Inventory</h2>

      <table className="w-full">
        <thead>
          <tr className="text-left uppercase">
            <th className="pl-4"></th>
            <SortableHeader columnKey="name">Name</SortableHeader>
            <SortableHeader columnKey="quantity">Qty</SortableHeader>
            <th>Status</th>
            <SortableHeader columnKey="expiryDate">Expires</SortableHeader>
            <SortableHeader columnKey="location">Location</SortableHeader>
          </tr>
        </thead>
        <tbody>
          {currentMaterials.map((material) => (
            <MaterialRow key={material.id} material={material} />
          ))}
        </tbody>
      </table>
      <div className="my-4 flex items-center justify-center gap-4">
        <button
          className="disabled:bg-white disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          className="disabled:bg-white disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MaterialTable;
