import EventList from "@/pages/EventList";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_sidebarLayout/event")({
  component: EventList,
  staticData: {
    title: "Event",
  },
});
