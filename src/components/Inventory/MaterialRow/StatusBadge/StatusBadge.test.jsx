import { render, cleanup } from "@testing-library/react";
import { expect, test, vi, afterEach } from "vitest";

import StatusBadge from "./StatusBadge";

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

// Mock the useMaterialStatus hook
import { useMaterialStatus } from "../../../../hooks/useMaterialStatus/useMaterialStatus";
vi.mock("../../../../hooks/useMaterialStatus/useMaterialStatus", () => ({
  useMaterialStatus: vi.fn(),
}));

test("renders a dash for equipment type", () => {
  const equipment = {
    type: "equipment",
    name: "Test Equipment",
  };

  const screen = render(<StatusBadge material={equipment} />);
  expect(screen.getByText("—")).toBeDefined();
});

test("renders LOW status with correct styling", () => {
  const material = {
    type: "reagent",
    name: "Test Material",
    quantity: 10,
  };

  // Mock the hook to return "LOW"
  useMaterialStatus.mockReturnValue("LOW");

  const screen = render(<StatusBadge material={material} />);

  const badge = screen.getByText("LOW");
  expect(badge).toBeDefined();
  expect(badge.className).toContain("text-red-600");
  expect(badge.className).toContain("border border-black");
});

test("renders IN STOCK status with correct styling", () => {
  const material = {
    type: "reagent",
    name: "Test Material",
    quantity: 100,
  };

  // Mock the hook to return "IN_STOCK"
  useMaterialStatus.mockReturnValue("IN_STOCK");

  const screen = render(<StatusBadge material={material} />);

  const badge = screen.getByText("IN STOCK");
  expect(badge).toBeDefined();
  expect(badge.className).toContain("text-black");
  expect(badge.className).toContain("border border-black");
});

test("renders EXPIRED status with correct styling", () => {
  const material = {
    type: "reagent",
    name: "Test Material",
    quantity: 100,
    expiryDate: "2020-01-01",
  };

  // Mock the hook to return "EXPIRED"
  useMaterialStatus.mockReturnValue("EXPIRED");

  const screen = render(<StatusBadge material={material} />);

  const badge = screen.getByText("EXPIRED");
  expect(badge).toBeDefined();
  expect(badge.className).toContain("text-yellow-700");
  expect(badge.className).toContain("border border-black");
});
