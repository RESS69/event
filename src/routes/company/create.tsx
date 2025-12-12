import CreateEvent from "@/pages/CreateEvent";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/company/create")({
  component: CreateEvent,
});
