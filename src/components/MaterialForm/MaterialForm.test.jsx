import { render, fireEvent, cleanup } from "@testing-library/react";
import { expect, test, vi, afterEach } from "vitest";
import { MaterialMetaContext } from "../../contexts";
import MaterialForm from "./MaterialForm";

afterEach(cleanup);

const mockContextValue = {
  types: [{ id: "reagent" }, { id: "consumable" }, { id: "equipment" }],
  unitOptions: {
    reagent: ["mL", "g", "µL"],
    consumable: ["box", "pack", "piece"],
    equipment: ["unit"],
  },
};

const mockHandleSubmit = vi.fn();

test("MaterialForm renders correctly with default values", () => {
  const screen = render(
    <MaterialMetaContext.Provider value={mockContextValue}>
      <MaterialForm handleSubmit={mockHandleSubmit} />
    </MaterialMetaContext.Provider>,
  );

  expect(screen.getByLabelText("Name")).toBeDefined();
  expect(screen.getByLabelText("Type")).toBeDefined();
  expect(screen.getByLabelText("Quantity")).toBeDefined();
  expect(screen.getByLabelText("Unit")).toBeDefined();
  expect(screen.getByLabelText("Location")).toBeDefined();
  expect(screen.getByLabelText("Expiry Date")).toBeDefined();
  expect(screen.getByLabelText("Vendor")).toBeDefined();
  expect(screen.getByLabelText("Description")).toBeDefined();
  expect(screen.getByLabelText("Notes")).toBeDefined();

  expect(screen.getByLabelText("Name").value).toBe("");
  expect(screen.getByLabelText("Type").value).toBe("reagent");
  expect(screen.getByLabelText("Quantity").value).toBe("0");
  expect(screen.getByLabelText("Location").value).toBe("");

  const button = screen.getByRole("button");
  expect(button.textContent).toBe("Add");
});

test("MaterialForm renders with provided material data", () => {
  const materialData = {
    name: "Test Material",
    type: "consumable",
    quantity: 10,
    unit: "box",
    location: "Lab Room B",
    expiryDate: "2024-12-31",
    vendor: "LabSupplies Inc.",
    description: "Test description",
    notes: "Test notes",
  };

  const screen = render(
    <MaterialMetaContext.Provider value={mockContextValue}>
      <MaterialForm
        materialData={materialData}
        handleSubmit={mockHandleSubmit}
      />
    </MaterialMetaContext.Provider>,
  );

  expect(screen.getByLabelText("Name").value).toBe(materialData.name);
  expect(screen.getByLabelText("Type").value).toBe(materialData.type);
  expect(screen.getByLabelText("Quantity").value).toBe(
    materialData.quantity.toString(),
  );
  expect(screen.getByLabelText("Unit").value).toBe(materialData.unit);
  expect(screen.getByLabelText("Location").value).toBe(materialData.location);
  expect(screen.getByLabelText("Vendor").value).toBe(materialData.vendor);
  expect(screen.getByLabelText("Description").value).toBe(
    materialData.description,
  );
  expect(screen.getByLabelText("Notes").value).toBe(materialData.notes);

  const button = screen.getByRole("button");
  expect(button.textContent).toBe("Update");
});

test("User can input data in all fields", () => {
  const screen = render(
    <MaterialMetaContext.Provider value={mockContextValue}>
      <MaterialForm handleSubmit={mockHandleSubmit} />
    </MaterialMetaContext.Provider>,
  );

  const nameInput = screen.getByLabelText("Name");
  const typeInput = screen.getByLabelText("Type");
  const quantityInput = screen.getByLabelText("Quantity");
  const unitInput = screen.getByLabelText("Unit");
  const locationInput = screen.getByLabelText("Location");
  const expiryDateInput = screen.getByLabelText("Expiry Date");
  const vendorInput = screen.getByLabelText("Vendor");
  const descriptionInput = screen.getByLabelText("Description");
  const notesInput = screen.getByLabelText("Notes");

  fireEvent.change(nameInput, { target: { value: "New Material" } });
  fireEvent.change(typeInput, { target: { value: "equipment" } });
  fireEvent.change(quantityInput, { target: { value: "5" } });
  fireEvent.change(unitInput, { target: { value: "unit" } });
  fireEvent.change(locationInput, { target: { value: "Storage Room" } });
  fireEvent.change(expiryDateInput, { target: { value: "2025-10-15" } });
  fireEvent.change(vendorInput, { target: { value: "Lab Equipment Co." } });
  fireEvent.change(descriptionInput, { target: { value: "New description" } });
  fireEvent.change(notesInput, { target: { value: "Important notes" } });

  expect(nameInput.value).toBe("New Material");
  expect(typeInput.value).toBe("equipment");
  expect(quantityInput.value).toBe("5");
  expect(unitInput.value).toBe("unit");
  expect(locationInput.value).toBe("Storage Room");
  expect(expiryDateInput.value).toBe("2025-10-15");
  expect(vendorInput.value).toBe("Lab Equipment Co.");
  expect(descriptionInput.value).toBe("New description");
  expect(notesInput.value).toBe("Important notes");
});

test("Submit calls handleSubmit with form data", () => {
  const screen = render(
    <MaterialMetaContext.Provider value={mockContextValue}>
      <MaterialForm handleSubmit={mockHandleSubmit} />
    </MaterialMetaContext.Provider>,
  );

  fireEvent.change(screen.getByLabelText("Name"), {
    target: { value: "Test Material" },
  });
  fireEvent.change(screen.getByLabelText("Type"), {
    target: { value: "reagent" },
  });
  fireEvent.change(screen.getByLabelText("Quantity"), {
    target: { value: "15" },
  });
  fireEvent.change(screen.getByLabelText("Location"), {
    target: { value: "Lab A" },
  });

  const submitButton = screen.getByRole("button", { name: "Add" });
  fireEvent.click(submitButton);

  expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
  const expectedData = {
    name: "Test Material",
    type: "reagent",
    quantity: "15",
    unit: expect.any(String),
    location: "Lab A",
    expiryDate: "",
    vendor: "",
    description: "",
    notes: "",
  };
  expect(mockHandleSubmit.mock.calls[0][1]).toMatchObject(expectedData);
});

test("Form changes unit options when type changes", () => {
  const screen = render(
    <MaterialMetaContext.Provider value={mockContextValue}>
      <MaterialForm handleSubmit={mockHandleSubmit} />
    </MaterialMetaContext.Provider>,
  );

  let unitSelect = screen.getByLabelText("Unit");
  expect(unitSelect.options.length).toBe(
    mockContextValue.unitOptions.reagent.length,
  );

  fireEvent.change(screen.getByLabelText("Type"), {
    target: { value: "consumable" },
  });

  unitSelect = screen.getByLabelText("Unit");
  expect(unitSelect.options.length).toBe(
    mockContextValue.unitOptions.consumable.length,
  );
  expect(unitSelect.options[0].value).toBe(
    mockContextValue.unitOptions.consumable[0],
  );
});

test("Loading state is shown when context is not ready", () => {
  const screen = render(
    <MaterialMetaContext.Provider value={{}}>
      <MaterialForm handleSubmit={mockHandleSubmit} />
    </MaterialMetaContext.Provider>,
  );

  expect(screen.getByText("Loading...")).toBeDefined();
});
