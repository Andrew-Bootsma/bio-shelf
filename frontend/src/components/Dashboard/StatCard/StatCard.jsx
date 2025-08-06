const StatCard = ({ title, value }) => {
  return (
    <div className="shadow-hard border border-black p-4 font-mono">
      <h2>{title}</h2>
      <p className="text-center text-2xl">{value}</p>
    </div>
  );
};

export default StatCard;
