import { render, cleanup } from "@testing-library/react";
import { expect, test, vi, afterEach } from "vitest";

import Header from "./Header";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children }) => children,
}));

afterEach(cleanup);

test("renders the header", () => {
  const screen = render(<Header />);
  expect(screen.getByText("BioShelf")).toBeDefined();
});
