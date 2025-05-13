
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FamilyLimitPopover from './FamilyLimitPopover';

interface FamilyLimit {
  type: "fixed" | "proportional" | "unlimited";
  value: number | null;
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
}

interface EventCardProps {
  event: Event;
  isRegistered: boolean;
  formatDate: (date: string) => string;
  onRegister: (event: Event) => void;
  onUnregister?: (eventId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  isRegistered, 
  formatDate, 
  onRegister, 
  onUnregister 
}) => {
  if (isRegistered) {
    return (
      <Card className="overflow-hidden event-card">
        <div className="bg-green-500 h-2"></div>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle>{event.title}</CardTitle>
            <Badge>Registered</Badge>
          </div>
          <CardDescription>{formatDate(event.date)} • {event.time}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">{event.description}</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">Location:</span>
              <span className="text-gray-600">{event.location}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">Age Range:</span>
              <span className="text-gray-600">{event.ageRange}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">Unregister By:</span>
              <span className="text-gray-600">{formatDate(event.deadline)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-between">
          <Button variant="outline">View Details</Button>
          {onUnregister && (
            <Button 
              variant="destructive"
              onClick={() => onUnregister(event.id)}
            >
              Unregister
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="overflow-hidden event-card">
      <div className="bg-brand-100 h-2"></div>
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
        <CardDescription>{formatDate(event.date)} • {event.time}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">{event.description}</p>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">Location:</span>
            <span className="text-gray-600">{event.location}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">Age Range:</span>
            <span className="text-gray-600">{event.ageRange}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">Registration Deadline:</span>
            <span className="text-gray-600">{formatDate(event.deadline)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">Price:</span>
            <span className="text-gray-600">${event.price}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">Family Limit:</span>
            <div className="flex items-center">
              <span className="text-gray-600 mr-1">
                {event.familyLimit.type === "fixed" 
                  ? `${event.familyLimit.value} members`
                  : event.familyLimit.type === "proportional"
                    ? `${event.familyLimit.value}% of capacity`
                    : "Unlimited"}
              </span>
              <FamilyLimitPopover familyLimit={event.familyLimit} />
            </div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">Availability:</span>
            <Badge variant={event.spotsLeft < 5 ? "destructive" : "outline"}>
              {event.spotsLeft === 0 ? "Full - Waiting List" : `${event.spotsLeft} spots left`}
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button 
          className="w-full"
          onClick={() => onRegister(event)}
        >
          {event.spotsLeft === 0 ? "Join Waiting List" : "Register"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
