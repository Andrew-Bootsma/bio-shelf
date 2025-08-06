import { render, cleanup } from "@testing-library/react";
import { expect, test, afterEach } from "vitest";

import DetailField from "./DetailField";

afterEach(cleanup);

test("renders the detail field", () => {
  const screen = render(<DetailField label="Test Label" value="Test Value" />);
  expect(screen.getByText("Test Label")).toBeDefined();
  expect(screen.getByText("Test Value")).toBeDefined();
});
