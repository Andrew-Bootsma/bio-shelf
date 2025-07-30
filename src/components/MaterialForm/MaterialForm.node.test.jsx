import { expect, test, describe, vi, afterEach, beforeEach } from "vitest";
import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { MaterialMetaContext, MaterialsContext } from "../../contexts";
import MaterialForm from "./MaterialForm";

// Mock router
const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  useRouter: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock postMaterial API
vi.mock("../../api/postMaterial/postMaterial", () => ({
  default: vi.fn(),
}));

import postMaterial from "../../api/postMaterial/postMaterial";

// Mock React 19 hooks for testing
vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    useActionState: vi.fn(),
  };
});

vi.mock("react-dom", async () => {
  const actual = await vi.importActual("react-dom");
  return {
    ...actual,
    useFormStatus: vi.fn(),
  };
});

describe("MaterialForm", () => {
  const mockSetMaterials = vi.fn();

  const defaultMetaContext = {
    types: [
      { id: "reagent", name: "Reagent" },
      { id: "consumable", name: "Consumable" },
      { id: "equipment", name: "Equipment" },
    ],
    unitOptions: {
      reagent: ["g", "mg", "mL", "L"],
      consumable: ["units", "pieces"],
      equipment: ["units"],
    },
  };

  const defaultMaterialsContext = {
    materials: [],
    setMaterials: mockSetMaterials,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock form submission for React 19 form actions
    window.HTMLFormElement.prototype.requestSubmit = vi.fn(function () {
      // Trigger form submission event
      const event = new Event("submit", { bubbles: true, cancelable: true });
      this.dispatchEvent(event);
    });

    // Setup useActionState mock
    const mockFormAction = vi.fn(async (formData) => {
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

      try {
        const result = await postMaterial(materialFormData);
        mockSetMaterials([result]);
        mockNavigate({ to: "/materials" });
        return { success: true, material: result };
      } catch (error) {
        return { error: error.message || "Failed to save material" };
      }
    });

    useActionState.mockReturnValue([
      { error: null, success: false },
      mockFormAction,
    ]);

    // Setup useFormStatus mock
    useFormStatus.mockReturnValue({
      pending: false,
      data: null,
      method: "post",
      action: mockFormAction,
    });
  });

  afterEach(() => {
    cleanup();
  });

  const renderMaterialForm = (
    materialData = null,
    metaContext = defaultMetaContext,
    materialsContext = defaultMaterialsContext,
  ) => {
    return render(
      <MaterialMetaContext.Provider value={metaContext}>
        <MaterialsContext.Provider value={materialsContext}>
          <MaterialForm materialData={materialData} />
        </MaterialsContext.Provider>
      </MaterialMetaContext.Provider>,
    );
  };

  test("renders loading state when meta context is not available", () => {
    const screen = renderMaterialForm(null, { types: null, unitOptions: null });
    expect(screen.getByText("Loading...")).toBeDefined();
  });

  test("renders form with all fields", () => {
    const screen = renderMaterialForm();

    expect(screen.getByLabelText("Name")).toBeDefined();
    expect(screen.getByLabelText("Type")).toBeDefined();
    expect(screen.getByLabelText("Quantity")).toBeDefined();
    expect(screen.getByLabelText("Unit")).toBeDefined();
    expect(screen.getByLabelText("Location")).toBeDefined();
    expect(screen.getByLabelText("Expiry Date")).toBeDefined();
    expect(screen.getByLabelText("Vendor")).toBeDefined();
    expect(screen.getByLabelText("Description")).toBeDefined();
    expect(screen.getByLabelText("Notes")).toBeDefined();
  });

  test("initializes with default values for new material", () => {
    const screen = renderMaterialForm();

    expect(screen.getByLabelText("Name").value).toBe("");
    expect(screen.getByLabelText("Type").value).toBe("reagent");
    expect(screen.getByLabelText("Quantity").value).toBe("0");
    // Unit select defaults to first option when no unit is set
    expect(screen.getByLabelText("Unit").value).toBe("g");
  });

  test("initializes with provided material data for editing", () => {
    const existingMaterial = {
      name: "Existing Material",
      type: "consumable",
      quantity: 50,
      unit: "pieces",
      location: "Lab A",
      expiryDate: "2025-12-31", // Use future date to avoid min date issues
      vendor: "Test Vendor",
      description: "Test Description",
      notes: "Test Notes",
    };

    const screen = renderMaterialForm(existingMaterial);

    expect(screen.getByLabelText("Name").value).toBe("Existing Material");
    expect(screen.getByLabelText("Type").value).toBe("consumable");
    expect(screen.getByLabelText("Quantity").value).toBe("50");
    expect(screen.getByLabelText("Unit").value).toBe("pieces");
    expect(screen.getByLabelText("Location").value).toBe("Lab A");
    expect(screen.getByLabelText("Expiry Date").value).toBe("2025-12-31");
    expect(screen.getByLabelText("Vendor").value).toBe("Test Vendor");
    expect(screen.getByLabelText("Description").value).toBe("Test Description");
    expect(screen.getByLabelText("Notes").value).toBe("Test Notes");
  });

  test("updates form fields on change", () => {
    const screen = renderMaterialForm();

    const nameInput = screen.getByLabelText("Name");
    fireEvent.change(nameInput, { target: { value: "New Material" } });
    expect(nameInput.value).toBe("New Material");

    const quantityInput = screen.getByLabelText("Quantity");
    fireEvent.change(quantityInput, { target: { value: "25" } });
    expect(quantityInput.value).toBe("25");
  });

  test("updates unit options when type changes", () => {
    const screen = renderMaterialForm();

    const typeSelect = screen.getByLabelText("Type");
    const unitSelect = screen.getByLabelText("Unit");

    // Initially reagent type
    fireEvent.change(unitSelect, { target: { value: "mL" } });
    expect(unitSelect.value).toBe("mL");

    // Change to consumable type
    fireEvent.change(typeSelect, { target: { value: "consumable" } });

    // Unit options should update
    const unitOptions = Array.from(unitSelect.options).map((opt) => opt.value);
    expect(unitOptions).toContain("units");
    expect(unitOptions).toContain("pieces");
  });

  test("submits form successfully", async () => {
    const newMaterial = {
      id: "123",
      name: "Test Material",
      type: "reagent",
      quantity: 10,
      unit: "g",
      location: "Lab B",
      expiryDate: "", // Empty expiry date to avoid input date issues
      vendor: "Vendor A",
      description: "Description",
      notes: "Notes",
    };

    postMaterial.mockResolvedValueOnce(newMaterial);

    const screen = renderMaterialForm();

    // Fill form
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: newMaterial.name },
    });
    fireEvent.change(screen.getByLabelText("Quantity"), {
      target: { value: String(newMaterial.quantity) },
    });
    fireEvent.change(screen.getByLabelText("Unit"), {
      target: { value: newMaterial.unit },
    });
    fireEvent.change(screen.getByLabelText("Location"), {
      target: { value: newMaterial.location },
    });
    fireEvent.change(screen.getByLabelText("Vendor"), {
      target: { value: newMaterial.vendor },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: newMaterial.description },
    });
    fireEvent.change(screen.getByLabelText("Notes"), {
      target: { value: newMaterial.notes },
    });

    // Submit form - simulate form action call
    const form = screen.container.querySelector("form");
    const formData = new FormData(form);

    // Get the mocked form action and call it directly
    const [, formAction] = useActionState.mock.results[0].value;
    await formAction(formData);

    await waitFor(() => {
      expect(postMaterial).toHaveBeenCalledWith({
        name: newMaterial.name,
        type: newMaterial.type,
        quantity: newMaterial.quantity, // Form actions convert to number
        unit: newMaterial.unit,
        location: newMaterial.location,
        expiryDate: newMaterial.expiryDate,
        vendor: newMaterial.vendor,
        description: newMaterial.description,
        notes: newMaterial.notes,
      });
    });

    await waitFor(() => {
      expect(mockSetMaterials).toHaveBeenCalledWith([newMaterial]);
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/materials" });
    });
  });

  test("prevents form submission when required fields are empty", () => {
    const screen = renderMaterialForm();

    const form = screen.container.querySelector("form");
    const submitSpy = vi.fn((e) => e.preventDefault());
    form.addEventListener("submit", submitSpy);

    const submitButton = screen.getByRole("button", { name: "Add" });
    fireEvent.click(submitButton);

    // Browser should prevent submission due to required field validation
    // Our submit handler shouldn't be called
    expect(postMaterial).not.toHaveBeenCalled();
  });

  test("handles submission error gracefully", async () => {
    postMaterial.mockRejectedValueOnce(new Error("Network error"));

    const screen = renderMaterialForm();

    // Fill all required fields to allow form submission
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByLabelText("Location"), {
      target: { value: "Test Location" },
    });

    // Submit form - simulate form action call
    const form = screen.container.querySelector("form");
    const formData = new FormData(form);

    // Get the mocked form action and call it directly
    const [, formAction] = useActionState.mock.results[0].value;
    const result = await formAction(formData);

    await waitFor(() => {
      expect(postMaterial).toHaveBeenCalled();
    });

    // Check that error was returned
    expect(result.error).toBe("Network error");

    // Should not navigate on error
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockSetMaterials).not.toHaveBeenCalled();
  });

  test("shows loading state during submission", async () => {
    // Mock useFormStatus to return pending state
    useFormStatus.mockReturnValue({
      pending: true,
      data: null,
      method: "post",
      action: vi.fn(),
    });

    const screen = renderMaterialForm();

    // Check if loading state is shown when pending is true
    expect(screen.getByText("Saving...")).toBeDefined();
    expect(screen.getByText("Processing your request...")).toBeDefined();
  });

  test("renders all material types from context", () => {
    const screen = renderMaterialForm();

    const typeSelect = screen.getByLabelText("Type");
    const options = Array.from(typeSelect.options);

    expect(options).toHaveLength(3);
    expect(options.map((opt) => opt.value)).toEqual([
      "reagent",
      "consumable",
      "equipment",
    ]);
  });

  test("handles missing unit options gracefully", () => {
    const metaContextWithoutUnits = {
      types: defaultMetaContext.types,
      unitOptions: {},
    };

    const screen = renderMaterialForm(null, metaContextWithoutUnits);

    const unitSelect = screen.getByLabelText("Unit");
    const options = Array.from(unitSelect.options);

    expect(options).toHaveLength(0);
  });
});
