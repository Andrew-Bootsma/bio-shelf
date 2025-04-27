import { useContext, useState } from "react";
import { createFileRoute, Outlet, useMatches } from "@tanstack/react-router";

import { MaterialsContext } from "../contexts";

import MaterialRow from "../components/MaterialRow/MaterialRow";

export const Route = createFileRoute("/materials")({
  component: MaterialsRoute,
});

function MaterialsRoute() {
  const matches = useMatches();
  const isExactMaterialsRoute = matches.length === 2;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { materials } = useContext(MaterialsContext);

  if (!isExactMaterialsRoute) {
    return <Outlet />;
  }

  if (!materials.length) {
    return <div className="mx-4 my-8">Loading...</div>;
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMaterials = materials.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(materials.length / itemsPerPage);

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
}
