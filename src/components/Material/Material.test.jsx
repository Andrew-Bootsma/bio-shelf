import { render, cleanup } from "@testing-library/react";
import { expect, test, vi, afterEach } from "vitest";

import Material from "./Material";

afterEach(cleanup);

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children }) => children,
}));

test("Material renders", () => {
  const materialData = {
    id: "1",
    name: "Test Material",
    type: "reagent",
    quantity: 100,
    unit: "g",
    location: "Test Location",
    vendor: "Test Vendor",
    expiryDate: "2024-01-01",
  };

  const handleDelete = vi.fn();

  const screen = render(
    <Material material={materialData} handleDelete={handleDelete} />,
  );

  const material = screen.getByText(materialData.name);
  expect(material).toBeDefined();
});
