import StaffList from "@/pages/StaffList";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_sidebarLayout/staff")({
  component: StaffList,
  staticData: {
    title: "StaffList",
  },
});
