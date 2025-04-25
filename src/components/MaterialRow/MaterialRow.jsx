import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFlask,
  faVial,
  faTools,
  faBoxes,
} from "@fortawesome/free-solid-svg-icons";

import StatusBadge from "./StatusBadge/StatusBadge";

import { useFormatUnits } from "../../hooks/useFormatUnits";

const MaterialRow = ({ quantity, unit, name, expiryDate, location, type }) => {
  const formattedQuantity = useFormatUnits(quantity, unit);

  const icon = {
    reagent: faFlask,
    consumable: faBoxes,
    sample: faVial,
    equipment: faTools,
  };

  return (
    <tr className="h-16 border-t border-black hover:bg-brand-muted">
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
