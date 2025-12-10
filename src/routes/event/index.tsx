import { createFileRoute } from "@tanstack/react-router";
import EventList from "../../pages/EventList";

export const Route = createFileRoute("/event/")({
  component: EventList,
  staticData: {
    title: "Event",
  },
});
