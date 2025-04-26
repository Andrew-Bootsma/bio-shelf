import {
  createFileRoute,
  Link,
  Outlet,
  useMatches,
} from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import getMaterial from "../api/getMaterial";

export const Route = createFileRoute("/materials/$materialId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { materialId: id } = Route.useParams();
  const matches = useMatches();
  const isExactDetailRoute = matches.length === 3;

  const { data, isLoading } = useQuery({
    queryKey: ["material", id],
    queryFn: () => getMaterial(id),
    staleTime: 30000,
    enabled: isExactDetailRoute,
  });

  if (!isExactDetailRoute) {
    return <Outlet />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {data.name}{" "}
      <Link to="/materials/$materialId/edit" params={{ materialId: id }}>
        Edit
      </Link>
    </div>
  );
}
