import { createFileRoute } from "@tanstack/react-router";
import  EventListRoute  from "../../pages/CompanyList";

export const Route = createFileRoute("/event/")({
  component: EventListRoute,
  staticData: {
    title: "Event",
  },
});


