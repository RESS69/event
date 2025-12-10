import { createFileRoute } from "@tanstack/react-router";
import  EquipmentListRoute  from "../../pages/EquipmentList";

export const Route = createFileRoute("/equipment/")({
  component: EquipmentListRoute,
  staticData: {
    title: "EquipmentList",
  },
});

