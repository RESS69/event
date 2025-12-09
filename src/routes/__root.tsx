// import {
//   Outlet,
//   createRootRoute,
//   useRouter,
//   useRouterState,
// } from "@tanstack/react-router";
// import { Sidebar, type SidebarView } from "../components/Sidebar";
// import { AppShell } from "../components/layout/AppShell";

// function pathToView(pathname: string): SidebarView {
//   if (pathname.startsWith("/event")) return "event";
//   if (pathname.startsWith("/company")) return "company";
//   if (pathname.startsWith("/staff")) return "staff";
//   if (pathname.startsWith("/outsource")) return "outsource";
//   if (pathname.startsWith("/equipment")) return "equipment";
//   if (pathname.startsWith("/package")) return "package";
//   return "dashboard";
// }

// function RootLayout() {
//   const router = useRouter();
//   const { location } = useRouterState();

//   const currentView = pathToView(location.pathname);

//   return (
//     <AppShell
//       sidebar={
//         <Sidebar
//           currentView={currentView}
//           onNavigate={(view) =>
//             router.navigate({ to: view === "dashboard" ? "/" : `/${view}` })
//           }
//         />
//       }
//     >
//       {/* เนื้อหาทุกหน้าจะถูก render ผ่าน Outlet */}
//       <Outlet />
//     </AppShell>
//   );
// }

// export const Route = createRootRoute({
//   component: RootLayout,
// });

import {
  createRootRoute,
  Link,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import AppShell from "../components/layout/AppShell";
import Sidebar from "../components/Sidebar";
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
