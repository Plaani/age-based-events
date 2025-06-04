import { Event } from "@/components/events/types";
import { VolunteerTask } from "@/components/volunteers/VolunteerTask";

// Basic data models used by the mock database
export interface Member {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  age: number;
  membershipValid: boolean;
  familyId: string;
  relationship?: string;
  shareRegistrations?: boolean;
  sharePurchases?: boolean;
}

export interface Family {
  id: string;
  name: string;
}

export interface EventSubscription {
  id: string;
  eventId: string;
  memberId: string;
}

export type VolunteerOption = Event;

export interface VolunteerSubscription {
  id: string;
  volunteerOptionId: string;
  memberId: string;
}

// Central mock database used across pages

export { mockEvents as events } from "@/components/events/mockData";

export const volunteerTasks: VolunteerTask[] = [
  {
    id: "1",
    title: "Community Garden Clean-up",
    description: "Help clean and prepare the community garden for spring planting. Tools and refreshments provided.",
    date: new Date(2025, 5, 15),
    location: "Central Park Community Garden",
    duration: 3,
    spotsAvailable: 5,
    spotsTotal: 10,
    starsReward: 5,
    category: "Environment",
    volunteers: [
      { id: "1", name: "Robert Wilson", nationalId: "6705142345" },
      { id: "2", name: "Linda Johnson", nationalId: "7809124567" },
      { id: "3", name: "Michael Brown", nationalId: "9102056789" },
      { id: "4", name: "Sarah Davis", nationalId: "8501234567" },
      { id: "5", name: "Thomas Miller", nationalId: "9003123456" }
    ],
    createdBy: "Admin User",
    creatorId: "1",
    isPublished: true
  },
  {
    id: "2",
    title: "Food Bank Distribution",
    description: "Help sort and distribute food packages to families in need. No experience required.",
    date: new Date(2025, 5, 20),
    location: "City Food Bank",
    duration: 4,
    spotsAvailable: 3,
    spotsTotal: 8,
    starsReward: 6,
    category: "Community Service",
    volunteers: [
      { id: "1", name: "Robert Wilson", nationalId: "6705142345" },
      { id: "6", name: "Emma Clark", nationalId: "8712090123" },
      { id: "7", name: "James Wilson", nationalId: "8806121234" },
      { id: "8", name: "Emily Taylor", nationalId: "9205043456" },
      { id: "9", name: "Daniel White", nationalId: "7701023456" }
    ],
    createdBy: "Regular User",
    creatorId: "2",
    isPublished: true
  },
  {
    id: "3",
    title: "After-School Program Assistance",
    description: "Help children with homework and participate in educational activities at the community center.",
    date: new Date(2025, 5, 25),
    location: "Downtown Community Center",
    duration: 2,
    spotsAvailable: 2,
    spotsTotal: 6,
    starsReward: 4,
    category: "Education",
    volunteers: [
      { id: "2", name: "Linda Johnson", nationalId: "7809124567" },
      { id: "6", name: "Emma Clark", nationalId: "8712090123" },
      { id: "10", name: "Olivia Martinez", nationalId: "9103056789" },
      { id: "11", name: "William Anderson", nationalId: "8407089012" }
    ],
    createdBy: "Admin User",
    creatorId: "1",
    isPublished: true
  },
  {
    id: "4",
    title: "Senior Home Visit",
    description: "Spend time with elderly residents. Activities include reading, playing games, and general companionship.",
    date: new Date(2025, 6, 5),
    location: "Golden Years Residence",
    duration: 2,
    spotsAvailable: 4,
    spotsTotal: 4,
    starsReward: 3,
    category: "Healthcare",
    volunteers: [],
    createdBy: "Regular User",
    creatorId: "2",
    isPublished: true
  },
  {
    id: "5",
    title: "Community Festival Setup",
    description: "Help set up booths, decorations, and equipment for the annual community festival.",
    date: new Date(2025, 6, 10),
    location: "City Square",
    duration: 5,
    spotsAvailable: 0,
    spotsTotal: 15,
    starsReward: 7,
    category: "Event",
    volunteers: [
      { id: "1", name: "Robert Wilson", nationalId: "6705142345" },
      { id: "2", name: "Linda Johnson", nationalId: "7809124567" },
      { id: "3", name: "Michael Brown", nationalId: "9102056789" },
      { id: "4", name: "Sarah Davis", nationalId: "8501234567" },
      { id: "5", name: "Thomas Miller", nationalId: "9003123456" },
      { id: "6", name: "Emma Clark", nationalId: "8712090123" },
      { id: "7", name: "James Wilson", nationalId: "8806121234" },
      { id: "8", name: "Emily Taylor", nationalId: "9205043456" },
      { id: "9", name: "Daniel White", nationalId: "7701023456" },
      { id: "10", name: "Olivia Martinez", nationalId: "9103056789" },
      { id: "11", name: "William Anderson", nationalId: "8407089012" },
      { id: "12", name: "Sophia Garcia", nationalId: "8903124567" },
      { id: "13", name: "Benjamin Moore", nationalId: "9008076543" },
      { id: "14", name: "Ava Wilson", nationalId: "8512093456" },
      { id: "15", name: "Alexander Lee", nationalId: "8307056789" }
    ],
    createdBy: "Admin User",
    creatorId: "1",
    isPublished: false
  }
];

