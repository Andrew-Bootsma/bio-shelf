import { expect, test, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";

import Dashboard from "./Dashboard";

afterEach(() => {
  cleanup();
});

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, className, href }) => {
    const testId =
      href === "/materials/new" || href === "/materials"
        ? "action-link"
        : "material-link";

    return (
      <div data-testid={testId} className={className}>
        {children}
      </div>
    );
  },
}));

test("renders dashboard with all components", () => {
  const mockData = {
    materials: [{ id: "1" }, { id: "2" }],
    lowStockMaterials: [
      {
        id: "1",
        name: "Test Material",
        quantity: 5,
        unit: "mL",
      },
    ],
    expiringMaterials: [
      {
        id: "2",
        name: "Expiring Material",
        expiryDate: "2023-12-31",
      },
    ],
    expiredMaterials: [{ id: "3" }, { id: "4" }],
  };

  const screen = render(
    <Dashboard
      materials={mockData.materials}
      lowStockMaterials={mockData.lowStockMaterials}
      expiringMaterials={mockData.expiringMaterials}
      expiredMaterials={mockData.expiredMaterials}
    />,
  );

  expect(screen.getByText("Dashboard")).toBeDefined();

  const statCards = screen.getAllByRole("heading", { level: 2 });
  expect(statCards.map((card) => card.textContent)).toContain(
    "Total Materials",
  );
  expect(statCards.map((card) => card.textContent)).toContain("Low Stock");
  expect(statCards.map((card) => card.textContent)).toContain("Expiring Soon");
  expect(statCards.map((card) => card.textContent)).toContain("Expired");

  const totalCard = screen.getByText("Total Materials").closest("div");
  expect(totalCard.textContent).toContain("2");

  const lowStockCard = screen.getByText("Low Stock").closest("div");
  expect(lowStockCard.textContent).toContain("1");

  const expiringCard = screen.getByText("Expiring Soon").closest("div");
  expect(expiringCard.textContent).toContain("1");

  const expiredCard = screen.getByText("Expired").closest("div");
  expect(expiredCard.textContent).toContain("2");

  expect(screen.getByText("Low Stock Preview")).toBeDefined();
  expect(screen.getByText(/Test Material/)).toBeDefined();

  expect(screen.getByText("Expiring Soon Preview")).toBeDefined();
  expect(screen.getByText(/Expiring Material/)).toBeDefined();

  // Check action links specifically (not material links)
  const actionLinks = screen.getAllByTestId("action-link");
  expect(actionLinks.length).toBe(2);
  expect(actionLinks[0].textContent.trim()).toBe("+ Add Material");
  expect(actionLinks[1].textContent.trim()).toBe("View Full Inventory");
});

test("renders dashboard with empty data", () => {
  const emptyData = {
    materials: [],
    lowStockMaterials: [],
    expiringMaterials: [],
    expiredMaterials: [],
  };

  const screen = render(
    <Dashboard
      materials={emptyData.materials}
      lowStockMaterials={emptyData.lowStockMaterials}
      expiringMaterials={emptyData.expiringMaterials}
      expiredMaterials={emptyData.expiredMaterials}
    />,
  );

  const totalCard = screen.getByText("Total Materials").closest("div");
  expect(totalCard.textContent).toContain("0");

  const lowStockCard = screen.getByText("Low Stock").closest("div");
  expect(lowStockCard.textContent).toContain("0");

  const expiringCard = screen.getByText("Expiring Soon").closest("div");
  expect(expiringCard.textContent).toContain("0");

  const expiredCard = screen.getByText("Expired").closest("div");
  expect(expiredCard.textContent).toContain("0");

  expect(screen.getByText("Low Stock Preview")).toBeDefined();
  expect(screen.getByText("Expiring Soon Preview")).toBeDefined();

  const actionLinks = screen.getAllByTestId("action-link");
  expect(actionLinks.length).toBe(2);
  expect(actionLinks[0].textContent.trim()).toBe("+ Add Material");
  expect(actionLinks[1].textContent.trim()).toBe("View Full Inventory");
});
