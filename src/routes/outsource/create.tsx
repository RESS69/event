import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/outsource/create")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/outsource/create"!</div>;
}
