import {
  createLazyFileRoute,
  Outlet,
  useMatches,
  useRouter,
} from "@tanstack/react-router";
import { use, useState } from "react";

import { MaterialsContext } from "../contexts";

import Modal from "../components/Modal/Modal";
import Material from "../components/Material/Material";

export const Route = createLazyFileRoute("/materials/$materialId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { materialId } = Route.useParams();
  const router = useRouter();
  const matches = useMatches();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { materials, setMaterials } = use(MaterialsContext);

  const isExactDetailRoute = matches.length === 3;
  const material = materials.find((m) => m.id === materialId);

  if (!isExactDetailRoute) {
    return <Outlet />;
  }

  if (!material) {
    return <div>Loading...</div>;
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleConfirmDelete = async () => {
    await fetch(`/api/materials/${materialId}`, {
      method: "DELETE",
    });

    setMaterials(materials.filter((m) => m.id !== materialId));
    setShowDeleteConfirm(false);
    router.navigate({ to: "/materials" });
  };

  return (
    <>
      <Material material={material} handleDelete={handleDeleteClick} />
      {showDeleteConfirm ? (
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
      ) : null}
    </>
  );
}
