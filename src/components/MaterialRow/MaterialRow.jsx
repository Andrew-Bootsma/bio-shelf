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

const MaterialRow = ({
  id,
  quantity,
  unit,
  name,
  expiryDate,
  location,
  type,
}) => {
  const navigate = useNavigate();
  const formattedQuantity = useFormatUnits(quantity, unit);

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
        navigate({ to: `/materials/$materialId`, params: { materialId: id } })
      }
      tabIndex={0}
      role="link"
      aria-label={`View details for ${name}`}
    >
      <td className="pl-4">
        <FontAwesomeIcon icon={icon[type]} />
      </td>
      <td>{name}</td>
      <td>{formattedQuantity}</td>
      <td>
        <StatusBadge quantity={quantity} expiryDate={expiryDate} type={type} />
      </td>
      <td>{expiryDate ?? "—"}</td>
      <td>{location}</td>
    </tr>
  );
};

export default MaterialRow;
