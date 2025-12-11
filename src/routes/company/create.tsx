import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/company/create")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/company/create"!</div>;
}
