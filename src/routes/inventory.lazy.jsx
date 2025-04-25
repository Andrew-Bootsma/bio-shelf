import { createLazyFileRoute } from "@tanstack/react-router";

import MaterialRow from "../components/MaterialRow/MaterialRow";

import { useMaterials } from "../hooks/useMaterials";

export const Route = createLazyFileRoute("/inventory")({
  component: Inventory,
});

function Inventory() {
  const materials = useMaterials();

  if (!materials) {
    return <div className="mx-4 my-8">Loading...</div>;
  }

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
            <MaterialRow key={material.id} {...material} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
