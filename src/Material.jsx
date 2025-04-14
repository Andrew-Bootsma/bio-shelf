const Material = (props) => {
  return (
    <div className="material">
      <h1>{props.name}</h1>
      <p>{props.description}</p>
    </div>
  );
};

export default Material;
