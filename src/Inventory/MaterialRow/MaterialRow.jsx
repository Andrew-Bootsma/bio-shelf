import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFlask,
  faVial,
  faTools,
  faBoxes,
} from "@fortawesome/free-solid-svg-icons";

import StatusBadge from "./StatusBadge/StatusBadge";

import { useFormatUnits } from "./useFormatUnits";

const MaterialRow = (props) => {
  const formattedQuantity = useFormatUnits(props.quantity, props.unit);

  const icon = {
    reagent: faFlask,
    consumable: faBoxes,
    sample: faVial,
    equipment: faTools,
  };

  return (
    <tr className="h-16 border-t border-black hover:bg-brand-muted">
      <td className="pl-4">
        <FontAwesomeIcon icon={icon[props.type]} />
      </td>
      <td>{props.name}</td>
      <td>{formattedQuantity}</td>
      <td>
        <StatusBadge
          quantity={props.quantity}
          expiryDate={props.expiryDate}
          type={props.type}
        />
      </td>
      <td>{props.expiryDate ?? "—"}</td>
      <td>{props.location}</td>
    </tr>
  );
};

export default MaterialRow;
