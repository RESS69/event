import { createFileRoute } from "@tanstack/react-router";
import EquipmentList from "../../pages/EquipmentList";

export const Route = createFileRoute("/equipment/")({
  component: EquipmentList,
  staticData: {
    title: "EquipmentList",
  },
});
