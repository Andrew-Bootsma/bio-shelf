import { render, fireEvent, waitFor, cleanup } from "@testing-library/react";
import { vi, test, expect, describe, beforeEach, afterEach } from "vitest";
import React from "react";
import createFetchMock from "vitest-fetch-mock";
import { MaterialsContext } from "../contexts";
import Material from "../components/Material/Material";
import Modal from "../components/Modal/Modal";

const mockNavigate = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  useRouter: () => ({
    navigate: mockNavigate,
  }),
  Link: ({ children, className }) => <a className={className}>{children}</a>,
}));

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

describe("Material Delete Integration", () => {
  const mockSetMaterials = vi.fn();

  const existingMaterial = {
    id: "123",
    name: "Material to Delete",
    type: "reagent",
    quantity: 50,
    unit: "mL",
    location: "Lab Storage",
    expiryDate: "2025-06-01",
    vendor: "Science Corp",
    description: "Test reagent",
    notes: "Will be deleted",
  };

  const materialsContextValue = {
    materials: [existingMaterial],
    setMaterials: mockSetMaterials,
  };

  beforeEach(() => {
    fetchMocker.resetMocks();
    vi.clearAllMocks();
    // Create modal root for each test
    const modalRoot = document.createElement("div");
    modalRoot.setAttribute("id", "modal");
    document.body.appendChild(modalRoot);
  });

  afterEach(() => {
    cleanup();
    // Clean up modal root
    const modalRoot = document.getElementById("modal");
    if (modalRoot && document.body.contains(modalRoot)) {
      document.body.removeChild(modalRoot);
    }
  });

  test("can delete a material with confirmation", async () => {
    let showModal = false;
    let modalContent = null;

    const TestComponent = () => {
      const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

      const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
      };

      const handleConfirmDelete = async () => {
        await fetch(`/api/materials/${existingMaterial.id}`, {
          method: "DELETE",
        });

        mockSetMaterials(
          materialsContextValue.materials.filter(
            (m) => m.id !== existingMaterial.id,
          ),
        );
        setShowDeleteConfirm(false);
        mockNavigate({ to: "/materials" });
      };

      const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
      };

      showModal = showDeleteConfirm;
      modalContent = showDeleteConfirm ? (
        <Modal>
          <div className="bg-white p-3">
            <h3>Confirm Deletion</h3>
            <div className="px-4">
              <p>Are you sure you want to delete this material?</p>
              <div className="my-4 flex gap-4">
                <button onClick={handleConfirmDelete}>Yes, Delete</button>
                <button onClick={handleCancelDelete}>Cancel</button>
              </div>
            </div>
          </div>
        </Modal>
      ) : null;

      return (
        <>
          <Material
            material={existingMaterial}
            handleDelete={handleDeleteClick}
          />
          {modalContent}
        </>
      );
    };

    fetchMocker.mockResponseOnce("", { status: 204 });

    const screen = render(
      <MaterialsContext.Provider value={materialsContextValue}>
        <TestComponent />
      </MaterialsContext.Provider>,
    );

    // Find and click delete button
    const deleteButton = screen.getByRole("button", { name: "Delete" });
    fireEvent.click(deleteButton);

    // Confirm deletion in modal
    await waitFor(() => {
      expect(screen.getByText("Confirm Deletion")).toBeDefined();
    });

    const confirmButton = screen.getByRole("button", { name: "Yes, Delete" });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(fetchMocker).toHaveBeenCalledWith(
        `/api/materials/${existingMaterial.id}`,
        {
          method: "DELETE",
        },
      );
    });

    await waitFor(() => {
      expect(mockSetMaterials).toHaveBeenCalledWith([]);
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/materials" });
    });
  });

  test("can cancel delete operation", async () => {
    const TestComponent = () => {
      const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

      const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
      };

      const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
      };

      return (
        <>
          <Material
            material={existingMaterial}
            handleDelete={handleDeleteClick}
          />
          {showDeleteConfirm ? (
            <Modal>
              <div className="bg-white p-3">
                <h3>Confirm Deletion</h3>
                <div className="px-4">
                  <p>Are you sure you want to delete this material?</p>
                  <div className="my-4 flex gap-4">
                    <button>Yes, Delete</button>
                    <button onClick={handleCancelDelete}>Cancel</button>
                  </div>
                </div>
              </div>
            </Modal>
          ) : null}
        </>
      );
    };

    const screen = render(
      <MaterialsContext.Provider value={materialsContextValue}>
        <TestComponent />
      </MaterialsContext.Provider>,
    );

    // Click delete button
    const deleteButton = screen.getByRole("button", { name: "Delete" });
    fireEvent.click(deleteButton);

    // Modal should appear
    await waitFor(() => {
      expect(screen.getByText("Confirm Deletion")).toBeDefined();
    });

    // Click cancel
    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelButton);

    // Modal should disappear
    await waitFor(() => {
      expect(screen.queryByText("Confirm Deletion")).toBeNull();
    });

    // No API call should have been made
    expect(fetchMocker).not.toHaveBeenCalled();
    expect(mockSetMaterials).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("handles delete API error gracefully", async () => {
    const TestComponent = () => {
      const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
      const [error, setError] = React.useState(null);

      const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
      };

      const handleConfirmDelete = async () => {
        try {
          const response = await fetch(
            `/api/materials/${existingMaterial.id}`,
            {
              method: "DELETE",
            },
          );

          if (!response.ok) {
            throw new Error("Delete failed");
          }

          mockSetMaterials(
            materialsContextValue.materials.filter(
              (m) => m.id !== existingMaterial.id,
            ),
          );
          setShowDeleteConfirm(false);
          mockNavigate({ to: "/materials" });
        } catch (err) {
          setError(err.message);
          setShowDeleteConfirm(false);
        }
      };

      return (
        <>
          <Material
            material={existingMaterial}
            handleDelete={handleDeleteClick}
          />
          {error && <div role="alert">Error: {error}</div>}
          {showDeleteConfirm ? (
            <Modal>
              <div className="bg-white p-3">
                <h3>Confirm Deletion</h3>
                <div className="px-4">
                  <p>Are you sure you want to delete this material?</p>
                  <div className="my-4 flex gap-4">
                    <button onClick={handleConfirmDelete}>Yes, Delete</button>
                    <button>Cancel</button>
                  </div>
                </div>
              </div>
            </Modal>
          ) : null}
        </>
      );
    };

    fetchMocker.mockResponseOnce("", { status: 500 });

    const screen = render(
      <MaterialsContext.Provider value={materialsContextValue}>
        <TestComponent />
      </MaterialsContext.Provider>,
    );

    // Click delete button
    const deleteButton = screen.getByRole("button", { name: "Delete" });
    fireEvent.click(deleteButton);

    // Confirm deletion
    await waitFor(() => {
      expect(screen.getByText("Confirm Deletion")).toBeDefined();
    });

    const confirmButton = screen.getByRole("button", { name: "Yes, Delete" });
    fireEvent.click(confirmButton);

    // Should show error
    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeDefined();
      expect(screen.getByText("Error: Delete failed")).toBeDefined();
    });

    // Should not update state or navigate
    expect(mockSetMaterials).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
