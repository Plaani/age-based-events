
import React, { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DayEventsList from './DayEventsList';

interface Event {
  id: number | string;
  title: string;
  date: string;
  registered: boolean;
  targetAge?: string;
}

interface EventCalendarProps {
  events: Event[];
  onDateSelect?: (date: Date) => void;
  isInteractive?: boolean;
  viewMode?: 'all' | 'registered' | 'volunteer';
  linkDestination?: string;
}

const EventCalendar: React.FC<EventCalendarProps> = ({ 
  events, 
  onDateSelect,
  isInteractive = false,
  viewMode = 'all',
  linkDestination = '/events'
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventsDialog, setShowEventsDialog] = useState(false);
  
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
  
  // Handle date selection (for creating new events)
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      
      // Check if there are events on this day
      const dateStr = format(date, 'yyyy-MM-dd');
      const hasEvents = eventDates[dateStr] && eventDates[dateStr].length > 0;
      
      if (hasEvents) {
        // Show events dialog
        setShowEventsDialog(true);
      } else if (onDateSelect && isInteractive) {
        // Original handler for creating events
        onDateSelect(date);
      }
    }
  };
  
  // Custom day rendering to highlight days with events
  const renderDay = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const eventsOnDay = eventDates[dateStr] || [];
    
    if (eventsOnDay.length === 0) {
      // Gray color for dates with no events
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <span className="text-gray-500">{format(day, 'd')}</span>
        </div>
      );
    }
    
    const hasRegisteredEvent = eventsOnDay.some(event => event.registered);
    
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className={`absolute inset-2 rounded-full ${hasRegisteredEvent ? 'bg-primary/20' : 'bg-accent/50'}`} />
        <span className="relative z-10">{format(day, 'd')}</span>
      </div>
    );
  };

  // Generate the appropriate link based on the viewMode
  const getLinkWithFilter = () => {
    switch (viewMode) {
      case 'registered':
        return `${linkDestination}?tab=registered`;
      case 'volunteer':
        return `${linkDestination}?tab=volunteer`;
      default:
        return linkDestination;
    }
  };
  
  // Get the appropriate button text based on viewMode
  const getButtonText = () => {
    switch (viewMode) {
      case 'registered':
        return "View My Events";
      case 'volunteer':
        return "View Volunteer Events";
      default:
        return "View All Events";
    }
  };

  // Get events for the selected date
  const getEventsForSelectedDate = () => {
    if (!selectedDate) return [];
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return eventDates[dateStr] || [];
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
            <Link to={getLinkWithFilter()}>{getButtonText()}</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="p-2">
          <Calendar
            mode="default"
            showOutsideDays={true}
            onDayClick={handleDateSelect}
            components={{
              Day: ({ date }) => renderDay(date as Date)
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
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-200"></div>
            <span>No Events</span>
          </div>
        </div>
      </CardContent>

      {/* Dialog for showing events on selected date */}
      <Dialog open={showEventsDialog} onOpenChange={setShowEventsDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              Events on {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : ''}
            </DialogTitle>
          </DialogHeader>
          <DayEventsList 
            events={getEventsForSelectedDate()} 
            onClose={() => setShowEventsDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default EventCalendar;
