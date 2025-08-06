import { use, useState } from "react";
import {
  createLazyFileRoute,
  Outlet,
  useMatches,
} from "@tanstack/react-router";

import { MaterialsContext } from "../contexts";

import Inventory from "../components/Inventory/Inventory";

export const Route = createLazyFileRoute("/materials")({
  component: MaterialsRoute,
});

function MaterialsRoute() {
  const matches = useMatches();
  const isExactMaterialsRoute = matches.length === 2;

  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const itemsPerPage = 10;

  const { materials } = use(MaterialsContext);

  if (!isExactMaterialsRoute) {
    return <Outlet />;
  }

  if (!materials.length) {
    return <div className="mx-4 my-8">Loading...</div>;
  }

  // Create a reversed copy by default (most recent first)
  let sortedMaterials = [...materials].reverse();

  // Apply sorting if user has clicked a column
  if (sortConfig.key) {
    sortedMaterials.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Compare values
      let comparison = 0;
      if (typeof aValue === "string") {
        comparison = aValue.localeCompare(bValue);
      } else {
        comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMaterials = sortedMaterials.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(sortedMaterials.length / itemsPerPage);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page when sorting
  };

  return (
    <Inventory
      currentMaterials={currentMaterials}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      totalPages={totalPages}
      sortConfig={sortConfig}
      onSort={handleSort}
    />
  );
}
