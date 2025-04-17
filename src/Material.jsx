import StatusBadge from "./StatusBadge";

const Material = (props) => {
  return (
    <tr className="hover:bg-brand-muted">
      <td className="border border-black px-2 py-1">{props.name}</td>
      <td className="border border-black px-2 py-1 text-center">
        {props.quantity}
      </td>
      <td className="border border-black px-2 py-1 text-center">
        {props.unit}
      </td>
      <td className="border border-black px-2 py-1 text-center">
        <StatusBadge status={props.status} />
      </td>
      <td className="border border-black px-2 py-1 text-center">
        {props.expiryDate ?? "—"}
      </td>
    </tr>
  );
};

export default Material;
