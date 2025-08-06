import { expect, test, vi } from "vitest";
import { render } from "@testing-library/react";

import ExpiringSoonPreview from "./ExpiringSoonPreview";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children }) => children,
}));

test("renders correctly with no materials", () => {
  const screen = render(<ExpiringSoonPreview materials={[]} />);
  expect(screen.getByText("Expiring Soon Preview")).toBeDefined();
});

test("renders correctly with materials", () => {
  const screen = render(
    <ExpiringSoonPreview
      materials={[
        {
          id: "1",
          name: "Material 1",
          quantity: 10,
          unit: "g",
          expiryDate: "2024-01-01",
          location: "Lab 1",
          vendor: "Vendor 1",
          notes: "Notes 1",
          description: "Description 1",
          type: "reagent",
        },
      ]}
    />,
  );

  expect(screen.getByText("Material 1 (Expires: 2024-01-01)")).toBeDefined();
});
