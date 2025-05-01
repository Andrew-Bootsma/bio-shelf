import { render, cleanup, fireEvent } from "@testing-library/react";
import { expect, test, vi, afterEach } from "vitest";

import MaterialRow from "./MaterialRow";

vi.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: ({ icon }) => (
    <span data-testid={`icon-${icon.iconName}`}></span>
  ),
}));

const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("../../../hooks/useFormatUnits/useFormatUnits", () => ({
  useFormatUnits: (quantity, unit) => `${quantity} ${unit}`,
}));

vi.mock("./StatusBadge/StatusBadge", () => ({
  default: ({ material }) => (
    <span data-testid="status-badge">{material.status || "Status Badge"}</span>
  ),
}));

vi.mock("@fortawesome/free-solid-svg-icons", () => ({
  faFlask: { iconName: "flask" },
  faVial: { iconName: "vial" },
  faTools: { iconName: "tools" },
  faBoxes: { iconName: "boxes-stacked" },
}));

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

test("renders a reagent material row correctly", () => {
  const material = {
    id: "1",
    name: "Test Reagent",
    type: "reagent",
    quantity: 100,
    unit: "g",
    location: "Lab Shelf A",
    expiryDate: "2024-12-31",
  };

  const screen = render(<MaterialRow material={material} />);

  expect(screen.getByTestId("icon-flask")).toBeDefined();
  expect(screen.getByText("Test Reagent")).toBeDefined();
  expect(screen.getByText("100 g")).toBeDefined();
  expect(screen.getByTestId("status-badge")).toBeDefined();
  expect(screen.getByText("2024-12-31")).toBeDefined();
  expect(screen.getByText("Lab Shelf A")).toBeDefined();

  const row = screen.getByRole("link");
  expect(row).toBeDefined();
  expect(row.getAttribute("aria-label")).toBe("View details for Test Reagent");
});

test("renders a consumable material row correctly", () => {
  const material = {
    id: "2",
    name: "Test Consumable",
    type: "consumable",
    quantity: 50,
    unit: "pieces",
    location: "Storage Cabinet B",
    expiryDate: null,
  };

  const screen = render(<MaterialRow material={material} />);

  expect(screen.getByTestId("icon-boxes-stacked")).toBeDefined();
  expect(screen.getByText("Test Consumable")).toBeDefined();
  expect(screen.getByText("50 pieces")).toBeDefined();
  expect(screen.getByText("—")).toBeDefined();
  expect(screen.getByText("Storage Cabinet B")).toBeDefined();
});

test("renders a sample material row correctly", () => {
  const material = {
    id: "3",
    name: "Test Sample",
    type: "sample",
    quantity: 10,
    unit: "ml",
    location: "Freezer 1",
    expiryDate: "2023-10-15",
  };

  const screen = render(<MaterialRow material={material} />);

  expect(screen.getByTestId("icon-vial")).toBeDefined();
  expect(screen.getByText("Test Sample")).toBeDefined();
  expect(screen.getByText("10 ml")).toBeDefined();
  expect(screen.getByText("2023-10-15")).toBeDefined();
  expect(screen.getByText("Freezer 1")).toBeDefined();
});

test("renders an equipment material row correctly", () => {
  const material = {
    id: "4",
    name: "Test Equipment",
    type: "equipment",
    location: "Lab Room 101",
    expiryDate: null,
  };

  const screen = render(<MaterialRow material={material} />);

  expect(screen.getByTestId("icon-tools")).toBeDefined();
  expect(screen.getByText("Test Equipment")).toBeDefined();
  expect(screen.getByText("Lab Room 101")).toBeDefined();
});

test("row is clickable and has correct styling", () => {
  const material = {
    id: "5",
    name: "Test Material",
    type: "reagent",
    quantity: 100,
    unit: "g",
    location: "Lab Shelf A",
  };

  const screen = render(<MaterialRow material={material} />);

  const row = screen.getByRole("link");

  expect(row.className).toContain("cursor-pointer");
  expect(row.className).toContain("border-t");
  expect(row.className).toContain("hover:bg-brand-muted");

  fireEvent.click(row);

  expect(mockNavigate).toHaveBeenCalledWith({
    to: `/materials/$materialId`,
    params: { materialId: material.id },
  });
});
