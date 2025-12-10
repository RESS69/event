import { createFileRoute } from "@tanstack/react-router";
import  EventListRoute  from "../../pages/EventList";

export const Route = createFileRoute("/event/")({
  component: EventListRoute,
  staticData: {
    title: "Event",
  },
});


