import Sidebar from "@/components/Sidebar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_sidebarLayout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col w-full min-h-full overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
