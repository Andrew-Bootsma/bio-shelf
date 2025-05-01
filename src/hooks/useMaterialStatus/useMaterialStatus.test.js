import { expect, test } from "vitest";
import { renderHook } from "@testing-library/react";
import { useMaterialStatus } from "./useMaterialStatus";

test("should return IN STOCK for material with sufficient quantity", () => {
  const testMaterial = {
    name: "Test Material",
    quantity: 100,
    expiryDate: "2050-01-01",
    type: "reagent",
    unit: "g",
    unitPrice: 10,
    supplier: "Test Supplier",
    location: "Test Location",
    notes: "Test Notes",
  };

  const { result } = renderHook(() => useMaterialStatus(testMaterial));
  expect(result.current).toBe("IN STOCK");
});

test("should return LOW for material with quantity below threshold", () => {
  const testMaterial = {
    name: "Test Material",
    quantity: 20, // below the reagent threshold of 50
    expiryDate: "2050-01-01",
    type: "reagent",
    unit: "g",
    unitPrice: 10,
    supplier: "Test Supplier",
    location: "Test Location",
    notes: "Test Notes",
  };

  const { result } = renderHook(() => useMaterialStatus(testMaterial));
  expect(result.current).toBe("LOW");
});

test("should return EXPIRED for material with expired date", () => {
  const testMaterial = {
    name: "Test Material",
    quantity: 100, // sufficient quantity
    expiryDate: "2020-01-01", // expired date
    type: "reagent",
    unit: "g",
    unitPrice: 10,
    supplier: "Test Supplier",
    location: "Test Location",
    notes: "Test Notes",
  };

  const { result } = renderHook(() => useMaterialStatus(testMaterial));
  expect(result.current).toBe("EXPIRED");
});

test("should prioritize EXPIRED over LOW status", () => {
  const testMaterial = {
    name: "Test Material",
    quantity: 20, // below threshold
    expiryDate: "2020-01-01", // expired date
    type: "reagent",
    unit: "g",
    unitPrice: 10,
    supplier: "Test Supplier",
    location: "Test Location",
    notes: "Test Notes",
  };

  const { result } = renderHook(() => useMaterialStatus(testMaterial));
  expect(result.current).toBe("EXPIRED");
});

test("should use correct threshold based on material type", () => {
  // Test consumable with quantity at threshold
  const consumableAtThreshold = {
    name: "Test Consumable",
    quantity: 100,
    expiryDate: "2050-01-01",
    type: "consumable",
    unit: "pieces",
  };
  const { result: consumableResult } = renderHook(() =>
    useMaterialStatus(consumableAtThreshold),
  );
  expect(consumableResult.current).toBe("IN STOCK");

  // Test consumable below threshold
  const consumableBelowThreshold = {
    ...consumableAtThreshold,
    quantity: 99,
  };
  const { result: consumableLowResult } = renderHook(() =>
    useMaterialStatus(consumableBelowThreshold),
  );
  expect(consumableLowResult.current).toBe("LOW");
});
