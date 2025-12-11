import {
  createRootRoute,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import AppShell from "../components/layout/AppShell";
import { useEffect } from "react";

function RootLayout() {
  const { matches } = useRouterState();
  const activeMatch = matches[matches.length - 1];
  const title = activeMatch.staticData?.title || "EventFlow";

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <main>
      <AppShell>
        <Outlet />
      </AppShell>
      <TanStackRouterDevtools />
    </main>
  );
}

export const Route = createRootRoute({ component: RootLayout });
