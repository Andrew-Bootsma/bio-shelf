import { createRootRoute, Outlet } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import getTypes from "../api/getTypes";
import getUnitOptions from "../api/getUnitOptions";

import Header from "../components/Header/Header";

import { MaterialMetaContext } from "../contexts";

export const Route = createRootRoute({
  component: () => {
    const { data: typesData, isLoading: typesLoading } = useQuery({
      queryKey: ["types"],
      queryFn: () => getTypes(),
      staleTime: 1000 * 60 * 60,
    });

    const { data: unitOptionsData, isLoading: unitOptionsLoading } = useQuery({
      queryKey: ["unitOptions"],
      queryFn: () => getUnitOptions(),
      staleTime: 1000 * 60 * 60,
    });

    if (typesLoading || unitOptionsLoading) {
      return <div className="font-mono">Loading application data...</div>;
    }

    return (
      <>
        <MaterialMetaContext.Provider
          value={{
            types: typesData ?? [],
            unitOptions: unitOptionsData ?? [],
          }}
        >
          <div className="font-mono">
            <Header />
            <Outlet />
          </div>
        </MaterialMetaContext.Provider>
        <TanStackRouterDevtools />
        <ReactQueryDevtools />
      </>
    );
  },
});
