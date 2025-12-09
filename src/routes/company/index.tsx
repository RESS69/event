import { createFileRoute } from "@tanstack/react-router";
import CompanyList from "../../pages/CompanyList";

export const Route = createFileRoute("/company/")({
  component: CompanyList,
  staticData: {
    title: "CompanyList",
  },
});
