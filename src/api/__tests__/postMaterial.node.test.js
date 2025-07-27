import { expect, test, describe, vi, beforeEach } from "vitest";
import createFetchMock from "vitest-fetch-mock";
import postMaterial from "../postMaterial";

const fetchMocker = createFetchMock(vi);

describe("postMaterial", () => {
  beforeEach(() => {
    fetchMocker.resetMocks();
    fetchMocker.enableMocks();
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  test("successfully posts a new material", async () => {
    const newMaterial = {
      name: "New Material",
      type: "reagent",
      quantity: 50,
      unit: "mL",
    };

    const mockResponse = { id: "123", ...newMaterial };
    fetchMocker.mockResponseOnce(JSON.stringify(mockResponse));

    const result = await postMaterial(newMaterial);

    expect(fetchMocker).toHaveBeenCalledWith("/api/materials", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMaterial),
    });
    expect(result).toEqual(mockResponse);
    expect(console.log).toHaveBeenCalledWith(newMaterial);
  });

  test("handles server error response", async () => {
    const material = { name: "Test" };
    fetchMocker.mockResponseOnce("Server Error", { status: 500 });

    // Current implementation tries to parse text as JSON which throws
    await expect(postMaterial(material)).rejects.toThrow();
  });

  test("handles network failure", async () => {
    const material = { name: "Test" };
    fetchMocker.mockRejectOnce(new Error("Network failed"));

    await expect(postMaterial(material)).rejects.toThrow("Network failed");
  });

  test("handles invalid JSON response", async () => {
    const material = { name: "Test" };
    fetchMocker.mockResponseOnce("invalid json");

    await expect(postMaterial(material)).rejects.toThrow();
  });

  test("handles null response gracefully", async () => {
    const material = { name: "Test" };

    // Mock fetch to return null
    global.fetch = vi.fn().mockResolvedValueOnce(null);

    await expect(postMaterial(material)).rejects.toThrow(
      "Network response failed.",
    );

    // Restore fetch mock
    fetchMocker.enableMocks();
  });

  test("correctly stringifies complex material objects", async () => {
    const complexMaterial = {
      name: "Complex Material",
      type: "reagent",
      quantity: 100,
      unit: "g",
      metadata: {
        vendor: "Test Vendor",
        catalogNumber: "12345",
      },
      tags: ["hazardous", "temperature-sensitive"],
    };

    fetchMocker.mockResponseOnce(
      JSON.stringify({ id: "456", ...complexMaterial }),
    );

    await postMaterial(complexMaterial);

    const callArgs = fetchMocker.mock.calls[0];
    expect(JSON.parse(callArgs[1].body)).toEqual(complexMaterial);
  });
});
