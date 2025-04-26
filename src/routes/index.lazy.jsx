import { createLazyFileRoute, Link } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div>
      <ul>
        <li>
          <Link to="/materials">Inventory</Link>
        </li>
        <li>
          <Link to="/materials/new">Add Material</Link>
        </li>
      </ul>
    </div>
  );
}
