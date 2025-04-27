import { useContext } from "react";
import { createLazyFileRoute, Link } from "@tanstack/react-router";

import StatCard from "../components/StatCard/StatCard";
import LowStockPreview from "../components/LowStockPreview/LowStockPreview";
import ExpiringSoonPreview from "../components/ExpiringSoonPreview/ExpiringSoonPreview";
import { useMaterialStatus } from "../hooks/useMaterialStatus";
import { MaterialContext } from "../contexts";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const { materials } = useContext(MaterialContext);

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
    <div>
      <h2>Dashboard</h2>

      <div className="mx-4 mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Materials" value={materials.length} />
        <StatCard title="Low Stock" value={lowStockMaterials.length} />
        <StatCard title="Expiring Soon" value={expiringMaterials.length} />
        <StatCard title="Expired" value={expiredMaterials.length} />
      </div>

      <div className="mx-4 mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <LowStockPreview materials={lowStockMaterials.slice(0, 5)} />
        <ExpiringSoonPreview materials={expiringMaterials.slice(0, 5)} />
      </div>

      <div className="mx-4 mb-8 flex flex-wrap gap-4">
        <Link className="button" href="/materials/new">
          + Add Material
        </Link>
        {/* <Link className="button" href="/import">
          Import CSV
        </Link> */}
        <Link className="button" href="/materials">
          View Full Inventory
        </Link>
      </div>
    </div>
  );
}
