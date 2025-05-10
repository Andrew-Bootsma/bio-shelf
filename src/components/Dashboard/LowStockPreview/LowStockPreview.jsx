import { Link } from "@tanstack/react-router";

const LowStockPreview = ({ materials }) => {
  return (
    <div className="border border-black p-4 font-mono">
      <h2>Low Stock Preview</h2>
      <ul className="space-y-2">
        {materials.map((material) => (
          <li key={material.id}>
            <Link
              to={`/materials/$materialId`}
              params={{ materialId: material.id }}
              className="underline"
            >
              {material.name} ({material.quantity} {material.unit})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LowStockPreview;
