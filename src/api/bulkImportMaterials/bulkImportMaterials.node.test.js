import { describe, test, expect, vi, beforeEach } from "vitest";
import bulkImportMaterials from "./bulkImportMaterials";

// Mock fetch
global.fetch = vi.fn();

describe("bulkImportMaterials", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test("successfully imports multiple materials", async () => {
    const materials = [
      {
        name: "Test Material 1",
        type: "reagent",
        quantity: 100,
        unit: "mL",
        location: "Lab A",
      },
      {
        name: "Test Material 2",
        type: "consumable",
        quantity: 50,
        unit: "pcs",
        location: "Lab B",
      },
    ];

    const mockResponses = [
      { ...materials[0], id: "1" },
      { ...materials[1], id: "2" },
    ];

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponses[0]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponses[1]),
      });

    const result = await bulkImportMaterials(materials);

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenNthCalledWith(1, "/api/materials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(materials[0]),
    });
    expect(fetch).toHaveBeenNthCalledWith(2, "/api/materials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(materials[1]),
    });
    expect(result).toEqual(mockResponses);
  });

  test("handles API errors gracefully", async () => {
    const materials = [
      {
        name: "Test Material",
        type: "reagent",
        quantity: 100,
        unit: "mL",
        location: "Lab A",
      },
    ];

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(bulkImportMaterials(materials)).rejects.toThrow(
      "Failed to import some materials",
    );

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test("returns empty array for empty materials list", async () => {
    const result = await bulkImportMaterials([]);
    expect(result).toEqual([]);
    expect(fetch).not.toHaveBeenCalled();
  });
});
