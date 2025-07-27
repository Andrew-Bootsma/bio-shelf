import { expect, test, describe, vi, beforeEach } from "vitest";
import createFetchMock from "vitest-fetch-mock";
import getTypes from "../getTypes";

const fetchMocker = createFetchMock(vi);

describe("getTypes", () => {
  beforeEach(() => {
    fetchMocker.resetMocks();
    fetchMocker.enableMocks();
  });

  test("successfully fetches material types", async () => {
    const mockTypes = [
      { id: "reagent", name: "Reagent" },
      { id: "consumable", name: "Consumable" },
      { id: "equipment", name: "Equipment" },
    ];

    fetchMocker.mockResponseOnce(JSON.stringify(mockTypes));

    const result = await getTypes();

    expect(fetchMocker).toHaveBeenCalledWith("/api/types");
    expect(result).toEqual(mockTypes);
  });

  test("handles empty types array", async () => {
    fetchMocker.mockResponseOnce(JSON.stringify([]));

    const result = await getTypes();

    expect(result).toEqual([]);
  });

  test("handles network error", async () => {
    fetchMocker.mockRejectOnce(new Error("Network error"));

    await expect(getTypes()).rejects.toThrow("Network error");
  });

  test("handles server error", async () => {
    fetchMocker.mockResponseOnce("", { status: 500 });

    // Current implementation tries to parse empty response as JSON which throws
    await expect(getTypes()).rejects.toThrow();
  });

  test("handles malformed JSON", async () => {
    fetchMocker.mockResponseOnce("{invalid json");

    await expect(getTypes()).rejects.toThrow();
  });
});
