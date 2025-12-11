import OutsourceList from "@/pages/OutsourceList";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_sidebarLayout/outsource")({
  component: OutsourceList,
  staticData: {
    title: "OutsourceList",
  },
});
