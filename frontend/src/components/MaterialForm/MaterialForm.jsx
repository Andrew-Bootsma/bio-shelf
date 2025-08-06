import { use, useOptimistic, useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "@tanstack/react-router";
import { MaterialMetaContext, MaterialsContext } from "../../contexts";
import postMaterial from "../../api/postMaterial/postMaterial";

// SubmitButton component that uses useFormStatus
function SubmitButton({ materialData }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Saving..." : materialData ? "Update" : "Add"}
    </button>
  );
}

// FormStatus component for loading feedback
function FormStatus() {
  const { pending } = useFormStatus();
  return pending ? (
    <div className="text-blue-600">Processing your request...</div>
  ) : null;
}

const MaterialForm = ({ materialData }) => {
  const router = useRouter();
  const { materials, setMaterials } = use(MaterialsContext);
  const { types, unitOptions } = use(MaterialMetaContext);

  // State for reactive unit options
  const [selectedType, setSelectedType] = useState(
    materialData?.type ?? "reagent",
  );

  // Optimistic updates for better UX
  const [, addOptimisticMaterial] = useOptimistic(
    materials,
    (state, newMaterial) => [...state, newMaterial],
  );

  // React 19 useActionState for form handling
  const [state, formAction] = useActionState(
    async (prevState, formData) => {
      const materialFormData = {
        name: formData.get("name"),
        type: formData.get("type"),
        quantity: Number(formData.get("quantity")),
        unit: formData.get("unit"),
        location: formData.get("location"),
        expiryDate: formData.get("expiryDate"),
        vendor: formData.get("vendor"),
        description: formData.get("description"),
        notes: formData.get("notes"),
      };

      // Optimistic update - show immediately
      if (!materialData) {
        // Only for new materials
        const tempMaterial = { ...materialFormData, id: Date.now() };
        addOptimisticMaterial(tempMaterial);
      }

      try {
        const savedMaterial = await postMaterial(materialFormData);
        setMaterials([...materials, savedMaterial]);
        router.navigate({ to: "/materials" });
        return { success: true, material: savedMaterial };
      } catch (error) {
        return { error: error.message || "Failed to save material" };
      }
    },
    { error: null, success: false },
  );

  if (!unitOptions || !types) {
    return <div className="mx-4 my-8">Loading...</div>;
  }

  return (
    <form
      className="max-w-4xl grow border border-black p-4 align-middle"
      action={formAction}
    >
      {/* Display error message if submission failed */}
      {state?.error && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 p-3 text-red-700">
          Error: {state.error}
        </div>
      )}

      <div className="form-element">
        <label htmlFor="name" className="mr-8">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={materialData?.name ?? ""}
          required
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
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
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
            defaultValue={materialData?.quantity ?? 0}
            required
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
            defaultValue={materialData?.unit ?? ""}
            className="grow"
          >
            {(unitOptions[selectedType] || []).map((unit) => (
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
          defaultValue={materialData?.location ?? ""}
          required
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
          defaultValue={materialData?.expiryDate ?? ""}
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
          defaultValue={materialData?.vendor ?? ""}
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
          defaultValue={materialData?.description ?? ""}
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
          defaultValue={materialData?.notes ?? ""}
          className="grow"
        />
      </div>

      <FormStatus />
      <SubmitButton materialData={materialData} />
    </form>
  );
};

export default MaterialForm;
