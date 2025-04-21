import { useState } from "react";

import { useTypes } from "./useTypes";
import { useUnitOptions } from "./useUnitOptions";

const AddMaterial = () => {
  const [formData, setFormData] = useState({
    name: "",
    type: "reagent",
    quantity: 0,
    unit: "",
    location: "",
    expiryDate: "",
    vendor: "",
    description: "",
    notes: "",
  });

  const types = useTypes();
  const unitOptions = useUnitOptions();

  if (!types || !unitOptions) {
    return <div className="mx-4 my-8">Loading...</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const material = Object.fromEntries(new FormData(e.target));

    fetch("/api/materials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(material),
    });

    setFormData({
      name: "",
      type: "reagent",
      quantity: 0,
      unit: "",
      location: "",
      expiryDate: "",
      vendor: "",
      description: "",
      notes: "",
    });
  };

  return (
    <div>
      <h2>Add Material</h2>
      <div className="flex justify-center">
        <form
          className="w-1/2 border-b border-l border-r border-black p-4 align-middle"
          onSubmit={handleSubmit}
        >
          <div className="form-element">
            <label htmlFor="name" className="mr-8">
              Name
            </label>
            <input
              name="name"
              type="text"
              value={formData.name}
              required
              onChange={handleChange}
              className="grow"
            />
          </div>

          <div className="form-element">
            <label htmlFor="type" className="mr-8">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="grow"
            >
              {types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.id}
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
                value={formData.quantity}
                required
                onChange={handleChange}
                min={0}
              />
            </div>
            <div className="form-element">
              <label htmlFor="unit" className="mr-8">
                Unit
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="grow"
              >
                {(unitOptions[formData.type] || []).map((unit) => (
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
              value={formData.location}
              required
              onChange={handleChange}
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
              value={formData.expiryDate}
              onChange={handleChange}
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
              value={formData.vendor}
              onChange={handleChange}
              className="grow"
            />
          </div>

          <div className="form-element">
            <label htmlFor="description" className="mr-8">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="grow"
            />
          </div>

          <div className="form-element">
            <label htmlFor="notes" className="mr-8">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
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
