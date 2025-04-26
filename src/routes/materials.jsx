import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet, useMatches } from "@tanstack/react-router";

import getMaterials from "../api/getMaterials";

import MaterialRow from "../components/MaterialRow/MaterialRow";

export const Route = createFileRoute("/materials")({
  component: MaterialsRoute,
});

function MaterialsRoute() {
  const matches = useMatches();
  const isExactMaterialsRoute = matches.length === 2;

  const [page, setPage] = useState(1);
  const { data: materialsResponse, isLoading } = useQuery({
    queryKey: ["materials", page],
    queryFn: () => getMaterials(page),
    staleTime: 30000,
    enabled: isExactMaterialsRoute,
  });

  if (!isExactMaterialsRoute) {
    return <Outlet />;
  }

  if (isLoading) {
    return <div className="mx-4 my-8">Loading...</div>;
  }

  const materials = materialsResponse.data;

  return (
    <div>
      <h2 className="mx-4 mb-8">Inventory</h2>

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
          {materials.map((material) => (
            <MaterialRow key={material.id} material={material} />
          ))}
        </tbody>
      </table>
      <div className="my-4 flex items-center justify-center gap-4">
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
          disabled={!materialsResponse.prev}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
          disabled={!materialsResponse.next}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
