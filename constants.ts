import { StaffMember, RoleType, StaffType, EquipmentItem, PackageItem, CompanyItem, EventItem, EventType, EventStatus, ClientContact, StaffRequirement, EventEquipmentDetail } from './types';

const STAFF_NAMES = [
  "AKA UIR", "Sarah Jenkins", "Michael Chen", "Emily Davis", "David Wilson",
  "Jessica Wong", "Tom Hiddleston", "Amanda Smith", "Somchai Jai-dee", "Lisa Manobal",
  "Robert Downey", "Chris Evans", "Scarlett Johansson", "Mark Ruffalo", "Jeremy Renner",
  "Chris Hemsworth", "Tom Holland", "Zendaya Coleman", "Benedict C.", "Elizabeth Olsen",
  "Paul Rudd", "Brie Larson", "Samuel Jackson", "Chadwick Boseman", "Karen Gillan",
  "Dave Bautista", "Zoe Saldana", "Vin Diesel", "Bradley Cooper", "Chris Pratt",
  "Josh Brolin", "Tom Hiddleston", "Anthony Mackie", "Sebastian Stan", "Paul Bettany"
];

const OUTSOURCE_NAMES = [
  "John Contractor", "Jane Agency", "Mike Guard", "Peter Parker", "Tony Stark",
  "Steve Rogers", "Bruce Banner", "Natasha Romanoff", "Clint Barton", "Thor Odinson",
  "Wanda Maximoff", "Vision Android", "Sam Wilson", "Bucky Barnes", "Loki Laufeyson",
  "Scott Lang", "Hope Van Dyne", "T'Challa King", "Shuri Princess", "Okoye General",
  "Nick Fury", "Maria Hill", "Phil Coulson", "Carol Danvers", "Peter Quill",
  "Gamora Zen", "Drax Destroyer", "Rocket Raccoon", "Groot Tree", "Nebula Cyborg",
  "Mantis Empath", "Stephen Strange", "Wong Sorcerer", "Thanos Titan", "Hela Goddess"
];

const ROLES_POOL = [RoleType.HOST, RoleType.IT_SUPPORT, RoleType.MANAGER, RoleType.COORDINATOR, RoleType.SECURITY];

export const STAFF_DATA: StaffMember[] = STAFF_NAMES.map((name, index) => ({
  id: `${index + 1}`,
  name,
  englishName: name,
  email: `${name.toLowerCase().replace(/\s+/g, '.').slice(0, 15)}@eventflow.com`,
  phone: `0${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
  roles: [ROLES_POOL[index % 5], ...(index % 3 === 0 ? [ROLES_POOL[(index + 1) % 5]] : [])],
  avatarUrl: `https://picsum.photos/100/100?random=${index + 1}`,
  isFavorite: index % 7 === 0,
  status: index % 4 === 0 ? 'Busy' : index % 5 === 0 ? 'Offline' : 'Active',
  type: StaffType.INTERNAL
}));

