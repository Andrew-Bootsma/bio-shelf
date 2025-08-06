import { useState, useEffect, Suspense, use } from "react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import getTypes from "../api/getTypes/getTypes";
import getUnitOptions from "../api/getUnitOptions/getUnitOptions";
import getMaterials from "../api/getMaterials/getMaterials";

import Header from "../components/Header/Header";
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary";

import { MaterialMetaContext, MaterialsContext } from "../contexts";

export const Route = createRootRoute({
  component: () => {
    const [materials, setMaterials] = useState([]);

    const typesPromise = useQuery({
      queryKey: ["types"],
      queryFn: () => getTypes(),
      staleTime: 1000 * 60 * 60,
    }).promise;

    const unitOptionsPromise = useQuery({
      queryKey: ["unitOptions"],
      queryFn: () => getUnitOptions(),
      staleTime: 1000 * 60 * 60,
    }).promise;

    const materialsPromise = useQuery({
      queryKey: ["materials"],
      queryFn: () => getMaterials(),
      staleTime: 1000 * 60 * 60,
    }).promise;

    const typesData = use(typesPromise);
    const unitOptionsData = use(unitOptionsPromise);
    const materialsData = use(materialsPromise);

    useEffect(() => {
      setMaterials(materialsData ?? []);
    }, [materialsData]);

    return (
      <>
        <MaterialMetaContext.Provider
          value={{
            types: typesData ?? [],
            unitOptions: unitOptionsData ?? [],
          }}
        >
          <MaterialsContext.Provider value={{ materials, setMaterials }}>
            <div className="font-mono">
              <Header />
              <ErrorBoundary>
                <Suspense fallback={<div>Loading application data...</div>}>
                  <Outlet />
                </Suspense>
              </ErrorBoundary>
            </div>
          </MaterialsContext.Provider>
        </MaterialMetaContext.Provider>
        {process.env.NODE_ENV === "development" && <TanStackRouterDevtools />}
        <ReactQueryDevtools />
      </>
    );
  },
});
