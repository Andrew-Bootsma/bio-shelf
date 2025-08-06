import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { MaterialMetaContext, MaterialsContext } from "../../contexts";
import ImportCSV from "./ImportCSV";

const mockRouter = {
  navigate: vi.fn(),
};

vi.mock("@tanstack/react-router", () => ({
  useRouter: () => mockRouter,
}));

// Mock the bulk import API
vi.mock("../../api/bulkImportMaterials/bulkImportMaterials", () => ({
  default: vi.fn(),
}));

import bulkImportMaterials from "../../api/bulkImportMaterials/bulkImportMaterials";

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

const mockMaterialMetaContext = {
  types: [
    { id: "reagent" },
    { id: "sample" },
    { id: "equipment" },
    { id: "consumable" },
  ],
  unitOptions: {
    reagent: ["mL", "µL", "g", "mg", "units"],
    sample: ["vials", "tubes", "slides", "µg", "samples"],
    equipment: ["unit", "set", "piece"],
    consumable: ["pcs", "boxes", "packs", "sheets", "strips"],
  },
};

const mockMaterialsContext = {
  materials: [],
  setMaterials: vi.fn(),
};

const renderWithProviders = (component) => {
  return render(
    <MaterialMetaContext.Provider value={mockMaterialMetaContext}>
      <MaterialsContext.Provider value={mockMaterialsContext}>
        {component}
      </MaterialsContext.Provider>
    </MaterialMetaContext.Provider>,
  );
};

describe("ImportCSV", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Clear any previous renders
    document.body.innerHTML = "";

    // Setup useActionState mock
    const mockImportAction = vi.fn(async (csvData) => {
      try {
        const result = await bulkImportMaterials(csvData);
        mockMaterialsContext.setMaterials([
          ...mockMaterialsContext.materials,
          ...result,
        ]);
        mockRouter.navigate({ to: "/materials" });
        return { success: true, imported: result.length };
      } catch (error) {
        return { error: `Import failed: ${error.message}` };
      }
    });

    useActionState.mockReturnValue([
      { error: null, success: false },
      mockImportAction,
    ]);

    // Setup useFormStatus mock
    useFormStatus.mockReturnValue({
      pending: false,
      data: null,
      method: "post",
      action: mockImportAction,
    });
  });

  test("renders CSV format requirements", () => {
    renderWithProviders(<ImportCSV />);

    expect(screen.getByText("CSV Format Requirements")).toBeDefined();
    // Text is split across elements, so check for both parts
    expect(screen.getByText("Valid types:")).toBeDefined();
    expect(
      screen.getByText("reagent, sample, equipment, consumable"),
    ).toBeDefined();
    expect(screen.getByText("Date format:")).toBeDefined();
    expect(screen.getByText("YYYY-MM-DD (e.g., 2025-12-31)")).toBeDefined();
  });

  test("renders file input and submit button", () => {
    renderWithProviders(<ImportCSV />);

    expect(screen.getByLabelText("Select CSV File")).toBeDefined();
    const importButton = screen.getByRole("button", { name: /import/i });
    expect(importButton).toBeDefined();
    expect(importButton.disabled).toBe(true);
  });

  test("handles file selection", async () => {
    renderWithProviders(<ImportCSV />);

    const fileInput = screen.getByLabelText("Select CSV File");
    const csvContent =
      "name,type,quantity,unit,location,expirydate,vendor,description,notes\nTest Material,reagent,100,mL,Lab A,2025-12-31,Vendor,Description,Notes";
    const file = new File([csvContent], "test.csv", { type: "text/csv" });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText("Preview (1 materials found)")).toBeDefined();
    });
  });

  test("validates CSV headers", async () => {
    renderWithProviders(<ImportCSV />);

    const fileInput = screen.getByLabelText("Select CSV File");
    const csvContent = "invalid,headers\ndata,here";
    const file = new File([csvContent], "test.csv", { type: "text/csv" });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText("Validation Errors:")).toBeDefined();
      expect(screen.getByText(/Missing required headers/)).toBeDefined();
    });
  });

  test("validates material data", async () => {
    renderWithProviders(<ImportCSV />);

    const fileInput = screen.getByLabelText("Select CSV File");
    const csvContent =
      "name,type,quantity,unit,location,expirydate,vendor,description,notes\n,reagent,invalid,mL,Lab A,2025-12-31,Vendor,Description,Notes";
    const file = new File([csvContent], "test.csv", { type: "text/csv" });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText("Validation Errors:")).toBeDefined();
      expect(screen.getByText(/Row 1: Missing name/)).toBeDefined();
    });
  });

  test("enables import button when valid data is loaded", async () => {
    renderWithProviders(<ImportCSV />);

    const fileInput = screen.getByLabelText("Select CSV File");
    const csvContent =
      "name,type,quantity,unit,location,expirydate,vendor,description,notes\nTest Material,reagent,100,mL,Lab A,2025-12-31,Vendor,Description,Notes";
    const file = new File([csvContent], "test.csv", { type: "text/csv" });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const importButton = screen.getByRole("button", {
        name: /Import 1 Materials/i,
      });
      expect(importButton.disabled).toBe(false);
    });
  });

  test("resets form when reset button is clicked", async () => {
    renderWithProviders(<ImportCSV />);

    const fileInput = screen.getByLabelText("Select CSV File");
    const csvContent =
      "name,type,quantity,unit,location,expirydate,vendor,description,notes\nTest Material,reagent,100,mL,Lab A,2025-12-31,Vendor,Description,Notes";
    const file = new File([csvContent], "test.csv", { type: "text/csv" });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText("Preview (1 materials found)")).toBeDefined();
    });

    const resetButton = screen.getByRole("button", { name: /Reset/i });
    fireEvent.click(resetButton);

    expect(screen.queryByText("Preview")).toBeNull();
  });
});
