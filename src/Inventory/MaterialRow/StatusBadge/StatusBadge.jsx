import { useMaterialStatus } from "./useMaterialStatus";

const StatusBadge = (props) => {
  if (props.type === "equipment") {
    return "—";
  }

  const status = useMaterialStatus(
    props.quantity,
    props.expiryDate,
    props.type,
  );

  const color = {
    LOW: "text-red-600",
    OK: "text-black",
    EXPIRED: "text-yellow-700",
  }[status];

  return (
    <span
      className={`border border-black px-2 py-0.5 text-xs uppercase ${color}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
