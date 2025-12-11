import EquipmentList from "@/pages/EquipmentList";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_sidebarLayout/equipment")({
  component: EquipmentList,
  staticData: {
    title: "EquipmentList",
  },
});
