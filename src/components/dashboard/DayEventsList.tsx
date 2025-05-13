
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';

interface Event {
  id: number | string;
  title: string;
  date: string;
  registered: boolean;
  targetAge?: string;
  dateObj?: Date;
}

interface DayEventsListProps {
  events: Event[];
  onClose: () => void;
}

const DayEventsList: React.FC<DayEventsListProps> = ({ events, onClose }) => {
  if (events.length === 0) {
    return (
      <div className="py-6 text-center">
        <p className="text-muted-foreground">No events scheduled for this day.</p>
        <Button variant="outline" onClick={onClose} className="mt-4">
          Close
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto py-2">
      {events.map((event) => (
        <Card key={event.id} className="shadow-sm hover:shadow transition-shadow">
          <CardContent className="py-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{event.title}</h3>
                {event.dateObj && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {event.dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
                {event.targetAge && (
                  <p className="text-xs text-muted-foreground mt-1">Age: {event.targetAge}</p>
                )}
              </div>
              <Badge variant={event.registered ? "default" : "outline"}>
                {event.registered ? "Registered" : "Available"}
              </Badge>
            </div>
          </CardContent>
          <CardFooter className="pt-0 pb-3 flex justify-end">
            <Button asChild variant="ghost" size="sm">
              <Link 
                to={`/events?eventId=${event.id}`} 
                onClick={onClose}
                className="flex items-center text-primary"
              >
                {event.registered ? "View Details" : "Register"}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
      
      <div className="flex justify-between pt-3 border-t">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button asChild variant="default">
          <Link to="/events" onClick={onClose}>
            View All Events
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default DayEventsList;
