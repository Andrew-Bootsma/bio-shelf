import { useContext } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";

import { useMaterialStatus } from "../hooks/useMaterialStatus";
import { MaterialsContext } from "../contexts";

import Dashboard from "../components/Dashboard/Dashboard";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const { materials } = useContext(MaterialsContext);

  const lowStockMaterials = materials.filter(
    (m) => useMaterialStatus(m) === "LOW",
  );

  const expiredMaterials = materials.filter(
    (m) => useMaterialStatus(m) === "EXPIRED",
  );

  const expiringMaterials = materials.filter((m) => {
    if (!m.expiryDate) return false;
    const today = new Date();
    const expiry = new Date(m.expiryDate);
    const daysUntilExpiry =
      (expiry.getTime() - today.getTime()) / (1000 * 3600 * 24);
    return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
  });

  return (
    <Dashboard
      materials={materials}
      lowStockMaterials={lowStockMaterials}
      expiringMaterials={expiringMaterials}
      expiredMaterials={expiredMaterials}
    />
  );
}
