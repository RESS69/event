import { createFileRoute } from "@tanstack/react-router";
import StaffList from "../../pages/StaffList";

export const Route = createFileRoute("/staff/")({
  component: StaffList,
  staticData: {
    title: "StaffList",
  },
});
