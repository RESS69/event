import React, { useMemo, useState } from "react";
import {
  Save,
  Building2,
  Wifi,
  Monitor,
  Calendar,
  Clock,
  ChevronDown,
  Sun,
  Moon,
  MapPin,
  Package as PackageIcon,
  Box,
  Search,
  Users,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
} from "lucide-react";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";

import { PageHeader } from "../components/layout/PageHeader";
import { PageSection } from "../components/layout/PageSection";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";

// === types จากระบบจริง ===
import {
  StaffMember,
  RoleType,
  EquipmentItem,
  PackageItem,
  EventType,
} from "../../types";

// === mock data กลางของโปรเจกต์ (ปรับ path ให้ตรงของตัวเอง) ===
import {
  STAFF_DATA,
  OUTSOURCE_DATA,
  EQUIPMENT_DATA,
  PACKAGE_DATA,
} from "../../constants";

// ---------- Types เฉพาะของฟอร์ม ----------

type PeriodType = "Morning" | "Afternoon" | null;

type FormStaffRequirement = {
  role: string;
  count: number;
};

type ExtraEquipmentRecord = Record<string, number>;

type CreateEventValues = {
  title: string;
  company: string;
  type: EventType;
  date: string;
  startTime?: string | null;
  endTime?: string | null;
  location?: string | null;
  description?: string | null;
  period: PeriodType;
  selectedPackageId: string;
  extraEquipment: ExtraEquipmentRecord;
  staffRequirements: FormStaffRequirement[];
};

// ---------- mapping role label -> RoleType จาก enum ----------

const ROLE_TYPE_BY_LABEL: Record<string, RoleType> = {
  Host: RoleType.HOST,
  "IT Support": RoleType.IT_SUPPORT,
  Manager: RoleType.MANAGER,
  Coordinator: RoleType.COORDINATOR,
  Security: RoleType.SECURITY,
};

const AVAILABLE_ROLE_LABELS = Object.keys(ROLE_TYPE_BY_LABEL);

// staff ทั้ง internal + outsource ใช้สำหรับ suggestion
const ALL_STAFF: StaffMember[] = [...STAFF_DATA, ...OUTSOURCE_DATA];

// ---------- Zod Schema ----------

const createEventSchema: z.ZodType<CreateEventValues> = z.object({
  title: z.string().min(1, "Event name is required"),
  company: z.string().min(1, "Company is required"),
  type: z.enum(["Online", "Hybrid", "Offline"] as [
    EventType,
    EventType,
    EventType,
  ]),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().optional().nullable(),
  endTime: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  period: z.enum(["Morning", "Afternoon"]).nullable(),
  selectedPackageId: z.string().min(1, "Please select a package"),
  extraEquipment: z.record(z.number().int().nonnegative()),
  staffRequirements: z
    .array(
      z.object({
        role: z.string().min(1),
        count: z.number().int().positive(),
      })
    )
    .optional()
    .default([]),
});

// ---------- Default Values ----------

const defaultValues: CreateEventValues = {
  title: "",
  company: "",
  type: "Offline",
  date: "",
  startTime: "",
  endTime: "",
  location: "",
  description: "",
  period: null,
  selectedPackageId: PACKAGE_DATA[0]?.id ?? "",
  extraEquipment: {},
  staffRequirements: [
    { role: "Manager", count: 1 },
    { role: "Host", count: 1 },
  ],
};

// ---------- Component ----------

