import { expect, test, describe, vi, beforeEach } from "vitest";
import createFetchMock from "vitest-fetch-mock";
import getMaterial from "../getMaterial";

const fetchMocker = createFetchMock(vi);

describe("getMaterial", () => {
  beforeEach(() => {
    fetchMocker.resetMocks();
    fetchMocker.enableMocks();
  });

  test("successfully fetches a single material", async () => {
    const mockMaterial = {
      id: "123",
      name: "Test Material",
      type: "reagent",
      quantity: 100,
      unit: "g",
    };

    fetchMocker.mockResponseOnce(JSON.stringify(mockMaterial));

    const result = await getMaterial("123");

    expect(fetchMocker).toHaveBeenCalledWith("/api/materials/123");
    expect(result).toEqual(mockMaterial);
  });

  test("handles material not found", async () => {
    fetchMocker.mockResponseOnce("", { status: 404 });

    // Current implementation tries to parse empty response as JSON which throws
    await expect(getMaterial("nonexistent")).rejects.toThrow();
  });

  test("handles network error", async () => {
    fetchMocker.mockRejectOnce(new Error("Network error"));

    await expect(getMaterial("123")).rejects.toThrow("Network error");
  });

  test("handles invalid material ID", async () => {
    fetchMocker.mockResponseOnce(JSON.stringify({ error: "Not found" }));

    const result = await getMaterial("");

    expect(fetchMocker).toHaveBeenCalledWith("/api/materials/");
    expect(result).toEqual({ error: "Not found" });
  });
});
