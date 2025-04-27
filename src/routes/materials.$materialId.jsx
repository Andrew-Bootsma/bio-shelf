import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  createFileRoute,
  Link,
  Outlet,
  useMatches,
  useRouter,
} from "@tanstack/react-router";
import { useContext } from "react";

import {
  faFlask,
  faVial,
  faTools,
  faBoxes,
} from "@fortawesome/free-solid-svg-icons";

import { MaterialContext } from "../contexts";

export const Route = createFileRoute("/materials/$materialId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { materialId } = Route.useParams();
  const router = useRouter();
  const matches = useMatches();

  const { materials, setMaterials } = useContext(MaterialContext);

  const isExactDetailRoute = matches.length === 3;
  const material = materials.find((m) => m.id === materialId);

  const icon = {
    reagent: faFlask,
    consumable: faBoxes,
    sample: faVial,
    equipment: faTools,
  };

  if (!isExactDetailRoute) {
    return <Outlet />;
  }

  if (!material) {
    return <div>Loading...</div>;
  }

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this material?");
    if (!confirmed) return;

    // Optionally: send DELETE request to backend here

    // Update frontend state
    setMaterials(materials.filter((m) => m.id !== materialId));
    router.navigate({ to: "/materials" });
  };

  const DetailField = ({ label, value }) => {
    return (
      <div className="flex justify-between border-b border-black">
        <h3>{label}</h3>
        <h3>{value}</h3>
      </div>
    );
  };

  return (
    <div>
      <h2>
        <FontAwesomeIcon icon={icon[material.type]} /> {material.name}
      </h2>

      <div className="m-4 flex justify-center">
        <div className="max-w-4xl grow">
          <DetailField label="Type" value={material.type} />
          <DetailField
            label="Quantity"
            value={`${material.quantity} ${material.unit}`}
          />
          <DetailField label="Location" value={material.location} />
          <DetailField label="Vendor" value={material.vendor || "—"} />
          <DetailField label="Expiry Date" value={material.expiryDate || "—"} />

          <h3 className="mb-2">Description</h3>
          <p className="mb-4 ml-2">{material.description || "—"}</p>

          {material.notes && (
            <div className="mb-16 border-t border-black">
              <h3 className="mb-2">Notes</h3>
              <p className="ml-2">{material.notes}</p>
            </div>
          )}

          <div className="flex gap-4">
            <Link href={`/inventory/${material.id}/edit`}>
              <button>Edit</button>
            </Link>
            <button onClick={handleDelete}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}
