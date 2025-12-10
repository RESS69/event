import { createFileRoute } from "@tanstack/react-router";
import OutsourceList from "../../pages/OutsourceList";

export const Route = createFileRoute("/outsource/")({
  component: OutsourceList,
  staticData: {
    title: "OutsourceList",
  },
});
