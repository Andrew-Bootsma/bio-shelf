import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "@tanstack/react-router";

import {
  faFlask,
  faVial,
  faTools,
  faBoxes,
} from "@fortawesome/free-solid-svg-icons";

import StatusBadge from "./StatusBadge/StatusBadge";

import { useFormatUnits } from "../../hooks/useFormatUnits";

const MaterialRow = ({ material }) => {
  const navigate = useNavigate();
  const formattedQuantity = useFormatUnits(material.quantity, material.unit);

  const icon = {
    reagent: faFlask,
    consumable: faBoxes,
    sample: faVial,
    equipment: faTools,
  };

  return (
    <tr
      className="h-16 cursor-pointer border-t border-black hover:bg-brand-muted"
      onClick={() =>
        navigate({
          to: `/materials/$materialId`,
          params: { materialId: material.id },
        })
      }
      tabIndex={0}
      role="link"
      aria-label={`View details for ${material.name}`}
    >
      <td className="pl-4">
        <FontAwesomeIcon icon={icon[material.type]} />
      </td>
      <td className="w-1/3">{material.name}</td>
      <td>{formattedQuantity}</td>
      <td>
        <StatusBadge material={material} />
      </td>
      <td>{material.expiryDate ?? "—"}</td>
      <td>{material.location}</td>
    </tr>
  );
};

export default MaterialRow;
