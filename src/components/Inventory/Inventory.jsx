import MaterialRow from "./MaterialRow/MaterialRow";

const MaterialTable = ({
  currentMaterials,
  currentPage,
  setCurrentPage,
  totalPages,
}) => {
  return (
    <div>
      <h2>Inventory</h2>

      <table className="w-full">
        <thead>
          <tr className="text-left uppercase">
            <th className="pl-4"></th>
            <th>Name</th>
            <th>Qty</th>
            <th>Status</th>
            <th>Expires</th>
            <th>Location</th>
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
