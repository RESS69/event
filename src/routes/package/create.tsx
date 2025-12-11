import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/package/create")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/package/create"!</div>;
}
