
import { Event } from './types';

// Mock events data with properly typed family limitations and waiting list status
export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Summer Sports Camp",
    description: "A week-long sports camp focusing on team sports and outdoor activities.",
    date: "2025-06-15",
    time: "10:00 AM - 3:00 PM",
    location: "City Sports Complex",
    ageRange: "8-12",
    category: "Sports",
    registered: true,
    deadline: "2025-05-30",
    capacity: 30,
    spotsLeft: 12,
    price: 75,
    familyLimit: {
      type: "fixed",
      value: 2
    },
    waitingList: []
  },
  {
    id: "2",
    title: "Coding Workshop for Teens",
    description: "Learn the basics of programming and create your own game.",
    date: "2025-05-22",
    time: "4:00 PM - 6:00 PM",
    location: "Tech Learning Center",
    ageRange: "13-17",
    category: "Education",
    registered: false,
    deadline: "2025-05-15",
    capacity: 20,
    spotsLeft: 5,
    price: 45,
    familyLimit: {
      type: "proportional",
      value: 25
    },
    waitingList: []
  },
  {
    id: "3",
    title: "Family Fun Day",
    description: "A day full of activities for the whole family including games, food, and entertainment.",
    date: "2025-06-01",
    time: "11:00 AM - 5:00 PM",
    location: "Community Park",
    ageRange: "All ages",
    category: "Social",
    registered: false,
    deadline: "2025-05-25",
    capacity: 100,
    spotsLeft: 45,
    price: 30,
    familyLimit: {
      type: "unlimited",
      value: null
    },
    waitingList: []
  },
  {
    id: "4",
    title: "Music Workshop for Kids",
    description: "Introduction to musical instruments and basic music theory.",
    date: "2025-06-10",
    time: "2:00 PM - 4:00 PM",
    location: "Youth Music Academy",
    ageRange: "6-10",
    category: "Arts",
    registered: false,
    deadline: "2025-06-01",
    capacity: 15,
    spotsLeft: 8,
    price: 50,
    familyLimit: {
      type: "fixed",
      value: 3
    },
    waitingList: []
  },
  {
    id: "5",
    title: "Senior Citizens Chess Tournament",
    description: "A friendly chess tournament for seniors with prizes and refreshments.",
    date: "2025-05-28",
    time: "10:00 AM - 1:00 PM",
    location: "Community Center",
    ageRange: "65+",
    category: "Games",
    registered: false,
    deadline: "2025-05-20",
    capacity: 24,
    spotsLeft: 0,
    price: 25,
    familyLimit: {
      type: "fixed",
      value: 1
    },
    waitingList: []
  }
];
