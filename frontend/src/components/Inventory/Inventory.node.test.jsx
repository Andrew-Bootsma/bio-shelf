import { render, cleanup, fireEvent } from "@testing-library/react";
import { expect, test, vi, afterEach } from "vitest";

import MaterialTable from "./Inventory";

vi.mock("./MaterialRow/MaterialRow", () => ({
  default: ({ material }) => (
    <tr data-testid={`material-row-${material.id}`}>
      <td>{material.name}</td>
    </tr>
  ),
}));

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
});

test("renders inventory table with materials", () => {
  const mockMaterials = [
    { id: "1", name: "Test Material 1" },
    { id: "2", name: "Test Material 2" },
    { id: "3", name: "Test Material 3" },
  ];

  const setCurrentPage = vi.fn();

  const screen = render(
    <MaterialTable
      currentMaterials={mockMaterials}
      currentPage={1}
      setCurrentPage={setCurrentPage}
      totalPages={2}
    />,
  );

  expect(screen.getByText("Inventory")).toBeDefined();

  expect(screen.getByText("Name")).toBeDefined();
  expect(screen.getByText("Qty")).toBeDefined();
  expect(screen.getByText("Status")).toBeDefined();
  expect(screen.getByText("Expires")).toBeDefined();
  expect(screen.getByText("Location")).toBeDefined();

  mockMaterials.forEach((material) => {
    expect(screen.getByTestId(`material-row-${material.id}`)).toBeDefined();
  });

  expect(screen.getByText("Page 1")).toBeDefined();
  expect(screen.getByText("Previous")).toBeDefined();
  expect(screen.getByText("Next")).toBeDefined();
});

test("pagination previous button is disabled on first page", () => {
  const mockMaterials = [{ id: "1", name: "Test Material" }];
  const setCurrentPage = vi.fn();

  const screen = render(
    <MaterialTable
      currentMaterials={mockMaterials}
      currentPage={1}
      setCurrentPage={setCurrentPage}
      totalPages={3}
    />,
  );

  const prevButton = screen.getByText("Previous");
  const nextButton = screen.getByText("Next");

  expect(prevButton.hasAttribute("disabled")).toBe(true);
  expect(nextButton.hasAttribute("disabled")).toBe(false);
});

test("pagination next button is disabled on last page", () => {
  const mockMaterials = [{ id: "1", name: "Test Material" }];
  const setCurrentPage = vi.fn();

  const screen = render(
    <MaterialTable
      currentMaterials={mockMaterials}
      currentPage={3}
      setCurrentPage={setCurrentPage}
      totalPages={3}
    />,
  );

  const prevButton = screen.getByText("Previous");
  const nextButton = screen.getByText("Next");

  expect(prevButton.hasAttribute("disabled")).toBe(false);
  expect(nextButton.hasAttribute("disabled")).toBe(true);
});

test("clicking next button increments page", () => {
  const mockMaterials = [{ id: "1", name: "Test Material" }];
  const setCurrentPage = vi.fn();
  const currentPage = 2;

  const screen = render(
    <MaterialTable
      currentMaterials={mockMaterials}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      totalPages={3}
    />,
  );

  const nextButton = screen.getByText("Next");
  fireEvent.click(nextButton);

  expect(setCurrentPage).toHaveBeenCalledWith(currentPage + 1);
});

test("clicking previous button decrements page", () => {
  const mockMaterials = [{ id: "1", name: "Test Material" }];
  const setCurrentPage = vi.fn();
  const currentPage = 2;

  const screen = render(
    <MaterialTable
      currentMaterials={mockMaterials}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      totalPages={3}
    />,
  );

  const prevButton = screen.getByText("Previous");
  fireEvent.click(prevButton);

  expect(setCurrentPage).toHaveBeenCalledWith(currentPage - 1);
});

test("renders empty inventory table correctly", () => {
  const emptyMaterials = [];
  const setCurrentPage = vi.fn();

  const screen = render(
    <MaterialTable
      currentMaterials={emptyMaterials}
      currentPage={1}
      setCurrentPage={setCurrentPage}
      totalPages={1}
    />,
  );

  expect(screen.getByText("Inventory")).toBeDefined();

  expect(screen.getByText("Name")).toBeDefined();
  expect(screen.getByText("Qty")).toBeDefined();

  const materialRows = screen.queryAllByTestId(/material-row-/);
  expect(materialRows.length).toBe(0);

  expect(screen.getByText("Page 1")).toBeDefined();
  expect(screen.getByText("Previous")).toBeDefined();
  expect(screen.getByText("Next")).toBeDefined();
});
