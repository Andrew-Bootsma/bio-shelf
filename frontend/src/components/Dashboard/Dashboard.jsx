import { Link } from "@tanstack/react-router";

import StatCard from "./StatCard/StatCard";
import LowStockPreview from "./LowStockPreview/LowStockPreview";
import ExpiringSoonPreview from "./ExpiringSoonPreview/ExpiringSoonPreview";

const Dashboard = ({
  materials,
  lowStockMaterials,
  expiringMaterials,
  expiredMaterials,
}) => {
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
        <Link className="button" to="/materials/new">
          + Add Material
        </Link>
        <Link className="button" to="/import">
          Import CSV
        </Link>
        <Link className="button" to="/materials">
          View Full Inventory
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
