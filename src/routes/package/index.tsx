import { createFileRoute } from "@tanstack/react-router";
import PackageListRoute from "../../pages/PackageList";

export const Route = createFileRoute("/package/")({
  component: PackageListRoute,
  staticData: {
    title: "PackageList",
  },
});