const CreateEvent: React.FC = () => {
  // UI-only state
  const [equipSearch, setEquipSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [newRole, setNewRole] = useState<string>("Host");
  const [newRoleCount, setNewRoleCount] = useState<number>(1);

  // ดึง category จาก EQUIPMENT_DATA จริง
  const equipmentCategories = useMemo(
    () => [
      "All",
      ...Array.from(new Set(EQUIPMENT_DATA.map((e) => e.category))).sort(),
    ],
    []
  );

  const form = useForm<CreateEventValues>({
    defaultValues,
    validators: {
      onSubmit: createEventSchema,
    },
    onSubmit: async ({ value }) => {
      // TODO: ใช้ยิง API / TanStack Query mutation จริง
      console.log("Create Event payload:", value);
    },
  });

  const isInvalid = (field: any) =>
    field.state.meta.isTouched && !field.state.meta.isValid;

  const filteredEquipment: EquipmentItem[] = useMemo(() => {
    return EQUIPMENT_DATA.filter((eq) => {
      const matchCategory =
        activeCategory === "All" || eq.category === activeCategory;
      const matchSearch =
        equipSearch.trim().length === 0 ||
        eq.name.toLowerCase().includes(equipSearch.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, equipSearch]);

  return (
    <main className="flex">
      <div className="flex min-h-0 flex-1 flex-col">
        <PageHeader
          title="Create New Event"
          description="Fill in the details to schedule a new event"
          actions={
            <Button
              variant="primary"
              size="add"
              type="submit"
              form="create-event-form"
            >
              <Save size={18} strokeWidth={2.5} />
              Create Event
            </Button>
          }
        />

        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pt-6 pb-10 lg:px-10 max-w-7xl mx-auto w-full space-y-8">
          <form
            id="create-event-form"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="space-y-8"
          >
            {/* 1. BASIC INFORMATION */}
            <PageSection>
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
                Basic Information
              </h3>

              <FieldGroup>
                {/* Event Name */}
                <div className="md:col-span-2">
                  <form.Field
                    name="title"
                    children={(field) => (
                      <Field data-invalid={isInvalid(field)}>
                        <FieldLabel htmlFor={field.name}>Event Name</FieldLabel>
                        <Input
                          id={field.name}
                          type="text"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all ${
                            isInvalid(field)
                              ? "border-red-300"
                              : "border-gray-200"
                          }`}
                          placeholder="e.g. Annual Tech Conference 2024"
                          aria-invalid={isInvalid(field)}
                        />
                        {isInvalid(field) && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                {/* Company */}
                <div>
                  <form.Field
                    name="company"
                    children={(field) => (
                      <Field data-invalid={isInvalid(field)}>
                        <FieldLabel htmlFor={field.name}>Company</FieldLabel>
                        <div className="relative">
                          <Building2
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                            size={18}
                          />
                          <Input
                            id={field.name}
                            type="text"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className={`w-full pl-10 pr-10 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all ${
                              isInvalid(field)
                                ? "border-red-300"
                                : "border-gray-200"
                            }`}
                            placeholder="Select company..."
                            aria-invalid={isInvalid(field)}
                          />
                          <ChevronDown
                            size={16}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                          />
                        </div>
                        {isInvalid(field) && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                {/* Event Type (ใช้ enum EventType จริง) */}
                <div>
                  <form.Field
                    name="type"
                    children={(field) => (
                      <Field>
                        <FieldLabel>Event Type</FieldLabel>
                        <div className="flex bg-gray-100 p-1.5 rounded-xl">
                          {(["Offline", "Hybrid", "Online"] as EventType[]).map(
                            (type) => (
                              <button
                                key={type}
                                type="button"
                                onClick={() => field.handleChange(type)}
                                onBlur={field.handleBlur}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                  field.state.value === type
                                    ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5"
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                              >
                                {type === "Offline" && <Building2 size={16} />}
                                {type === "Online" && <Wifi size={16} />}
                                {type === "Hybrid" && <Monitor size={16} />}
                                {type}
                              </button>
                            )
                          )}
                        </div>
                      </Field>
                    )}
                  />
                </div>
              </FieldGroup>
            </PageSection>

            {/* 2. SCHEDULE & LOCATION */}
            <PageSection>
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
                Schedule
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Date */}
                <div className="md:col-span-2">
                  <form.Field
                    name="date"
                    children={(field) => (
                      <Field data-invalid={isInvalid(field)}>
                        <FieldLabel htmlFor={field.name}>
                          Meeting Date
                        </FieldLabel>
                        <div className="relative">
                          <Calendar
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                            size={18}
                          />
                          <Input
                            id={field.name}
                            type="date"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none ${
                              isInvalid(field)
                                ? "border-red-300"
                                : "border-gray-200"
                            }`}
                            aria-invalid={isInvalid(field)}
                          />
                        </div>
                        {isInvalid(field) && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                {/* Start Time */}
                <div>
                  <form.Field
                    name="startTime"
                    children={(field) => (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Start Time</FieldLabel>
                        <div className="relative">
                          <Clock
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                            size={18}
                          />
                          <Input
                            id={field.name}
                            type="time"
                            value={field.state.value ?? ""}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                          />
                        </div>
                      </Field>
                    )}
                  />
                </div>

                {/* End Time */}
                <div>
                  <form.Field
                    name="endTime"
                    children={(field) => (
                      <Field>
                        <FieldLabel htmlFor={field.name}>End Time</FieldLabel>
                        <div className="relative">
                          <Clock
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                            size={18}
                          />
                          <Input
                            id={field.name}
                            type="time"
                            value={field.state.value ?? ""}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                          />
                        </div>
                      </Field>
                    )}
                  />
                </div>

                {/* Morning / Afternoon – Quick select */}
                <div>
                  <form.Field
                    name="period"
                    children={(field) => (
                      <>
                        <FieldLabel>Time Period (Quick Select)</FieldLabel>
                        <button
                          type="button"
                          onClick={() => field.handleChange("Morning")}
                          className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 group ${
                            field.state.value === "Morning"
                              ? "border-orange-500 bg-orange-50 text-orange-700 shadow-sm"
                              : "border-gray-200 bg-white text-gray-500 hover:border-orange-200 hover:bg-orange-50/30"
                          }`}
                        >
                          <Sun
                            size={20}
                            className={
                              field.state.value === "Morning"
                                ? "fill-orange-500 text-orange-500"
                                : "text-gray-400 group-hover:text-orange-400"
                            }
                          />
                          <span className="font-bold text-sm">Morning</span>
                        </button>
                      </>
                    )}
                  />
                </div>

                <div>
                  <form.Field
                    name="period"
                    children={(field) => (
                      <>
                        <label className="hidden md:block text-sm font-semibold text-transparent mb-2 select-none">
                          Period
                        </label>
                        <button
                          type="button"
                          onClick={() => field.handleChange("Afternoon")}
                          className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 group ${
                            field.state.value === "Afternoon"
                              ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm"
                              : "border-gray-200 bg-white text-gray-500 hover:border-indigo-200 hover:bg-indigo-50/30"
                          }`}
                        >
                          <Moon
                            size={20}
                            className={
                              field.state.value === "Afternoon"
                                ? "fill-indigo-500 text-indigo-500"
                                : "text-gray-400 group-hover:text-indigo-400"
                            }
                          />
                          <span className="font-bold text-sm">Afternoon</span>
                        </button>
                      </>
                    )}
                  />
                </div>
              </div>

              {/* Location + Map view */}
              <form.Field
                name="location"
                children={(field) => (
                  <div className="mt-8 pt-8 border-t border-gray-100">
                    <FieldLabel htmlFor={field.name}>Venue Location</FieldLabel>
                    <div className="flex flex-col gap-4">
                      <div className="relative">
                        <MapPin
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                        <Input
                          id={field.name}
                          type="text"
                          value={field.state.value ?? ""}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                          placeholder="เช่น BITEC Bangna, True Icon Hall, Ballroom A"
                        />
                      </div>

                      <div className="w-full">
                        <div className="relative w-full h-64 bg-slate-100 rounded-xl border border-gray-200 overflow-hidden">
                          <div
                            className="absolute inset-0 opacity-40"
                            style={{
                              backgroundImage:
                                "radial-gradient(#cbd5e1 1px, transparent 1px), radial-gradient(#cbd5e1 1px, transparent 1px)",
                              backgroundSize: "20px 20px",
                              backgroundPosition: "0 0, 10px 10px",
                            }}
                          />
                          <div className="absolute top-1/4 left-0 w-full h-4 bg-white/60" />
                          <div className="absolute top-0 left-1/3 w-4 h-full bg-white/60" />
                          <div className="absolute bottom-1/3 left-0 w-full h-3 bg-white/60 rotate-12 origin-left" />
                          <div className="absolute top-2 left-2 bg-white/80 px-2 py-1 rounded text-[10px] font-bold text-gray-500 pointer-events-none">
                            MAP VIEW
                          </div>

                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="flex flex-col items-center justify-center text-gray-400 bg-white/80 px-4 py-2 rounded-lg shadow-sm">
                              <MapPin className="w-8 h-8 mb-1 opacity-50" />
                              <span className="text-sm font-medium">
                                Map mock – hook real picker later
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {field.state.value && (
                        <p className="text-xs text-gray-500 flex items-center gap-1.5 ml-1">
                          <MapPin size={12} />
                          Current location:{" "}
                          <span className="font-mono font-medium text-gray-700">
                            {field.state.value}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                )}
              />
            </PageSection>

            {/* 3. PACKAGE (ใช้ PACKAGE_DATA จริง) */}
            <PageSection>
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
                Package
              </h3>

              <p className="text-sm text-gray-600 mb-4">
                เลือกแพ็กเกจอุปกรณ์ / บริการที่เหมาะกับงานนี้ สามารถเพิ่มอุปกรณ์
                extra ได้ในส่วน Equipment ด้านล่าง
              </p>

              <form.Field
                name="selectedPackageId"
                children={(field) => (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {PACKAGE_DATA.map((pkg: PackageItem, idx) => {
                      const isSelected = field.state.value === pkg.id;
                      const isRecommended = idx === 0; // ให้ตัวแรกเป็น recommended mock

                      return (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => field.handleChange(pkg.id)}
                          onBlur={field.handleBlur}
                          className={`relative text-left bg-white rounded-2xl border p-5 flex flex-col h-full transition-all ${
                            isSelected
                              ? "border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/10 shadow-md"
                              : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                          }`}
                        >
                          {isRecommended && (
                            <div className="absolute top-3 right-3 bg-amber-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                              <StarIcon />
                              Recommended
                            </div>
                          )}

                          <div className="flex justify-between items-start mb-4">
                            <div
                              className={`p-3 rounded-xl ${
                                isSelected
                                  ? "bg-blue-200 text-blue-700"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              <PackageIcon size={24} />
                            </div>
                            {isSelected && (
                              <div className="text-blue-600 flex items-center gap-1 bg-blue-100 px-2 py-0.5 rounded-lg">
                                <CheckCircle2
                                  size={14}
                                  className="fill-blue-100"
                                />
                                <span className="text-xs font-bold">
                                  Selected
                                </span>
                              </div>
                            )}
                          </div>

                          <h4 className="font-bold text-base text-gray-900 mb-1">
                            {pkg.name}
                          </h4>
                          <p className="text-xs text-gray-500 mb-3">
                            {/* ใช้ item แรก ๆ มาเป็น description สั้น ๆ */}
                            {pkg.items.slice(0, 2).join(" • ")}
                          </p>

                          <ul className="space-y-1.5 mb-4 flex-1">
                            {pkg.items.slice(0, 4).map((item, idx2) => (
                              <li
                                key={idx2}
                                className="text-xs text-gray-600 flex items-start gap-2"
                              >
                                <span
                                  className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${
                                    isSelected ? "bg-blue-400" : "bg-gray-300"
                                  }`}
                                />
                                {item}
                              </li>
                            ))}
                            {pkg.items.length > 4 && (
                              <li className="text-[11px] text-gray-400 italic pl-3.5">
                                + {pkg.items.length - 4} more items
                              </li>
                            )}
                          </ul>

                          <div className="flex items-baseline justify-between mt-auto">
                            <div className="text-sm font-bold text-gray-900">
                              {pkg.price}
                              <span className="text-[11px] text-gray-400 ml-1 font-normal">
                                /event
                              </span>
                            </div>
                            <div className="text-[11px] text-gray-400">
                              Tap to select
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              />
            </PageSection>

            {/* 4. EQUIPMENT (ใช้ EQUIPMENT_DATA จริง) */}
            <PageSection>
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
                Equipment
              </h3>

              <div className="flex flex-col bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm h-[420px] mb-6">
                {/* Header: Search & Category */}
                <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10 shadow-sm space-y-4">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Input
                      type="text"
                      placeholder="Search equipment items..."
                      className="pl-10"
                      value={equipSearch}
                      onChange={(e) => setEquipSearch(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs">
                    {equipmentCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3 py-1 rounded-full border transition-all flex items-center gap-1 ${
                          activeCategory === cat
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 bg-gray-50 text-gray-500 hover:border-blue-200 hover:text-blue-600"
                        }`}
                      >
                        {cat === "Audio" && <VolumeIcon />}
                        {cat === "Video" && <VideoIcon />}
                        {cat === "Lighting" && <ZapIcon />}
                        {cat === "Computer" && <LaptopIcon />}
                        {cat === "All" && <Box size={14} />}
                        <span>{cat}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Body: ใช้ extraEquipment field บวกจาก stock (total) */}
                <form.Field
                  name="extraEquipment"
                  children={(field) => (
                    <div className="flex-1 overflow-y-auto">
                      {filteredEquipment.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                          No equipment found.
                        </div>
                      ) : (
                        <ul className="divide-y divide-gray-100">
                          {filteredEquipment.map((item) => {
                            const extra = field.state.value[item.id] ?? 0;
                            const stock = item.total;
                            const required = extra; // สำหรับ create event = จำนวนที่ต้องใช้

                            const changeExtra = (delta: number) => {
                              const current = field.state.value[item.id] ?? 0;
                              const next = current + delta;
                              if (next < 0) return;
                              field.handleChange({
                                ...field.state.value,
                                [item.id]: next,
                              });
                            };

                            return (
                              <li
                                key={item.id}
                                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50/60 transition-colors"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 text-xs">
                                    {item.category === "Audio" && (
                                      <VolumeIcon />
                                    )}
                                    {item.category === "Video" && <VideoIcon />}
                                    {item.category === "Lighting" && (
                                      <ZapIcon />
                                    )}
                                    {item.category === "Computer" && (
                                      <LaptopIcon />
                                    )}
                                    {item.category !== "Audio" &&
                                      item.category !== "Video" &&
                                      item.category !== "Lighting" &&
                                      item.category !== "Computer" && (
                                        <Box size={16} />
                                      )}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-gray-900">
                                      {item.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      Stock:{" "}
                                      <span className="font-semibold text-gray-800">
                                        {stock}
                                      </span>
                                      {required > 0 && (
                                        <>
                                          {" "}
                                          • Required:{" "}
                                          <span className="font-semibold text-blue-600">
                                            {required}
                                          </span>
                                        </>
                                      )}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4">
                                  <div className="text-xs text-gray-500 text-right">
                                    <div>Required</div>
                                    <div className="text-base font-bold text-gray-900">
                                      {required}
                                    </div>
                                  </div>
                                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                                    <button
                                      type="button"
                                      onClick={() => changeExtra(-1)}
                                      disabled={extra <= 0}
                                      className={`w-8 h-8 flex items-center justify-center text-gray-500 border-r border-gray-200 hover:text-blue-600 hover:bg-gray-50 transition-colors rounded-l-lg ${
                                        extra <= 0
                                          ? "opacity-40 cursor-not-allowed hover:bg-white hover:text-gray-400"
                                          : ""
                                      }`}
                                    >
                                      <Minus size={14} />
                                    </button>
                                    <span className="w-8 text-center text-sm font-bold text-blue-600">
                                      {extra}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => changeExtra(1)}
                                      className="w-8 h-8 flex items-center justify-center text-gray-500 border-l border-gray-200 hover:text-blue-600 hover:bg-gray-50 transition-colors rounded-r-lg"
                                    >
                                      <Plus size={14} />
                                    </button>
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  )}
                />
              </div>
            </PageSection>

            {/* 5. STAFF MANAGEMENT (ใช้ STAFF_DATA + OUTSOURCE_DATA จริง) */}
            <PageSection>
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
                Staff Management
              </h3>

              <div className="flex items-start gap-3 rounded-2xl bg-blue-50 border border-blue-100 px-4 py-3 text-xs text-blue-800 mb-6">
                <AlertTriangle size={16} className="mt-0.5" />
                <p>
                  กำหนดจำนวน staff ที่ต้องใช้ในแต่ละบทบาทก่อน แล้วค่อยไปจัดตาราง
                  และเช็ค conflict ในหน้า Event Calendar / Assignment ภายหลัง
                </p>
              </div>

              <form.Field
                name="staffRequirements"
                children={(field) => {
                  const addRole = () => {
                    if (!newRole || newRoleCount <= 0) return;
                    field.handleChange([
                      ...field.state.value,
                      { role: newRole, count: newRoleCount },
                    ]);
                    setNewRole("Host");
                    setNewRoleCount(1);
                  };

                  const removeRole = (index: number) => {
                    field.handleChange(
                      field.state.value.filter((_, i) => i !== index)
                    );
                  };

                  const suggestedForRole = (roleLabel: string) => {
                    const roleType = ROLE_TYPE_BY_LABEL[roleLabel];
                    if (!roleType) return [];
                    return ALL_STAFF.filter((s) =>
                      s.roles.includes(roleType)
                    ).slice(0, 3);
                  };

                  return (
                    <>
                      {/* Add Role Controls */}
                      <div className="flex flex-col sm:flex-row gap-6 mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-200 items-start">
                        <div className="flex-1 w-full">
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-3">
                            Select Role
                          </label>
                          <select
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                          >
                            {AVAILABLE_ROLE_LABELS.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-3">
                            Count
                          </label>
                          <Input
                            type="number"
                            min={1}
                            value={newRoleCount}
                            onChange={(e) =>
                              setNewRoleCount(
                                Math.max(1, Number(e.target.value) || 1)
                              )
                            }
                            className="w-24"
                          />
                        </div>

                        <div className="flex sm:justify-end w-full sm:w-auto">
                          <button
                            type="button"
                            onClick={addRole}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium shadow-sm hover:bg-blue-700 transition-colors"
                          >
                            <Plus size={16} />
                            Add Role
                          </button>
                        </div>
                      </div>

                      {/* Roles Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {field.state.value.length > 0 ? (
                          field.state.value.map((req, index) => {
                            const suggested = suggestedForRole(req.role);
                            const isComplete = false; // ไว้ผูกกับ assignment จริงทีหลัง

                            return (
                              <div
                                key={`${req.role}-${index}`}
                                className={`rounded-xl border-2 overflow-hidden transition-all duration-200 relative h-full flex flex-col ${
                                  isComplete
                                    ? "border-green-300 bg-green-50"
                                    : "border-amber-300 bg-amber-50"
                                }`}
                              >
                                {/* Header */}
                                <div className="px-4 py-4 flex justify-between items-center border-b border-black/5 bg-white/60">
                                  <div className="flex items-center gap-3">
                                    <span className="font-bold text-gray-800 text-lg">
                                      {req.role}
                                    </span>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                      <span>Required:</span>
                                      <span className="font-bold text-gray-900">
                                        {req.count}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => removeRole(index)}
                                      className="p-2 text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </div>

                                {/* Suggested staff */}
                                <div className="px-4 py-3 flex-1 bg-white/40">
                                  {suggested.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                      {suggested.map((s) => (
                                        <span
                                          key={s.id}
                                          className="px-2.5 py-1 rounded-full bg-white/80 border border-gray-200 text-xs text-gray-700 flex items-center gap-1 shadow-sm"
                                        >
                                          <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-sm">
                                            {s.name.charAt(0)}
                                          </span>
                                          <span className="truncate max-w-[130px]">
                                            {s.name}
                                          </span>
                                        </span>
                                      ))}
                                      {ALL_STAFF.filter((s) =>
                                        s.roles.includes(
                                          ROLE_TYPE_BY_LABEL[req.role]!
                                        )
                                      ).length > suggested.length && (
                                        <span className="px-2.5 py-1 rounded-full bg-white/60 border border-dashed border-gray-300 text-[11px] text-gray-400">
                                          + more
                                        </span>
                                      )}
                                    </div>
                                  ) : (
                                    <p className="text-xs text-gray-500 italic">
                                      No staff in this role yet.
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="col-span-full py-8 text-center text-gray-400 text-sm">
                            No staff roles added yet.
                          </div>
                        )}
                      </div>
                    </>
                  );
                }}
              />
            </PageSection>
            {/* NEW SECTION: Files & Documents + Note / Brief */}
            <PageSection>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                {/* LEFT: Files & Documents */}
                <div className="flex flex-col h-full">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-blue-600 rounded-full" />
                    Files &amp; Documents
                  </h3>

                  <div className="flex-1 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 px-6 py-8 flex flex-col items-center justify-center text-center min-h-[220px]">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
                      <UploadCloud className="w-5 h-5 text-gray-500" />
                    </div>
                    <p className="text-sm font-medium text-gray-800 mb-1">
                      Drag and drop files here
                    </p>
                    <p className="text-xs text-gray-500 mb-3">
                      or{" "}
                      <button
                        type="button"
                        className="text-blue-600 font-semibold hover:underline"
                      >
                        Browse
                      </button>
                    </p>
                    <p className="text-[11px] text-gray-400">
                      Support: PDF, JPG, PNG (Max 10MB)
                    </p>
                  </div>
                </div>

                {/* RIGHT: Note / Brief (กรอบสูงเท่ากับฝั่งซ้าย) */}
                <div className="flex flex-col h-full">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-blue-600 rounded-full" />
                    Note / Brief
                  </h3>

                  <form.Field
                    name="description"
                    children={(field) => (
                      <Field className="flex-1">
                        <div className="h-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 min-h-[220px]">
                          <Textarea
                            id={field.name}
                            value={field.state.value ?? ""}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="w-full h-full bg-transparent border-none resize-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
                            placeholder="Enter any additional notes or brief for the event..."
                          />
                        </div>
                      </Field>
                    )}
                  />
                </div>
              </div>
            </PageSection>
          </form>
        </div>
      </div>
    </main>
  );
};

// ---------- small helper icons ----------

const StarIcon: React.FC = () => (
  <svg
    className="w-3 h-3"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const VolumeIcon: React.FC = () => (
  <span className="inline-flex items-center justify-center w-3 h-3">🔊</span>
);
const VideoIcon: React.FC = () => (
  <span className="inline-flex items-center justify-center w-3 h-3">🎥</span>
);
const ZapIcon: React.FC = () => (
  <span className="inline-flex items-center justify-center w-3 h-3">⚡</span>
);
const LaptopIcon: React.FC = () => (
  <span className="inline-flex items-center justify-center w-3 h-3">💻</span>
);

export default CreateEvent;
