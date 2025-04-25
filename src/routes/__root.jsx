import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import Header from "../components/Header/Header";

import { MaterialMetaContext } from "../contexts";
import { useFetchMaterialMeta } from "../hooks/useMaterialMeta";

export const Route = createRootRoute({
  component: () => {
    const materialMeta = useFetchMaterialMeta();

    return (
      <>
        <MaterialMetaContext.Provider value={materialMeta}>
          <div className="font-mono">
            <Header />
            <Outlet />
          </div>
        </MaterialMetaContext.Provider>
        <TanStackRouterDevtools />
      </>
    );
  },
});
