

export enum RoleType {
  HOST = 'Host',
  IT_SUPPORT = 'IT Support',
  MANAGER = 'Manager',
  COORDINATOR = 'Coordinator',
  SECURITY = 'Security'
}

export enum StaffType {
  INTERNAL = 'Internal',
  OUTSOURCE = 'Outsource'
}

export type ViewType = 'dashboard' | 'event' | 'event-detail' | 'edit-event' | 'company' | 'company-detail' | 'edit-company' | 'staff' | 'outsource' | 'equipment' | 'package' | 'create-event' | 'create-company' | 'create-staff' | 'edit-staff' | 'create-outsource' | 'edit-outsource' | 'create-equipment' | 'edit-equipment' | 'create-package' | 'edit-package';

export interface StaffMember {
  id: string;
  name: string;
  englishName?: string;
  email: string;
  phone: string;
  roles: RoleType[];
  avatarUrl: string;
  isFavorite: boolean;
  status: 'Active' | 'Offline' | 'Busy';
  type?: StaffType;
  // New credentials fields
  username?: string;
  password?: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  category: string;
  total: number;
  isFavorite: boolean;
}

export interface PackageItem {
  id: string;
  name: string;
  items: string[];
  price: string;
}

export interface ClientContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  isPrimary?: boolean;
}

export interface CompanyItem {
  id: string;
  companyName: string;
  contactPerson: string; // Keep for backward compatibility/list view summary
  role: string;          // Keep for backward compatibility/list view summary
  email: string;
  phone: string;
  isFavorite: boolean;
  createdAt: string;
  
  // Detailed Fields
  contacts?: ClientContact[];
  address?: string;
  locationName?: string;
  branch?: string;
  taxId?: string;
  officeHours?: string;
  googleMapUrl?: string;
  industry?: string;
}

export type EventType = 'Online' | 'Hybrid' | 'Offline';
export type EventStatus = 'Complete' | 'Pending';

export interface EventDocument {
  id?: string;
  name: string;
  type: 'pdf' | 'xlsx' | 'docx' | 'image';
  size: string;
  url?: string;
}

export interface StaffRequirement {
  roleName: string;
  required: number;
  assigned: number;
  members: StaffMember[];
}

export interface OnlineDetails {
  platform: string;
  url: string;
  meetingId: string;
  password?: string;
  streamKey?: string;
}

export interface EventEquipmentDetail {
  id: string;
  name: string;
  inPackage: number;
  extra: number;
}

export interface EventItem {
  id: string;
  title: string; // Maps to EventName or derived
  date: string; // MeetingDate
  startTime: string; 
  endTime: string; 
  type: EventType;
  status: EventStatus;
  staffIds: string[];
  companyId: string;
  location: string;
  description: string; // Maps to Notes
  documents: EventDocument[];
  packageId?: string;
  
  // Extended fields for Detail View
  industry?: string;
  clientContacts: ClientContact[];
  staffRequirements: StaffRequirement[];
  onlineDetails?: OnlineDetails;
  equipmentList: EventEquipmentDetail[]; 
  note?: string;

  // New Fields from ER Table Events
  rehearsalDate?: string; // RehearsalInstallationDate
  officeAppointmentTime?: string; // OfficeAppointmentTime
  venueAppointmentTime?: string; // VenueAppointmentTime
  registrationOpenTime?: string; // RegistrationOpenTime
  quoteNumber?: string; // QuoteNumber
  quoteIssueDate?: string; // QuoteIssueDate
  quoteStatus?: string; // QuoteStatusID (mapped to string for UI)
  queueNumber?: number; // QueueNumber
}

export interface PaginationState {
  page: number;
  rowsPerPage: number;
  totalRows: number;
}