import { render, cleanup } from "@testing-library/react";
import { expect, test, vi, afterEach } from "vitest";

import Header from "./Header";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children }) => children,
}));

afterEach(cleanup);

test("Header snapshot", () => {
  const { asFragment } = render(<Header />);
  expect(asFragment()).toMatchSnapshot();
});

test("renders the header", () => {
  const screen = render(<Header />);
  expect(screen.getByText("BioShelf")).toBeDefined();
});
