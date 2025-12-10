import { createFileRoute } from "@tanstack/react-router";
import  StaffListRoute from "../../pages/StaffList"

export const Route = createFileRoute("/staff/")({
  component: StaffListRoute,
  staticData: {
    title: "Staff",
  },
});

