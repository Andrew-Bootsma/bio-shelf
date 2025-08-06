import { render } from "vitest-browser-react";
import { expect, test, describe, vi } from "vitest";
import {
  createMemoryHistory,
  createRouter,
  RouterProvider,
  createRootRoute,
} from "@tanstack/react-router";
import MaterialRow from "./MaterialRow";

// Create minimal router setup for testing
const createTestRouter = (material) => {
  const mockNavigate = vi.fn();

  const rootRoute = createRootRoute({
    component: () => (
      <table>
        <tbody>
          <MaterialRow material={material} />
        </tbody>
      </table>
    ),
  });

  const memoryHistory = createMemoryHistory({
    initialEntries: ["/"],
  });

  const router = createRouter({
    routeTree: rootRoute,
    history: memoryHistory,
    defaultPendingMinMs: 0,
  });

  // Mock navigate after router creation
  vi.spyOn(router, "navigate").mockImplementation(mockNavigate);

  return { router, mockNavigate };
};

describe("MaterialRow", () => {
  test("renders with correct aria-label", async () => {
    const material = {
      id: "1",
      name: "Test Material",
      type: "reagent",
      quantity: 10,
      unit: "ml",
    };

    const { router } = createTestRouter(material);
    const screen = render(<RouterProvider router={router} />);
    const { getByRole } = screen;

    const row = getByRole("link", { name: "View details for Test Material" });

    await expect.element(row).toBeInTheDocument();
    await expect
      .element(row)
      .toHaveAttribute("aria-label", "View details for Test Material");
  });

  test("displays material name correctly", async () => {
    const material = {
      id: "1",
      name: "Sodium Chloride",
      type: "reagent",
      quantity: 500,
      unit: "gram",
    };

    const { router } = createTestRouter(material);
    const screen = render(<RouterProvider router={router} />);

    await expect
      .element(screen.getByText("Sodium Chloride"))
      .toBeInTheDocument();
  });

  test("displays expiry date when provided", async () => {
    const material = {
      id: "1",
      name: "Test Material",
      type: "reagent",
      quantity: 10,
      unit: "ml",
      expiryDate: "2024-12-31",
    };

    const { router } = createTestRouter(material);
    const screen = render(<RouterProvider router={router} />);

    await expect.element(screen.getByText("2024-12-31")).toBeInTheDocument();
  });

  test("displays dash when expiry date is not provided", async () => {
    const material = {
      id: "1",
      name: "Test Material",
      type: "reagent",
      quantity: 10,
      unit: "ml",
      expiryDate: null,
    };

    const { router } = createTestRouter(material);
    const screen = render(<RouterProvider router={router} />);

    await expect.element(screen.getByText("—")).toBeInTheDocument();
  });

  test("displays location when provided", async () => {
    const material = {
      id: "1",
      name: "Test Material",
      type: "reagent",
      quantity: 10,
      unit: "ml",
      location: "Lab Fridge A",
    };

    const { router } = createTestRouter(material);
    const screen = render(<RouterProvider router={router} />);

    await expect.element(screen.getByText("Lab Fridge A")).toBeInTheDocument();
  });

  test("has proper keyboard accessibility attributes", async () => {
    const material = {
      id: "1",
      name: "Test Material",
      type: "reagent",
      quantity: 10,
      unit: "ml",
    };

    const { router } = createTestRouter(material);
    const screen = render(<RouterProvider router={router} />);
    const { getByRole } = screen;

    const row = getByRole("link");

    await expect.element(row).toHaveAttribute("tabIndex", "0");
    await expect.element(row).toHaveAttribute("role", "link");
  });

  test("renders as clickable table row", async () => {
    const material = {
      id: "1",
      name: "Test Material",
      type: "reagent",
      quantity: 10,
      unit: "ml",
    };

    const { router } = createTestRouter(material);
    const screen = render(<RouterProvider router={router} />);
    const { getByRole } = screen;

    const row = getByRole("link");

    await expect.element(row).toBeInTheDocument();
    await expect.element(row).toHaveClass("cursor-pointer");
  });

  test("triggers navigation when clicked", async () => {
    const material = {
      id: "test-id-123",
      name: "Test Material",
      type: "reagent",
      quantity: 10,
      unit: "ml",
    };

    const { router, mockNavigate } = createTestRouter(material);
    const screen = render(<RouterProvider router={router} />);
    const { getByRole } = screen;

    const row = getByRole("link");
    await row.click();

    expect(mockNavigate).toHaveBeenCalledWith({
      to: "/materials/$materialId",
      params: { materialId: "test-id-123" },
    });
  });

  describe("material type icons", () => {
    const materialTypes = [
      { type: "reagent", name: "Reagent Material" },
      { type: "consumable", name: "Consumable Material" },
      { type: "sample", name: "Sample Material" },
      { type: "equipment", name: "Equipment Material" },
    ];

    materialTypes.forEach(({ type, name }) => {
      test(`renders correct structure for ${type} type`, async () => {
        const material = {
          id: "1",
          name,
          type,
          quantity: 10,
          unit: "ml",
        };

        const { router } = createTestRouter(material);
        const screen = render(<RouterProvider router={router} />);
        const { container } = screen;

        // Check that the material name is displayed
        await expect.element(screen.getByText(name)).toBeInTheDocument();

        // Check that there's an icon in the first cell
        const iconCell = container.querySelector("tr td:first-child");
        const icon = iconCell?.querySelector("svg");

        await expect.element(icon).toBeInTheDocument();
      });
    });
  });

  test("renders StatusBadge component", async () => {
    const material = {
      id: "1",
      name: "Test Material",
      type: "reagent",
      quantity: 10,
      unit: "ml",
    };

    const { router } = createTestRouter(material);
    const screen = render(<RouterProvider router={router} />);
    const { getByRole, container } = screen;

    // Get the table row and verify it exists
    const row = getByRole("link");
    await expect.element(row).toBeInTheDocument();

    // Use container.querySelector to find all td elements
    const cells = container.querySelectorAll("td");
    expect(cells).toHaveLength(6);

    // StatusBadge should be in the 4th column (index 3)
    const statusCell = cells[3];
    await expect.element(statusCell).toBeInTheDocument();
  });

  test("handles missing optional properties gracefully", async () => {
    const material = {
      id: "1",
      name: "Minimal Material",
      type: "reagent",
      // Missing quantity, unit, expiryDate, location
    };

    const { router } = createTestRouter(material);
    const screen = render(<RouterProvider router={router} />);

    // Should still render the material name
    await expect
      .element(screen.getByText("Minimal Material"))
      .toBeInTheDocument();

    // Should show dash for missing expiry date
    await expect.element(screen.getByText("—")).toBeInTheDocument();
  });
});
