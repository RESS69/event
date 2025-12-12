import { Check, ChevronsUpDown, CircleCheckIcon, Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// ข้อมูลสมมติ (Data)
const favoriteTools = [
  { value: "Bangkok Airways", label: "Bangkok Airways" },
  { value: "Agoda Services Co., Ltd.", label: "Agoda Services Co., Ltd." },
];

const allCompany = [
  { value: "Bangkok Airways", label: "Bangkok Airways" }, // สังเกตว่า value ซ้ำกับข้างบนอาจจะมีบั๊กตอนเลือกได้ ควรเช็ค Unique ID ดีๆ นะครับ
  { value: "Agoda Services Co., Ltd.", label: "Agoda Services Co., Ltd." },
  {
    value: "Google Thailand Co., Ltd.",
    label: "Google Thailand Co., Ltd.",
  },
  { value: "notion", label: "Notion" },
  { value: "github", label: "GitHub" },
  { value: "linear", label: "Linear" },
];

interface SelectCompanyProps {
  value: string;
  onChange: (value: string) => void;
  isInvalid?: boolean;
}

const SelectCompany = ({ value, onChange, isInvalid }: SelectCompanyProps) => {
  const [open, setOpen] = useState(false);
  // ลบ const [value, setValue] = useState("") ออก เพราะเรารับจาก Props แล้ว

  // ฟังก์ชันสำหรับ handle การเลือก (ใช้ร่วมกันทั้ง Favorite และ All)
  const handleSelect = (currentValue: string) => {
    // ถ้าเลือกตัวเดิมให้ยกเลิก (ค่าว่าง) ถ้าตัวใหม่ให้ส่งค่าไป
    onChange(currentValue === value ? "" : currentValue);
    setOpen(false);
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          className={cn(
            "w-full justify-between rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-muted-foreground h-10",
            isInvalid && "border-destructive text-destructive",
            value && "text-foreground hover:text-foreground"
          )}
          role="combobox"
          variant="outline"
        >
          {value
            ? allCompany.find((item) => item.value === value)?.label ||
              favoriteTools.find((item) => item.value === value)?.label ||
              value
            : "Select Company..."}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        align="start"
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <Command>
          <CommandInput placeholder="Search companies..." />
          <CommandList>
            <CommandEmpty>No company found.</CommandEmpty>

            <CommandGroup heading="Favorites">
              {favoriteTools.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.label}
                  onSelect={() => handleSelect(item.value)}
                  className={cn(
                    "cursor-pointer rounded-lg mx-1 transition-colors",
                    "data-[selected=true]:bg-transparent data-[selected=true]:text-inherit",
                    value === item.value
                      ? "bg-primary/10 text-primary data-[selected=true]:bg-gray-200/20"
                      : "data-[selected=true]:bg-gray-200/20 data-[selected=true]:text-black/85"
                  )}
                >
                  <Star className="mr-2 size-3 fill-yellow-400 text-yellow-400 shrink-0" />
                  <span className="truncate">{item.label}</span>
                  <CircleCheckIcon
                    className={cn(
                      "ml-auto size-4 shrink-0 fill-blue-500 stroke-white",
                      value === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />

            <CommandGroup heading="All Companies">
              {allCompany
                .filter(
                  (item) =>
                    !favoriteTools.find((fav) => fav.value === item.value)
                )
                .map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.label}
                    onSelect={() => handleSelect(item.value)}
                    className={cn(
                      "cursor-pointer rounded-lg mx-1 transition-colors",
                      "data-[selected=true]:bg-transparent data-[selected=true]:text-inherit",
                      value === item.value
                        ? "bg-primary/10 text-primary data-[selected=true]:bg-gray-200/20"
                        : "data-[selected=true]:bg-gray-200/20 data-[selected=true]:text-black/85"
                    )}
                  >
                    {item.label}
                    <CircleCheckIcon
                      className={cn(
                        "ml-auto size-4 shrink-0 fill-blue-500 stroke-white",
                        value === item.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SelectCompany;
