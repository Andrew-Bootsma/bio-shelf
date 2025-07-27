import { expect, test, describe, vi, beforeEach } from "vitest";
import createFetchMock from "vitest-fetch-mock";
import getUnitOptions from "../getUnitOptions";

const fetchMocker = createFetchMock(vi);

describe("getUnitOptions", () => {
  beforeEach(() => {
    fetchMocker.resetMocks();
    fetchMocker.enableMocks();
  });

  test("successfully fetches unit options", async () => {
    const mockUnitOptions = {
      reagent: ["g", "mg", "kg", "mL", "L", "µL"],
      consumable: ["units", "pieces", "boxes", "packs"],
      equipment: ["units"],
    };

    fetchMocker.mockResponseOnce(JSON.stringify(mockUnitOptions));

    const result = await getUnitOptions();

    expect(fetchMocker).toHaveBeenCalledWith("/api/unitOptions");
    expect(result).toEqual(mockUnitOptions);
  });

  test("handles empty unit options", async () => {
    fetchMocker.mockResponseOnce(JSON.stringify({}));

    const result = await getUnitOptions();

    expect(result).toEqual({});
  });

  test("handles network error", async () => {
    fetchMocker.mockRejectOnce(new Error("Network error"));

    await expect(getUnitOptions()).rejects.toThrow("Network error");
  });

  test("handles server error", async () => {
    fetchMocker.mockResponseOnce("Internal Server Error", { status: 500 });

    // Current implementation tries to parse text as JSON which throws
    await expect(getUnitOptions()).rejects.toThrow();
  });

  test("handles malformed JSON response", async () => {
    fetchMocker.mockResponseOnce("not valid json");

    await expect(getUnitOptions()).rejects.toThrow();
  });

  test("handles partial unit options data", async () => {
    const partialUnitOptions = {
      reagent: ["g", "mL"],
      // consumable and equipment missing
    };

    fetchMocker.mockResponseOnce(JSON.stringify(partialUnitOptions));

    const result = await getUnitOptions();

    expect(result).toEqual(partialUnitOptions);
  });
});