export const userVolunteerHistory = [
  {
    taskId: "1",
    taskTitle: "Community Garden Clean-up",
    date: new Date(2025, 5, 15),
    starsEarned: 5,
    status: "upcoming"
  },
  {
    taskId: "2",
    taskTitle: "Food Bank Distribution",
    date: new Date(2025, 5, 20),
    starsEarned: 6,
    status: "upcoming"
  },
  {
    taskId: "old-1",
    taskTitle: "Winter Clothing Drive",
    date: new Date(2025, 2, 10),
    starsEarned: 4,
    status: "completed"
  },
  {
    taskId: "old-2",
    taskTitle: "Children's Hospital Visit",
    date: new Date(2025, 4, 5),
    starsEarned: 3,
    status: "completed"
  }
];

// Families and members used across the application
export const families: Family[] = [
  { id: "101", name: "Smith Family" },
  { id: "102", name: "Johnson Family" }
];

export const members: Member[] = [
  {
    id: "1",
    name: "Emma Smith",
    firstName: "Emma",
    lastName: "Smith",
    nationalId: "7801154321",
    age: 14,
    membershipValid: true,
    familyId: "101",
    relationship: "Tütar",
    shareRegistrations: true,
    sharePurchases: false
  },
  {
    id: "2",
    name: "James Smith",
    firstName: "James",
    lastName: "Smith",
    nationalId: "1201234567",
    age: 10,
    membershipValid: true,
    familyId: "101",
    relationship: "Poeg",
    shareRegistrations: true,
    sharePurchases: true
  },
  {
    id: "3",
    name: "Sarah Johnson",
    firstName: "Sarah",
    lastName: "Johnson",
    nationalId: "7605124567",
    age: 42,
    membershipValid: true,
    familyId: "102",
    relationship: "Abikaasa",
    shareRegistrations: true,
    sharePurchases: true
  },
  {
    id: "4",
    name: "Robert Wilson",
    firstName: "Robert",
    lastName: "Wilson",
    nationalId: "6705142345",
    age: 45,
    membershipValid: false,
    familyId: "102"
  },
  {
    id: "5",
    name: "Linda Johnson",
    firstName: "Linda",
    lastName: "Johnson",
    nationalId: "7809124567",
    age: 39,
    membershipValid: true,
    familyId: "102"
  },
  {
    id: "6",
    name: "Michael Brown",
    firstName: "Michael",
    lastName: "Brown",
    nationalId: "9102056789",
    age: 50,
    membershipValid: true,
    familyId: "101"
  }
];

