import { useMaterialStatus } from "../../../hooks/useMaterialStatus";

const StatusBadge = ({ material }) => {
  if (material.type === "equipment") {
    return "—";
  }

  const status = useMaterialStatus(material);

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
