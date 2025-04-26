import { Link } from "@tanstack/react-router";

const ExpiringSoonPreview = ({ materials }) => {
  return (
    <div className="border border-black p-4 font-mono">
      <h2 className="mb-4 text-base uppercase">Expiring Soon Preview</h2>
      <ul className="space-y-2">
        {materials.map((material) => (
          <li key={material.id}>
            <Link
              href={`/materials/$materialId`}
              params={{ materialId: material.id }}
              className="underline"
            >
              {material.name} (Expires: {material.expiryDate})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpiringSoonPreview;
