
import { Event } from './types';

export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Laste jalgpalliturniir",
    description: "Põnev jalgpalliturniir 8-12 aastastele lastele. Turniir toimub kunstmurul ja võistelda saavad kõik oskustasemed.",
    date: "2025-01-15",
    time: "10:00",
    location: "Tartu Spordihoone",
    ageRange: "8-12",
    category: "Sports",
    registered: false,
    deadline: "2025-01-10",
    capacity: 40,
    spotsLeft: 12,
    price: 15,
    familyLimit: {
      type: "fixed",
      value: 3
    },
    waitingList: []
  },
  {
    id: "2",
    title: "Perekonna kunstiõhtu",
    description: "Loov kunstiõhtu kogu perele. Õpime akvarellmaali põhitõdesid ja loome koos perekonnapildi.",
    date: "2025-01-18",
    time: "18:00",
    location: "Tartu Kunstikool",
    ageRange: "Kõik vanused",
    category: "Arts",
    registered: true,
    deadline: "2025-01-15",
    capacity: 20,
    spotsLeft: 8,
    price: 25,
    familyLimit: {
      type: "unlimited",
      value: null
    },
    waitingList: []
  },
  {
    id: "3",
    title: "Teaduskeskuse ekskursioon",
    description: "Hariduslik ekskursioon AHHAA teaduskeskusesse. Käed-külge teaduse maailm lastele ja täiskasvanutele.",
    date: "2025-01-22",
    time: "14:00",
    location: "AHHAA Teaduskeskus",
    ageRange: "6+",
    category: "Education",
    registered: false,
    deadline: "2025-01-20",
    capacity: 30,
    spotsLeft: 5,
    price: 12,
    familyLimit: {
      type: "proportional",
      value: 25
    },
    waitingList: [
      {
        userId: "user1",
        timestamp: "2025-01-10T10:00:00Z",
        familyMembers: 3
      }
    ]
  },
  {
    id: "4",
    title: "Lauamängude õhtu",
    description: "Seltskondlik lauamängude õhtu täiskasvanutele. Mängime klassikalisi ja uuemaid lauamänge.",
    date: "2025-01-25",
    time: "19:00",
    location: "Tartu Kultuurikeskus",
    ageRange: "18+",
    category: "Games",
    registered: false,
    deadline: "2025-01-24",
    capacity: 25,
    spotsLeft: 0,
    price: 8,
    familyLimit: {
      type: "fixed",
      value: 2
    },
    waitingList: []
  },
  {
    id: "5",
    title: "Koosteöö õpituba",
    description: "Interaktiivne õpituba peredele, kus õpime koostööoskusi ja lahendame koos ülesandeid.",
    date: "2025-01-28",
    time: "16:00",
    location: "Tartu Rahvamaja",
    ageRange: "10+",
    category: "Social",
    registered: true,
    deadline: "2025-01-26",
    capacity: 18,
    spotsLeft: 10,
    price: 20,
    familyLimit: {
      type: "unlimited",
      value: null
    },
    waitingList: []
  }
];
