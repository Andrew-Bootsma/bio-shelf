import React from "react";

const StatusBadge = (props) => {
  const color = {
    LOW: "text-red-600",
    OK: "text-black",
    EXPIRED: "text-yellow-700",
  }[props.status];

  return (
    <span
      className={`border border-black bg-white px-2 py-0.5 font-mono text-xs uppercase ${color}`}
    >
      {props.status}
    </span>
  );
};

export default StatusBadge;
