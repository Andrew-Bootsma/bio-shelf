import { expect, test } from "vitest";
import { render } from "@testing-library/react";

import StatCard from "./StatCard";

test("renders title and value correctly", () => {
  const screen = render(<StatCard title="Test Title" value={42} />);

  expect(screen.getByText("Test Title")).toBeDefined();
  expect(screen.getByText("42")).toBeDefined();
});
