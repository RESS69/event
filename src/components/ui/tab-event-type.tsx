import { Building2, Monitor, Wifi } from "lucide-react";
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface TabEventTypeProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function TabEventType({
  value,
  onChange,
  className,
}: TabEventTypeProps) {
  return (
    <Tabs
      value={value}
      onValueChange={onChange}
      className={cn("w-full", className)}
    >
      <TabsList
        className="grid w-full grid-cols-3 bg-gray-100"
        variant="select"
      >
        <TabsTab
          value="offline"
          className="data-active:text-primary text-muted-foreground gap-2"
        >
          <Building2 className="size-4" />
          Offline
        </TabsTab>

        <TabsTab
          value="hybrid"
          className="data-active:text-primary text-muted-foreground gap-2"
        >
          <Monitor className="size-4" />
          Hybrid
        </TabsTab>

        <TabsTab
          value="online"
          className="data-active:text-primary text-muted-foreground gap-2"
        >
          <Wifi className="size-4" />
          Online
        </TabsTab>
      </TabsList>
    </Tabs>
  );
}
