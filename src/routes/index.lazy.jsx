import { createLazyFileRoute, Link } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div>
      <ul>
        <li>
          <Link to="/inventory">Inventory</Link>
        </li>
        <li>
          <Link to="/add-material">Add Material</Link>
        </li>
      </ul>
    </div>
  );
}
