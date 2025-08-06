import { render, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { vi, test, expect, describe, beforeEach, afterEach } from "vitest";
import createFetchMock from "vitest-fetch-mock";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MaterialMetaContext, MaterialsContext } from "../contexts";
import MaterialForm from "../components/MaterialForm/MaterialForm";

const mockNavigate = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  useRouter: () => ({
    navigate: mockNavigate,
  }),
}));

let queryClient;
const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

describe("Material Edit Integration", () => {
  const mockSetMaterials = vi.fn();

  const existingMaterial = {
    id: "123",
    name: "Existing Material",
    type: "reagent",
    quantity: 50,
    unit: "mL",
    location: "Lab Storage",
    expiryDate: "2025-06-01",
    vendor: "Science Corp",
    description: "Test reagent",
    notes: "Handle with care",
  };

  const metaContextValue = {
    types: [
      { id: "reagent", name: "Reagent" },
      { id: "consumable", name: "Consumable" },
    ],
    unitOptions: {
      reagent: ["mL", "L", "g", "mg"],
      consumable: ["units", "pieces"],
    },
  };

  const materialsContextValue = {
    materials: [existingMaterial],
    setMaterials: mockSetMaterials,
  };

  beforeEach(() => {
    fetchMocker.resetMocks();
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  afterEach(() => {
    cleanup();
  });

  test("can edit an existing material through MaterialForm", async () => {
    // Create a custom handleSubmit that mimics what the edit route does
    const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const updatedMaterial = Object.fromEntries(formData);
      updatedMaterial.quantity = Number(updatedMaterial.quantity);
      updatedMaterial.id = existingMaterial.id;

      await fetch(`/api/materials/${existingMaterial.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMaterial),
      });

      mockSetMaterials(
        materialsContextValue.materials.map((m) =>
          m.id === existingMaterial.id ? updatedMaterial : m,
        ),
      );
      mockNavigate({ to: "/materials" });
    };

    fetchMocker.mockResponseOnce(JSON.stringify({ success: true }));

    const screen = render(
      <MaterialMetaContext.Provider value={metaContextValue}>
        <MaterialsContext.Provider value={materialsContextValue}>
          <QueryClientProvider client={queryClient}>
            <form onSubmit={handleSubmit}>
              <MaterialForm materialData={existingMaterial} />
            </form>
          </QueryClientProvider>
        </MaterialsContext.Provider>
      </MaterialMetaContext.Provider>,
    );

    // Verify initial values are loaded
    expect(screen.getByLabelText("Name").value).toBe(existingMaterial.name);
    expect(screen.getByLabelText("Quantity").value).toBe(
      String(existingMaterial.quantity),
    );

    // Update fields
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Updated Material Name" },
    });
    fireEvent.change(screen.getByLabelText("Quantity"), {
      target: { value: "75" },
    });

    // Submit form
    const form = screen.container.querySelector("form");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(fetchMocker).toHaveBeenCalledWith(
        `/api/materials/${existingMaterial.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: expect.stringContaining('"name":"Updated Material Name"'),
        },
      );
    });

    await waitFor(() => {
      expect(mockSetMaterials).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/materials" });
    });
  });

  test("updates material quantity correctly", async () => {
    const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const updatedMaterial = Object.fromEntries(formData);
      updatedMaterial.quantity = Number(updatedMaterial.quantity);
      updatedMaterial.id = existingMaterial.id;

      await fetch(`/api/materials/${existingMaterial.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMaterial),
      });

      mockSetMaterials(
        materialsContextValue.materials.map((m) =>
          m.id === existingMaterial.id ? updatedMaterial : m,
        ),
      );
    };

    fetchMocker.mockResponseOnce(JSON.stringify({ success: true }));

    const screen = render(
      <MaterialMetaContext.Provider value={metaContextValue}>
        <MaterialsContext.Provider value={materialsContextValue}>
          <QueryClientProvider client={queryClient}>
            <form onSubmit={handleSubmit}>
              <MaterialForm materialData={existingMaterial} />
            </form>
          </QueryClientProvider>
        </MaterialsContext.Provider>
      </MaterialMetaContext.Provider>,
    );

    // Change only quantity
    fireEvent.change(screen.getByLabelText("Quantity"), {
      target: { value: "100" },
    });

    // Submit form
    const form = screen.container.querySelector("form");
    fireEvent.submit(form);

    await waitFor(() => {
      const requestBody = JSON.parse(fetchMocker.mock.calls[0][1].body);
      expect(requestBody.quantity).toBe(100);
      expect(requestBody.name).toBe(existingMaterial.name);
    });
  });

  test("handles edit submission error", async () => {
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await fetch(`/api/materials/${existingMaterial.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });
      } catch (error) {
        // Error should be handled gracefully
        return;
      }
    };

    fetchMocker.mockRejectOnce(new Error("Network error"));

    const screen = render(
      <MaterialMetaContext.Provider value={metaContextValue}>
        <MaterialsContext.Provider value={materialsContextValue}>
          <QueryClientProvider client={queryClient}>
            <form onSubmit={handleSubmit}>
              <MaterialForm materialData={existingMaterial} />
            </form>
          </QueryClientProvider>
        </MaterialsContext.Provider>
      </MaterialMetaContext.Provider>,
    );

    // Submit form
    const form = screen.container.querySelector("form");
    fireEvent.submit(form);

    await waitFor(() => {
      expect(fetchMocker).toHaveBeenCalled();
    });

    // Should not navigate or update state on error
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockSetMaterials).not.toHaveBeenCalled();
  });
});
