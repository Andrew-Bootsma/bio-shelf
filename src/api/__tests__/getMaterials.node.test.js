import { expect, test, describe, vi, beforeEach } from "vitest";
import createFetchMock from "vitest-fetch-mock";
import getMaterials from "../getMaterials";

const fetchMocker = createFetchMock(vi);

describe("getMaterials", () => {
  beforeEach(() => {
    fetchMocker.resetMocks();
    fetchMocker.enableMocks();
  });

  test("successfully fetches materials", async () => {
    const mockMaterials = [
      { id: "1", name: "Material 1", type: "reagent" },
      { id: "2", name: "Material 2", type: "consumable" },
    ];

    fetchMocker.mockResponseOnce(JSON.stringify(mockMaterials));

    const result = await getMaterials();

    expect(fetchMocker).toHaveBeenCalledWith("/api/materials");
    expect(result).toEqual(mockMaterials);
  });

  test("handles network error", async () => {
    fetchMocker.mockRejectOnce(new Error("Network error"));

    await expect(getMaterials()).rejects.toThrow("Network error");
  });

  test("handles non-200 response", async () => {
    fetchMocker.mockResponseOnce("", { status: 500 });

    // The current implementation tries to parse empty response as JSON which throws
    await expect(getMaterials()).rejects.toThrow();
  });

  test("handles invalid JSON response", async () => {
    fetchMocker.mockResponseOnce("invalid json");

    await expect(getMaterials()).rejects.toThrow();
  });

  test("handles empty array response", async () => {
    fetchMocker.mockResponseOnce(JSON.stringify([]));

    const result = await getMaterials();

    expect(result).toEqual([]);
  });
});
