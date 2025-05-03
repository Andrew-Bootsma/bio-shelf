import { useContext, useState } from "react";
import { createLazyFileRoute, Outlet, useMatches } from "@tanstack/react-router";

import { MaterialsContext } from "../contexts";

import Inventory from "../components/Inventory/Inventory";

export const Route = createLazyFileRoute("/materials")({
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
    <Inventory
      currentMaterials={currentMaterials}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      totalPages={totalPages}
    />
  );
}