// Convenience export used by the Family page
export const familyMembers = members.filter(m => !!m.relationship);


export const pendingUsers = [
  {
    id: "1",
    nationalId: "9001234567",
    firstName: "Alex",
    lastName: "Thompson",
    email: "alex@example.com",
    registeredDate: "2025-04-25",
    includeFamily: true
  },
  {
    id: "2",
    nationalId: "8807121234",
    firstName: "Maria",
    lastName: "Garcia",
    email: "maria@example.com",
    registeredDate: "2025-05-01",
    includeFamily: false
  },
  {
    id: "3",
    nationalId: "7512093456",
    firstName: "John",
    lastName: "Roberts",
    email: "john@example.com",
    registeredDate: "2025-05-03",
    includeFamily: true
  }
];

export const invalidMemberships = [
  {
    id: "1",
    nationalId: "6705142345",
    name: "Robert Wilson",
    expiryDate: "2025-04-01",
    accessStatus: "Active"
  },
  {
    id: "2",
    nationalId: "7809124567",
    name: "Linda Johnson",
    expiryDate: "2025-03-15",
    accessStatus: "Active"
  },
  {
    id: "3",
    nationalId: "9102056789",
    name: "Michael Brown",
    expiryDate: "2025-04-20",
    accessStatus: "Active"
  }
];

export const adminEvents = [
  {
    id: "1",
    title: "Summer Picnic",
    date: new Date(2025, 5, 15),
    location: "Central Park",
    registrationDeadline: new Date(2025, 5, 10),
    unregistrationDeadline: new Date(2025, 5, 12),
    maxParticipants: 50,
    description: "Annual summer picnic for all members and their families",
    createdBy: "Admin",
    targetAge: "All Ages",
    participants: [
      { id: "1", name: "Robert Wilson", nationalId: "6705142345" },
      { id: "2", name: "Linda Johnson", nationalId: "7809124567" }
    ]
  },
  {
    id: "2",
    title: "Board Meeting",
    date: new Date(2025, 5, 20),
    location: "Conference Room A",
    registrationDeadline: new Date(2025, 5, 18),
    unregistrationDeadline: new Date(2025, 5, 19),
    maxParticipants: 15,
    description: "Quarterly board meeting to discuss finances and upcoming events",
    createdBy: "Michael Brown",
    targetAge: "Adults",
    participants: [
      { id: "3", name: "Michael Brown", nationalId: "9102056789" },
      { id: "1", name: "Robert Wilson", nationalId: "6705142345" }
    ]
  },
  {
    id: "3",
    title: "Children's Workshop",
    date: new Date(2025, 6, 5),
    location: "Activity Room B",
    registrationDeadline: new Date(2025, 6, 1),
    unregistrationDeadline: new Date(2025, 6, 3),
    maxParticipants: 20,
    description: "Fun activities and crafts for children aged 5-12",
    createdBy: "Linda Johnson",
    targetAge: "Children 5-12",
    participants: [
      { id: "4", name: "Sarah Davis", nationalId: "8501234567" },
      { id: "5", name: "Thomas Miller", nationalId: "9003123456" }
    ]
  }
];

// Registrations for events and volunteer tasks
export const eventSubscriptions: EventSubscription[] = [
  { id: "1", eventId: "1", memberId: "1" },
  { id: "2", eventId: "2", memberId: "4" }
];

export const volunteerOptions: VolunteerOption[] = volunteerTasks.map(task => ({
  id: task.id,
  title: task.title,
  description: task.description,
  date: task.date.toISOString().split('T')[0],
  time: '',
  location: task.location,
  ageRange: '',
  category: task.category,
  registered: false,
  deadline: '',
  capacity: task.spotsTotal,
  spotsLeft: task.spotsAvailable,
  price: 0,
  familyLimit: { type: 'unlimited', value: null },
  waitingList: []
}));

export const volunteerSubscriptions: VolunteerSubscription[] = [
  { id: "1", volunteerOptionId: "1", memberId: "2" }
];

