
import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Event {
  id: number | string;
  title: string;
  date: string;
  registered: boolean;
}

interface EventCalendarProps {
  events: Event[];
}

const EventCalendar: React.FC<EventCalendarProps> = ({ events }) => {
  const eventDates = useMemo(() => {
    return events.reduce((acc, event) => {
      const date = new Date(event.date);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }
      
      acc[dateStr].push({
        ...event,
        dateObj: date
      });
      
      return acc;
    }, {} as Record<string, (Event & { dateObj: Date })[]>);
  }, [events]);
  
  // Custom day rendering to highlight days with events
  const renderDay = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const eventsOnDay = eventDates[dateStr] || [];
    
    if (eventsOnDay.length === 0) {
      return undefined;
    }
    
    const hasRegisteredEvent = eventsOnDay.some(event => event.registered);
    
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className={`absolute inset-2 rounded-full ${hasRegisteredEvent ? 'bg-primary/20' : 'bg-accent/50'}`} />
        <span className="relative z-10">{format(day, 'd')}</span>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            <span>Event Calendar</span>
          </CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link to="/events">View All Events</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="p-2">
          <Calendar
            mode="default"
            showOutsideDays={true}
            components={{
              Day: ({ day }) => renderDay(day)
            }}
            className="rounded-md border mx-auto"
          />
        </div>
        <div className="mt-3 flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary/20"></div>
            <span>Your Events</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent/50"></div>
            <span>Upcoming Events</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCalendar;
