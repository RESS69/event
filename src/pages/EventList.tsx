import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Search,
  Plus,
  Users,
  Building2,
  CalendarDays,
  Check,
} from "lucide-react";

import { PageHeader } from "../components/layout/PageHeader";
import { PageSection } from "../components/layout/PageSection";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import {
  FilterMultiSelect,
  type FilterOption,
} from "@/components/ui/filter-multi-select";

// mock data (เปลี่ยนทีหลังได้)
const staffOptions: FilterOption[] = [
  { value: "alice", label: "Alice", description: "Host" },
  { value: "bob", label: "Bob", description: "IT Support" },
  { value: "charlie", label: "Charlie" },
  { value: "john", label: "John" },
];

const companyOptions: FilterOption[] = [
  { value: "acme", label: "Acme Inc." },
  { value: "globex", label: "Globex Corp." },
];

const eventTypeOptions: FilterOption[] = [
  { value: "online", label: "Online" },
  { value: "onsite", label: "On-site" },
  { value: "webinar", label: "Webinar" },
];

const statusOptions: FilterOption[] = [
  { value: "pending", label: "Pending" },
  { value: "complete", label: "Complete" },
  { value: "cancelled", label: "Cancelled" },
];

const EventList = () => {
  const totalEvent = 15;
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [staffFilter, setStaffFilter] = useState<string[]>([]);
  const [companyFilter, setCompanyFilter] = useState<string[]>([]);
  const [eventTypeFilter, setEventTypeFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  return (
    <>
      {/* Header บนสุด */}
      <PageHeader
        title="Event"
        count={totalEvent}
        countLabel="Event"
        actions={
          <Button
            variant="primary"
            size="add"
            onClick={() =>
              navigate({
                to: "/event/create",
              })
            }
          >
            <Plus size={18} strokeWidth={2.5} />
            Create Event
          </Button>
        }
      />

      {/* Tabs + Status chips + Content */}
      <Tabs defaultValue="calendar" className="flex flex-1 flex-col">
        {/* แถบด้านบน: TabsList + status ด้านขวา */}
        <div className="px-6 pb-1 pt-6">
          <div className="flex items-center justify-between">
            {/* ซ้าย: Tabs */}
            <TabsList>
              <TabsTab value="calendar">Calendar View</TabsTab>
              <TabsTab value="daily">Daily View</TabsTab>
            </TabsList>

            {/* ขวา: status chips */}
            <div className="inline-flex items-center gap-3 rounded-md border border-gray-100 bg-white px-3 py-1 text-xs font-medium text-gray-600 shadow-sm">
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-yellow-400" />
                Pending
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Complete
              </span>
            </div>
          </div>
        </div>

        {/* 🔹 แถว Search + Filter 4 อัน แบบในรูป */}
        <div className="px-6 pt-3 pb-2">
          <div className="flex items-center">
            <div className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm">
              {/* ซ้าย: search box พื้นหลังเทาอ่อน */}
              <div className="flex flex-1 items-center gap-2 rounded-xl bg-slate-50 px-3 py-1">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search events..."
                  className="h-8 flex-1 border-none bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                />
              </div>

              {/* เส้นแบ่งแนวตั้ง */}
              <div className="h-6 w-px bg-gray-200" />

              {/* ปุ่ม Filters */}
              <FilterMultiSelect
                title="Staff"
                icon={Users}
                options={staffOptions}
                selected={staffFilter}
                onChange={setStaffFilter}
              />
              <FilterMultiSelect
                title="Company"
                icon={Building2}
                options={companyOptions}
                selected={companyFilter}
                onChange={setCompanyFilter}
              />
              <FilterMultiSelect
                title="Event Type"
                icon={CalendarDays}
                options={eventTypeOptions}
                selected={eventTypeFilter}
                onChange={setEventTypeFilter}
              />
              <FilterMultiSelect
                title="Status"
                icon={Check}
                options={statusOptions}
                selected={statusFilter}
                onChange={setStatusFilter}
                align="end"
              />
            </div>
          </div>
        </div>

        {/* เนื้อหาแต่ละ tab */}
        <PageSection>
          <TabsPanel value="calendar">
            <p className="text-sm text-gray-700">
              ตอนนี้อยู่ในโหมด{" "}
              <span className="font-medium">Calendar View</span> (เดี๋ยวค่อยเอา
              calendar component มาวางตรงนี้)
            </p>
          </TabsPanel>

          <TabsPanel value="daily">
            <p className="text-sm text-gray-700">
              ตอนนี้อยู่ในโหมด <span className="font-medium">Daily View</span>{" "}
              (พื้นที่สำหรับ table / list รายวัน)
            </p>
          </TabsPanel>
        </PageSection>
      </Tabs>
    </>
  );
};

export default EventList;
