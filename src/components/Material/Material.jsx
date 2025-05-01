import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@tanstack/react-router";

import {
  faFlask,
  faVial,
  faTools,
  faBoxes,
} from "@fortawesome/free-solid-svg-icons";

import DetailField from "./DetailField/DetailField";

import { useFormatUnits } from "../../hooks/useFormatUnits/useFormatUnits";

const Material = ({ material, handleDelete }) => {
  const icon = {
    reagent: faFlask,
    consumable: faBoxes,
    sample: faVial,
    equipment: faTools,
  };

  const formattedQuantity = useFormatUnits(material.quantity, material.unit);

  return (
    <div>
      <h2>
        <FontAwesomeIcon icon={icon[material.type]} /> {material.name}
      </h2>

      <div className="m-4 flex justify-center">
        <div className="max-w-4xl grow">
          <DetailField label="Type" value={material.type} />
          <DetailField label="Quantity" value={formattedQuantity} />
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
            <Link
              to={`/materials/$materialId/edit`}
              params={{ materialId: material.id }}
            >
              <button>Edit</button>
            </Link>
            <button onClick={handleDelete}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Material;
