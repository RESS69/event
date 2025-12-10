
import { createFileRoute } from "@tanstack/react-router";
import OutsourceListRoute from "../../pages/Outsource"

export const Route = createFileRoute("/outsource/")({
  component: OutsourceListRoute,
  staticData: {
    title: "OutsourceList",
  },
});

