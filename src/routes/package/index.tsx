import { createFileRoute } from "@tanstack/react-router";
import PackageList from "../../pages/PackageList";

export const Route = createFileRoute("/package/")({
  component: PackageList,
  staticData: {
    title: "PackageList",
  },
});
