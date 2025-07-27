import { render, fireEvent, waitFor } from "@testing-library/react";
import { vi, test, expect } from "vitest";
import createFetchMock from "vitest-fetch-mock";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MaterialMetaContext, MaterialsContext } from "../contexts";
import { Route } from "../routes/materials.new.lazy";

const mockNavigate = vi.fn();
vi.mock(import("@tanstack/react-router"), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useRouter: () => ({
      navigate: mockNavigate,
    }),
  };
});

const queryClient = new QueryClient();

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

test("can add a new material", async () => {
  const testData = {
    name: "Test Material",
    type: "reagent",
    quantity: "10",
    unit: "mL",
    location: "Test Location",
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    vendor: "Test Vendor",
    description: "Test Description",
    notes: "Test Notes",
  };

  fetchMocker.mockResponse(JSON.stringify({ id: "123", ...testData }));

  const metaContextValue = {
    types: [{ id: "reagent" }],
    unitOptions: { reagent: ["mL", "g"] },
  };

  const mockSetMaterials = vi.fn();
  const materialsContextValue = {
    materials: [],
    setMaterials: mockSetMaterials,
  };

  const screen = render(
    <MaterialMetaContext.Provider value={metaContextValue}>
      <MaterialsContext.Provider value={materialsContextValue}>
        <QueryClientProvider client={queryClient}>
          <Route.options.component />
        </QueryClientProvider>
      </MaterialsContext.Provider>
    </MaterialMetaContext.Provider>,
  );

  const nameInput = screen.getByLabelText("Name");
  const typeInput = screen.getByLabelText("Type");
  const quantityInput = screen.getByLabelText("Quantity");
  const unitInput = screen.getByLabelText("Unit");
  const locationInput = screen.getByLabelText("Location");
  const dateInput = screen.getByLabelText("Expiry Date");
  const vendorInput = screen.getByLabelText("Vendor");
  const descriptionInput = screen.getByLabelText("Description");
  const notesInput = screen.getByLabelText("Notes");

  fireEvent.change(nameInput, { target: { value: testData.name } });
  fireEvent.change(typeInput, { target: { value: testData.type } });
  fireEvent.change(quantityInput, { target: { value: testData.quantity } });
  fireEvent.change(unitInput, { target: { value: testData.unit } });
  fireEvent.change(locationInput, { target: { value: testData.location } });
  fireEvent.change(dateInput, { target: { value: testData.expiryDate } });
  fireEvent.change(vendorInput, { target: { value: testData.vendor } });
  fireEvent.change(descriptionInput, {
    target: { value: testData.description },
  });
  fireEvent.change(notesInput, { target: { value: testData.notes } });

  const btn = screen.getByRole("button", { name: "Add" });
  btn.click();

  await waitFor(() => {
    const requests = fetchMocker.requests();
    expect(requests.length).toBe(1);
    expect(requests[0].url).toBe("/api/materials");
  });

  expect(fetchMocker).toHaveBeenCalledWith("/api/materials", {
    body: JSON.stringify(testData),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  await waitFor(() => {
    expect(mockSetMaterials).toHaveBeenCalledWith([{ id: "123", ...testData }]);
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/materials" });
  });
});
