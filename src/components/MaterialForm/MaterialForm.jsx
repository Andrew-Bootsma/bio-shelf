import { useContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { MaterialMetaContext, MaterialsContext } from "../../contexts";
import postMaterial from "../../api/postMaterial";

const MaterialForm = ({ materialData }) => {
  const router = useRouter();
  const { materials, setMaterials } = useContext(MaterialsContext);

  const mutation = useMutation({
    mutationFn: function (e) {
      e.preventDefault();

      return postMaterial(formData);
    },
    onSuccess: (newMaterial) => {
      setMaterials([...materials, newMaterial]);
      router.navigate({ to: "/materials" });
    },
  });

  const [formData, setFormData] = useState({
    name: materialData?.name ?? "",
    type: materialData?.type ?? "reagent",
    quantity: materialData?.quantity ?? 0,
    unit: materialData?.unit ?? "",
    location: materialData?.location ?? "",
    expiryDate: materialData?.expiryDate ?? "",
    vendor: materialData?.vendor ?? "",
    description: materialData?.description ?? "",
    notes: materialData?.notes ?? "",
  });

  const { types, unitOptions } = useContext(MaterialMetaContext);

  if (!unitOptions || !types) {
    return <div className="mx-4 my-8">Loading...</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form
      className="max-w-4xl grow border border-black p-4 align-middle"
      onSubmit={(e) => mutation.mutate(e)}
    >
      <div className="form-element">
        <label htmlFor="name" className="mr-8">
          Name
        </label>
        <input
          id="name"
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
          id="type"
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
            id="quantity"
            name="quantity"
            type="number"
            value={formData.quantity}
            required
            onChange={handleChange}
            min={0}
            className="grow"
          />
        </div>
        <div className="form-element">
          <label htmlFor="unit" className="mr-8">
            Unit
          </label>
          <select
            id="unit"
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
          id="location"
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
          id="expiryDate"
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
          id="vendor"
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
          id="description"
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
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="grow"
        />
      </div>
      <button type="submit">{materialData ? "Update" : "Add"}</button>
    </form>
  );
};

export default MaterialForm;