export const OUTSOURCE_DATA: StaffMember[] = OUTSOURCE_NAMES.map((name, index) => ({
  id: `o${index + 1}`,
  name,
  englishName: name,
  email: `${name.toLowerCase().replace(/\s+/g, '.').slice(0, 15)}@external.com`,
  phone: `0${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
  roles: [ROLES_POOL[(index + 2) % 5]],
  avatarUrl: '',
  isFavorite: index % 8 === 0,
  status: index % 3 === 0 ? 'Busy' : 'Active',
  type: StaffType.OUTSOURCE
}));

export const EQUIPMENT_DATA: EquipmentItem[] = [
  { id: 'e1', name: 'Microphone Shure SM58', category: 'Audio', total: 50, isFavorite: true },
  { id: 'e2', name: 'MacBook Pro 16"', category: 'Computer', total: 12, isFavorite: true },
  { id: 'e3', name: 'HDMI Cable 10m', category: 'Cables', total: 100, isFavorite: false },
  { id: 'e4', name: 'Projector Epson 4K', category: 'Video', total: 8, isFavorite: false },
  { id: 'e5', name: 'Stage Light LED', category: 'Lighting', total: 24, isFavorite: true },
  { id: 'e6', name: 'Foldable Chair', category: 'Furniture', total: 300, isFavorite: false },
  { id: 'e7', name: 'Mixer Yamaha', category: 'Audio', total: 4, isFavorite: false },
  { id: 'e8', name: 'Wireless Mouse', category: 'Computer', total: 25, isFavorite: false },
  { id: 'e9', name: 'Speaker JBL', category: 'Audio', total: 16, isFavorite: true },
  { id: 'e10', name: 'Extension Cord 5m', category: 'Cables', total: 50, isFavorite: false },
  { id: 'e11', name: 'Table Rectangular', category: 'Furniture', total: 40, isFavorite: false },
  { id: 'e12', name: 'Spotlight', category: 'Lighting', total: 10, isFavorite: false },
  { id: 'e13', name: 'Camera Sony A7III', category: 'Video', total: 5, isFavorite: true },
  { id: 'e14', name: 'Tripod Manfrotto', category: 'Video', total: 15, isFavorite: false },
  { id: 'e15', name: 'Walkie Talkie', category: 'Audio', total: 30, isFavorite: false },
  { id: 'e16', name: 'Monitor Dell 27"', category: 'Computer', total: 10, isFavorite: false },
  { id: 'e17', name: 'Sofa 2-Seat', category: 'Furniture', total: 6, isFavorite: false },
  { id: 'e18', name: 'XLR Cable 5m', category: 'Cables', total: 80, isFavorite: false },
  { id: 'e19', name: 'LED Screen P3', category: 'Video', total: 20, isFavorite: true },
  { id: 'e20', name: 'Smoke Machine', category: 'Lighting', total: 2, isFavorite: false }
];

export const PACKAGE_DATA: PackageItem[] = [
  {
    id: 'p1',
    name: 'Premium Event Package',
    items: [
      '4x Wireless Microphones',
      '2x HD Projectors (4K Ready)',
      '2x MacBook Pro Laptops',
      '1x Professional Sound System',
      '1x LED Screen 3x2m',
      '8x Staff Members (Uniformed)',
      '1x Full Technical Support'
    ],
    price: '$2,500'
  },
  {
    id: 'p2',
    name: 'Standard Conference',
    items: [
      '2x Wireless Microphones',
      '1x HD Projector',
      '2x Laptops',
      '1x LED Screen 3x2m',
      '4x Staff Members'
    ],
    price: '$1,200'
  },
  {
    id: 'p3',
    name: 'Basic Meeting Setup',
    items: [
      '1x Microphone',
      '1x Projector Screen',
      '1x Laptop',
      '2x Staff Members'
    ],
    price: '$500'
  },
  {
    id: 'p4',
    name: 'Wedding Essentials',
    items: [
      '4x Speakers JBL',
      '1x DJ Mixer Console',
      '2x Wireless Microphones',
      '1x Mood Lighting Set',
      '1x Smoke Machine',
      '4x Technical Staff'
    ],
    price: '$1,800'
  },
  {
    id: 'p5',
    name: 'Outdoor Concert Mini',
    items: [
      'Line Array Sound System',
      'Full Stage Lighting Rig',
      'LED Backdrop 4x3m',
      'Generator 50kVA',
      '10x Security Staff',
      '6x Technical Crew'
    ],
    price: '$4,200'
  }
];

export const COMPANY_DATA: CompanyItem[] = [
  {
    id: 'c1',
    companyName: 'Google Thailand Co., Ltd.',
    contactPerson: 'John Smith',
    role: 'Event Coordinator',
    email: 'john.smith@google.com',
    phone: '02-123-4567',
    isFavorite: true,
    createdAt: '2023-01-15T09:00:00Z',
    
    // Detailed Data
    industry: 'Technology & Software',
    locationName: 'ปาร์คเวนเชอร์ อีโคเพล็กซ์ (Park Ventures Ecoplex)',
    address: '14th Floor ปาร์คเวนเชอร์ อีโคเพล็กซ์ 57 ถ. วิทยุ แขวงลุมพินี เขตปทุมวัน กรุงเทพมหานคร 10330',
    officeHours: 'เปิดอยู่ · ปิดเวลา 18:30',
    contacts: [
      { id: 'ct1', name: 'John Smith', role: 'Event Coordinator', phone: '02-123-456789', email: 'john.smith@abc.com', isPrimary: true },
      { id: 'ct2', name: 'Sebastian jr', role: 'Event Coordinator', phone: '02-123-456789', email: 'Sebastian.JR@abc.com', isPrimary: false },
      { id: 'ct3', name: 'Jane Doe', role: 'Event Coordinator', phone: '02-123-45678', email: 'jane.doe@abc.com', isPrimary: false },
    ]
  },
  {
    id: 'c2',
    companyName: 'Siam Paragon Retail',
    contactPerson: 'Somsri Jai-dee',
    role: 'Marketing Manager',
    email: 'somsri.j@paragon.co.th',
    phone: '02-610-8000',
    isFavorite: false,
    createdAt: '2023-02-20T14:30:00Z',
    industry: 'Retail & Shopping',
    locationName: 'Siam Paragon',
    address: '991 Rama I Rd, Pathum Wan, Bangkok 10330',
    contacts: [
      { id: 'ct1', name: 'Somsri Jai-dee', role: 'Marketing Manager', phone: '02-610-8000', email: 'somsri.j@paragon.co.th', isPrimary: true }
    ]
  },
  {
    id: 'c3',
    companyName: 'Toyota Motor Thailand',
    contactPerson: 'Kenji Sato',
    role: 'Public Relations',
    email: 'k.sato@toyota.co.th',
    phone: '02-386-1000',
    isFavorite: true,
    createdAt: '2023-03-10T11:15:00Z',
    industry: 'Automotive',
    address: '186/1 Moo 1, Old Railway Road, Samrong Tai, Phra Pradaeng, Samut Prakan 10130'
  },
  {
    id: 'c4',
    companyName: 'Central Pattana PLC',
    contactPerson: 'Amanda Lewis',
    role: 'Operations Director',
    email: 'amanda.l@cpn.co.th',
    phone: '02-021-9999',
    isFavorite: false,
    createdAt: '2023-01-05T16:45:00Z',
    industry: 'Real Estate'
  },
  {
    id: 'c5',
    companyName: 'Kasikornbank PCL',
    contactPerson: 'Nawat P.',
    role: 'Corporate Comms',
    email: 'nawat.p@kbank.com',
    phone: '02-888-8888',
    isFavorite: false,
    createdAt: '2023-04-01T10:00:00Z',
    industry: 'Banking & Finance'
  },
  {
    id: 'c6',
    companyName: 'Agoda Services Co., Ltd.',
    contactPerson: 'Sarah Connor',
    role: 'HR Manager',
    email: 'sarah.c@agoda.com',
    phone: '02-625-9100',
    isFavorite: true,
    createdAt: '2023-05-12T13:20:00Z',
    industry: 'Technology & Travel'
  },
  {
    id: 'c7',
    companyName: 'SCG (Siam Cement Group)',
    contactPerson: 'Wichai T.',
    role: 'Procurement Head',
    email: 'wichai.t@scg.com',
    phone: '02-586-3333',
    isFavorite: false,
    createdAt: '2023-02-28T09:45:00Z',
    industry: 'Construction & Materials'
  },
  {
    id: 'c8',
    companyName: 'Advanced Info Service (AIS)',
    contactPerson: 'Lisa B.',
    role: 'Event Specialist',
    email: 'lisa.b@ais.co.th',
    phone: '02-029-5000',
    isFavorite: false,
    createdAt: '2023-06-15T15:30:00Z',
    industry: 'Telecommunications'
  },
  {
    id: 'c9',
    companyName: 'LINE Company (Thailand)',
    contactPerson: 'James Brown',
    role: 'Brand Manager',
    email: 'james.b@linecorp.com',
    phone: '02-111-2222',
    isFavorite: true,
    createdAt: '2023-03-22T11:00:00Z',
    industry: 'Technology & Media'
  },
  {
    id: 'c10',
    companyName: 'True Corporation',
    contactPerson: 'Somchai K.',
    role: 'Marketing Executive',
    email: 'somchai.k@true.co.th',
    phone: '1242',
    isFavorite: false,
    createdAt: '2023-01-20T08:30:00Z',
    industry: 'Telecommunications'
  },
  {
    id: 'c11',
    companyName: 'Minor International',
    contactPerson: 'Emily White',
    role: 'Hotel Manager',
    email: 'emily.w@minor.com',
    phone: '02-365-7500',
    isFavorite: false,
    createdAt: '2023-07-05T14:10:00Z',
    industry: 'Hospitality & Food'
  },
  {
    id: 'c12',
    companyName: 'Thai Beverage PLC',
    contactPerson: 'Arthit R.',
    role: 'Sales Director',
    email: 'arthit.r@thaibev.com',
    phone: '02-785-5555',
    isFavorite: false,
    createdAt: '2023-04-18T10:50:00Z',
    industry: 'Food & Beverage'
  },
  {
    id: 'c13',
    companyName: 'Bangkok Airways',
    contactPerson: 'Nancy Drew',
    role: 'Partnership Manager',
    email: 'nancy.d@bangkokair.com',
    phone: '1771',
    isFavorite: true,
    createdAt: '2023-05-30T09:15:00Z',
    industry: 'Airlines & Aviation'
  },
  {
    id: 'c14',
    companyName: 'Lazada Thailand',
    contactPerson: 'Jack Ma',
    role: 'Logistics Lead',
    email: 'jack.m@lazada.co.th',
    phone: '02-018-0000',
    isFavorite: false,
    createdAt: '2023-02-14T13:00:00Z',
    industry: 'E-commerce'
  },
  {
    id: 'c15',
    companyName: 'Shopee Thailand',
    contactPerson: 'Chris Sea',
    role: 'Category Manager',
    email: 'chris.s@shopee.co.th',
    phone: '02-017-8399',
    isFavorite: false,
    createdAt: '2023-06-01T16:20:00Z',
    industry: 'E-commerce'
  }
];

// Helper to generate random date in current or next month
const getRandomDate = (offsetMonths = 0) => {
  const date = new Date();
  date.setMonth(date.getMonth() + offsetMonths);
  const day = Math.floor(Math.random() * 28) + 1;
  date.setDate(day);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const dateDay = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${dateDay}`;
};

const EVENT_TYPES: EventType[] = ['Online', 'Hybrid', 'Offline'];
const LOCATIONS = [
    'Main Conference Hall, Building A',
    'Meeting Room 101, Tower B',
    'Grand Ballroom, Hotel Lux',
    'Virtual Studio 3',
    'Outdoor Pavilion, Central Park'
];

// Generate Mock Contacts
const getMockContacts = (companyName: string): ClientContact[] => {
  const base = companyName.split(' ')[0].toLowerCase();
  return [
    { id: 'c1', name: 'K. Somsak', role: 'Coordinator', phone: '081-234-5678', email: `somsak@${base}.com` },
    { id: 'c2', name: 'Ms. Alice', role: 'Marketing Director', phone: '089-999-8888', email: `alice@${base}.com` },
    { id: 'c3', name: 'Mr. John Smith', role: 'Technical Lead', phone: '081-555-0199', email: `john.s@${base}.com` },
  ];
};

// Generate Mock Requirements
const getMockRequirements = (staffIds: string[], status: EventStatus): StaffRequirement[] => {
  const requirements: StaffRequirement[] = [
    { roleName: 'Project Manager', required: 1, assigned: 0, members: [] },
    { roleName: 'Host / MC', required: 2, assigned: 0, members: [] },
    { roleName: 'Sound Engineer', required: 2, assigned: 0, members: [] },
    { roleName: 'Lighting Team', required: 3, assigned: 0, members: [] },
    { roleName: 'Security', required: 4, assigned: 0, members: [] },
  ];

  staffIds.forEach(id => {
    const member = STAFF_DATA.find(s => s.id === id) || OUTSOURCE_DATA.find(s => s.id === id);
    if (member) {
       const reqIndex = Math.floor(Math.random() * 5);
       requirements[reqIndex].members.push({ 
         ...member
       });
       requirements[reqIndex].assigned++;
    }
  });
  return requirements;
};

// Generate Mock Equipment List
const getMockEquipmentDetails = (): EventEquipmentDetail[] => {
  return [
    { id: '1', name: 'Wireless Microphones', inPackage: 4, extra: 2 },
    { id: '2', name: 'HD Projectors', inPackage: 2, extra: 0 },
    { id: '3', name: 'Laptops', inPackage: 2, extra: 0 },
    { id: '4', name: 'Professional Sound System', inPackage: 1, extra: 0 },
    { id: '5', name: 'LED Screen 3x2m', inPackage: 1, extra: 0 },
    { id: '6', name: 'PC Screen', inPackage: 0, extra: 1 },
  ];
};

export const EVENT_DATA: EventItem[] = Array.from({ length: 50 }).map((_, index) => {
  const type = EVENT_TYPES[index % 3];
  
  let date = getRandomDate(index % 2);
  let startTime = '';
  let endTime = '';
  let staffIds: string[] = [];
  const company = COMPANY_DATA[index % COMPANY_DATA.length];
  let status: EventStatus = index % 5 === 0 ? 'Pending' : 'Complete';

  // Override dates for specific indices to satisfy request
  const targetDays = [8, 9, 11, 13, 14, 15];
  if (index < targetDays.length) {
    const today = new Date();
    // Use current month/year to ensure they appear in current view
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(targetDays[index]).padStart(2, '0');
    date = `${year}-${month}-${day}`;
    status = 'Pending'; // Ensure they are pending for dashboard visibility
  }

  const staffCount = Math.floor(Math.random() * 5) + 1;
  staffIds = STAFF_DATA.slice(index % 10, (index % 10) + staffCount).map(s => s.id);
  const startHour = Math.floor(Math.random() * 9) + 9; 
  const duration = Math.floor(Math.random() * 4) + 1; 
  startTime = `${startHour.toString().padStart(2, '0')}:00`;
  endTime = `${(startHour + duration).toString().padStart(2, '0')}:00`;
  
  return {
    id: `evt-${index + 1}`,
    title: index % 2 === 0 ? `Team Building ${index + 1}` : (index % 3 === 0 ? `Product Launch ${index + 1}` : (index % 5 === 0 ? `Conference ${index + 1}` : `Workshop ${index + 1}`)),
    date,
    startTime,
    endTime,
    type,
    status,
    staffIds,
    companyId: company.id,
    location: LOCATIONS[index % LOCATIONS.length],
    description: 'A comprehensive session focusing on strategic alignment and operational excellence for the upcoming quarter.',
    packageId: PACKAGE_DATA[index % PACKAGE_DATA.length].id,
    documents: [
        { name: 'Event Plan.pdf', type: 'pdf', size: '2.4 MB' },
        { name: 'Equipment List.xlsx', type: 'xlsx', size: '125 KB' },
        { name: 'Staff Schedule.pdf', type: 'pdf', size: '1.1 MB' }
    ],
    // Detailed Fields
    industry: 'Technology & Software',
    clientContacts: getMockContacts(company.companyName),
    staffRequirements: getMockRequirements(staffIds, status),
    equipmentList: getMockEquipmentDetails(),
    onlineDetails: type !== 'Offline' ? {
        platform: 'Zoom Webinar',
        url: 'https://zoom.us/j/9876543210',
        meetingId: '987 6543 210',
        password: 'secure-pass',
        streamKey: 'rtmp://a.rtmp.youtube.com/live2/abcd-1234-efgh-5678'
    } : undefined,
    note: 'Client requested extra microphones for Q&A session. Please ensure all equipment is tested 1 hour before the event starts.'
  };
});