import { useState, useEffect } from "react";

const AddMaterial = () => {
  const [types, setTypes] = useState([]);
  const [unitOptions, setUnitOptions] = useState({});

  const [name, setName] = useState("");
  const [type, setType] = useState("reagent");
  const [quantity, setQuantity] = useState(0);
  const [unit, setUnit] = useState("");
  const [location, setLocation] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [vendor, setVendor] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");

  async function fetchTypes() {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const [typeRes, unitRes] = await Promise.all([
      fetch("/api/types"),
      fetch("/api/unitOptions"),
    ]);

    const typesData = await typeRes.json();
    const unitsData = await unitRes.json();

    setTypes(typesData);
    setUnitOptions(unitsData);
  }

  useEffect(() => {
    fetchTypes();
  }, []);

  return (
    <div>
      <h2>Add Material</h2>
      <div className="flex justify-center">
        <form className="w-1/2 border-b border-l border-r border-black p-4 align-middle">
          <div className="form-element">
            <label htmlFor="name" className="mr-8">
              Name
            </label>
            <input
              name="name"
              type="text"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              className="grow"
            />
          </div>

          <div className="form-element">
            <label htmlFor="type" className="mr-8">
              Type
            </label>
            <select
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="grow"
            >
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">
            <div className="form-element">
              <label htmlFor="quantity" className="mr-8">
                Quantity
              </label>
              <input
                name="quantity"
                type="number"
                value={quantity}
                required
                onChange={(e) => setQuantity(e.target.value)}
                min={0}
              />
            </div>
            <div className="form-element">
              <label htmlFor="unit" className="mr-8">
                Unit
              </label>
              <select
                name="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="grow"
              >
                {(unitOptions[type] || []).map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-element">
            <label htmlFor="location" className="mr-8">
              Location
            </label>
            <input
              name="location"
              type="text"
              value={location}
              required
              onChange={(e) => setLocation(e.target.value)}
              className="grow"
            />
          </div>

          <div className="form-element">
            <label htmlFor="expiryDate" className="mr-8">
              Expiry Date
            </label>
            <input
              name="expiryDate"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="grow"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="form-element">
            <label htmlFor="vendor" className="mr-8">
              Vendor
            </label>
            <input
              name="vendor"
              type="text"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
              className="grow"
            />
          </div>

          <div className="form-element">
            <label htmlFor="description" className="mr-8">
              Description
            </label>
            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="grow"
            />
          </div>

          <div className="form-element">
            <label htmlFor="notes" className="mr-8">
              Notes
            </label>
            <textarea
              name="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="grow"
            />
          </div>
          <button type="submit" className="button">
            Add Material
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMaterial;
