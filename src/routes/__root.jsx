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
    const { data: typesData } = useQuery({
      queryKey: ["types"],
      queryFn: () => getTypes(),
      staleTime: 30000,
    });

    const { data: unitOptionsData } = useQuery({
      queryKey: ["unitOptions"],
      queryFn: () => getUnitOptions(),
      staleTime: 30000,
    });

    return (
      <>
        <MaterialMetaContext.Provider
          value={{ types: typesData, unitOptions: unitOptionsData }}
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
