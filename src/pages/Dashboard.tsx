
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, Users, CheckCircle2, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import EventCalendar from "@/components/dashboard/EventCalendar";

// Mock data
const upcomingEvents = [
  {
    id: 1,
    title: "Summer Sports Camp",
    date: "2025-06-15",
    time: "10:00 AM",
    ageRange: "8-12",
    registered: true,
    deadline: "2025-05-30"
  },
  {
    id: 2,
    title: "Coding Workshop for Teens",
    date: "2025-05-22",
    time: "4:00 PM",
    ageRange: "13-17",
    registered: false,
    deadline: "2025-05-15"
  },
  {
    id: 3,
    title: "Family Fun Day",
    date: "2025-06-01",
    time: "11:00 AM",
    ageRange: "All ages",
    registered: false,
    deadline: "2025-05-25"
  }
];

const familyMembers = [
  { id: 1, name: "Emma Smith", age: 14, relationship: "Daughter" },
  { id: 2, name: "James Smith", age: 10, relationship: "Son" },
  { id: 3, name: "Sarah Johnson", age: 42, relationship: "Spouse" }
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  const today = new Date();
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {user.firstName}!</h1>
          <p className="text-gray-500">
            Here's what's happening with your events and family.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Your Events</CardTitle>
              <CardDescription>
                Upcoming events and activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingEvents.filter(e => e.registered).length}</div>
              <p className="text-sm text-gray-500">registered events</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/events">View All Events</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Family</CardTitle>
              <CardDescription>
                Your family members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{familyMembers.length}</div>
              <p className="text-sm text-gray-500">family members</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/family">Manage Family</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Deadlines</CardTitle>
              <CardDescription>
                Upcoming registration deadlines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {upcomingEvents.filter(e => !e.registered && new Date(e.deadline) > today).length}
              </div>
              <p className="text-sm text-gray-500">approaching deadlines</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/events">View Deadlines</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Event Calendar */}
        <div className="grid gap-6 md:grid-cols-2">
          <EventCalendar events={upcomingEvents} />

          {/* Family Members */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>Family Members</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {familyMembers.length > 0 ? (
                  familyMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                      <div className="space-y-1">
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-gray-500">
                          {member.relationship} • Age: {member.age}
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        View Events
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    No family members added
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/family">Manage Family</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              <span>Upcoming Events</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div className="space-y-1">
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-gray-500">
                        {formatDate(event.date)} at {event.time}
                      </div>
                      <div className="flex gap-2 items-center mt-1">
                        <Badge variant={event.registered ? "default" : "outline"}>
                          {event.registered ? "Registered" : "Not Registered"}
                        </Badge>
                        <span className="text-xs text-gray-500">Age: {event.ageRange}</span>
                      </div>
                    </div>
                    <Button size="sm">
                      {event.registered ? "View Details" : "Register"}
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  No upcoming events
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button variant="outline" className="w-full" asChild>
              <Link to="/events">View All Events</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>Upcoming Deadlines</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents
                .filter(event => !event.registered && new Date(event.deadline) > today)
                .map((event) => (
                  <div key={event.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div className="space-y-1">
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-gray-500">
                        Registration deadline: {formatDate(event.deadline)}
                      </div>
                      <div className="text-xs text-gray-500">Event date: {formatDate(event.date)}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm">Register</Button>
                    </div>
                  </div>
                ))}
              {upcomingEvents.filter(event => !event.registered && new Date(event.deadline) > today).length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  No upcoming deadlines
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
