import { expect, test } from "vitest";
import { render } from "@testing-library/react";

import StatCard from "./StatCard";

test("renders title and value correctly", () => {
  const { getByText } = render(<StatCard title="Test Title" value={42} />);
  expect(getByText("Test Title")).toBeDefined();
  expect(getByText("42")).toBeDefined();
});
