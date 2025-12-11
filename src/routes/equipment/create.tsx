import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/equipment/create")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/equipment/create"!</div>;
}
