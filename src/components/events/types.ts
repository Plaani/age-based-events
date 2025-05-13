
export interface FamilyLimit {
  type: "fixed" | "proportional" | "unlimited";
  value: number | null;
}

export interface WaitingListEntry {
  userId: string;
  timestamp: string;
  familyMembers?: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  ageRange: string;
  category: string;
  registered: boolean;
  deadline: string;
  capacity: number;
  spotsLeft: number;
  price: number;
  familyLimit: FamilyLimit;
  waitingList: WaitingListEntry[];
}

export interface CalendarEvent {
  id: number | string;
  title: string;
  date: string;
  registered: boolean;
  targetAge?: string;
}
