import { expect, test, vi } from "vitest";
import { render } from "@testing-library/react";

import LowStockPreview from "./LowStockPreview";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children }) => children,
}));

test("renders correctly with no materials", () => {
  const screen = render(<LowStockPreview materials={[]} />);
  expect(screen.getByText("Low Stock Preview")).toBeDefined();
});

test("renders correctly with materials", () => {
  const screen = render(
    <LowStockPreview
      materials={[
        {
          id: "1",
          name: "Material 1",
          quantity: 10,
          unit: "g",
          location: "Lab 1",
          vendor: "Vendor 1",
          notes: "Notes 1",
          description: "Description 1",
          type: "reagent",
        },
      ]}
    />,
  );
  expect(screen.getByText("Material 1 (10 g)")).toBeDefined();
});
