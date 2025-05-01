import { expect, test, describe } from "vitest";
import { renderHook } from "@testing-library/react";
import { useFormatUnits } from "./useFormatUnits";

describe("useFormatUnits", () => {
  test("should return empty string when quantity is null", () => {
    const { result } = renderHook(() => useFormatUnits(null, "gram"));
    expect(result.current).toBe("");
  });

  test("should return quantity when unit is null", () => {
    const { result } = renderHook(() => useFormatUnits(500, null));
    expect(result.current).toBe(500);
  });

  test("should return quantity when unit is empty string", () => {
    const { result } = renderHook(() => useFormatUnits(500, ""));
    expect(result.current).toBe(500);
  });

  test("should format a quantity with a sanctioned unit 'gram' correctly", () => {
    const { result } = renderHook(() => useFormatUnits(500, "gram"));
    expect(result.current).toBe("500 g");
  });

  test("should format a quantity with a sanctioned unit 'grams' correctly", () => {
    const { result } = renderHook(() => useFormatUnits(500, "grams"));
    expect(result.current).toBe("500 g");
  });

  test("should format a quantity with a sanctioned unit 'milliliter' correctly", () => {
    const { result } = renderHook(() => useFormatUnits(100, "milliliter"));
    expect(result.current).toBe("100 mL");
  });

  test("should format a quantity with 'milligram' correctly", () => {
    const { result } = renderHook(() => useFormatUnits(250, "milligram"));
    expect(result.current).toBe("250 mg");
  });

  test("should handle units ending with 'L'", () => {
    const { result } = renderHook(() => useFormatUnits(5, "mL"));
    expect(result.current).toBe("5 mL");
  });

  test("should handle units ending with 'g'", () => {
    const { result } = renderHook(() => useFormatUnits(5, "mg"));
    expect(result.current).toBe("5 mg");
  });

  test("should return simple concatenation for non-sanctioned units", () => {
    const { result } = renderHook(() => useFormatUnits(10, "pieces"));
    expect(result.current).toBe("10 pieces");
  });

  test("should handle 'glasses' unit singular form", () => {
    const { result } = renderHook(() => useFormatUnits(1, "glasses"));
    expect(result.current).toBe("1 glass");
  });

  test("should handle 'glasses' unit plural form", () => {
    const { result } = renderHook(() => useFormatUnits(5, "glasses"));
    expect(result.current).toBe("5 glasses");
  });

  test("should handle 'boxes' unit singular form", () => {
    const { result } = renderHook(() => useFormatUnits(1, "boxes"));
    expect(result.current).toBe("1 box");
  });

  test("should handle 'boxes' unit plural form", () => {
    const { result } = renderHook(() => useFormatUnits(5, "boxes"));
    expect(result.current).toBe("5 boxes");
  });

  test("should handle regular unit singular form", () => {
    const { result } = renderHook(() => useFormatUnits(1, "bottle"));
    expect(result.current).toBe("1 bottle");
  });

  test("should handle regular unit plural form", () => {
    const { result } = renderHook(() => useFormatUnits(5, "bottle"));
    expect(result.current).toBe("5 bottles");
  });

  test("should handle unit that already ends with 's'", () => {
    const { result } = renderHook(() => useFormatUnits(1, "glass"));
    expect(result.current).toBe("1 glass");
  });

  test("should handle unit that already ends with 's' in plural form", () => {
    const { result } = renderHook(() => useFormatUnits(5, "glass"));
    expect(result.current).toBe("5 glasses");
  });

  test("should handle unit that ends with 'ss' in singular form", () => {
    const { result } = renderHook(() => useFormatUnits(1, "glass"));
    expect(result.current).toBe("1 glass");
  });

  test("should handle unit that ends with 'ss' in plural form", () => {
    const { result } = renderHook(() => useFormatUnits(5, "glass"));
    expect(result.current).toBe("5 glasses");
  });

  // Edge cases
  test("should handle decimal quantities", () => {
    const { result } = renderHook(() => useFormatUnits(2.5, "bottle"));
    expect(result.current).toBe("2.5 bottles");
  });

  test("should handle zero quantity", () => {
    const { result } = renderHook(() => useFormatUnits(0, "gram"));
    expect(result.current).toBe("0 g");
  });

  test("should handle negative quantity", () => {
    const { result } = renderHook(() => useFormatUnits(-5, "bottle"));
    expect(result.current).toBe("-5 bottles");
  });

  // Test for fallback when Intl.NumberFormat throws an error
  test("should handle fallback when Intl.NumberFormat fails", () => {
    // Mock Intl.NumberFormat to throw an error
    const originalNumberFormat = Intl.NumberFormat;
    Intl.NumberFormat = function () {
      return {
        format: () => {
          throw new Error("Mocked error");
        },
      };
    };

    const { result } = renderHook(() => useFormatUnits(10, "gram"));
    expect(result.current).toBe("10 gram");

    // Restore the original Intl.NumberFormat
    Intl.NumberFormat = originalNumberFormat;
  });
});
