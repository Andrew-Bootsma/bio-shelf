import { createLazyFileRoute } from "@tanstack/react-router";
import ImportCSV from "../components/ImportCSV/ImportCSV";

export const Route = createLazyFileRoute("/import")({
  component: ImportRoute,
});

function ImportRoute() {
  return (
    <div>
      <h2>Import CSV</h2>
      <div className="mx-4 flex justify-center">
        <ImportCSV />
      </div>
    </div>
  );
}
