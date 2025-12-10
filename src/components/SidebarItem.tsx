import { Link, LinkProps } from "@tanstack/react-router";
import { LucideIcon } from "lucide-react";

interface SidebarItemProps {
  to: LinkProps["to"];
  label: string;
  icon: LucideIcon;
}

export const SidebarItem = ({ to, label, icon: Icon }: SidebarItemProps) => {
  return (
    <Link
      to={to}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors mt-1"
      activeProps={() => ({
        className: "bg-blue-50 text-blue-600 font-normal",
      })}
      inactiveProps={() => ({
        className: "text-gray-700 hover:bg-gray-50 opacity-60",
      })}
    >
      <Icon className="h-5 w-5" opacity={0.8} />
      <span>{label}</span>
    </Link>
  );
};
