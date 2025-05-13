
import React from 'react';
import EventCard from './EventCard';
import EmptyState from './EmptyState';

interface FamilyLimit {
  type: "fixed" | "proportional" | "unlimited";
  value: number | null;
}

interface WaitingListEntry {
  userId: string;
  timestamp: string;
  familyMembers?: number;
}

interface Event {
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

interface EventsListProps {
  events: Event[];
  type: 'available' | 'registered';
  formatDate: (date: string) => string;
  onRegister: (event: Event) => void;
  onUnregister?: (eventId: string) => void;
}

const EventsList: React.FC<EventsListProps> = ({ 
  events, 
  type, 
  formatDate, 
  onRegister, 
  onUnregister 
}) => {
  if (events.length === 0) {
    return <EmptyState type={type} />;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard 
          key={event.id}
          event={event}
          isRegistered={type === 'registered'}
          formatDate={formatDate}
          onRegister={onRegister}
          onUnregister={onUnregister}
        />
      ))}
    </div>
  );
};

export default EventsList;
