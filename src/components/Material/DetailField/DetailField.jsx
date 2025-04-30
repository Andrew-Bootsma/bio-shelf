export const DetailField = ({ label, value }) => {
  return (
    <div className="flex justify-between border-b border-black">
      <h3>{label}</h3>
      <h3>{value}</h3>
    </div>
  );
};
