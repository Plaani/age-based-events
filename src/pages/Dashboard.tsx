
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, Users, CheckCircle2, XCircle, ClipboardCheck, Award, UserCircle, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import EventCalendar from "@/components/dashboard/EventCalendar";
import { events, familyMembers as dbFamilyMembers, volunteerTasks } from "@/data/mockDatabase";

// Derive dashboard data from central mock database
const upcomingEvents = events.map(e => ({
  id: e.id,
  title: e.title,
  date: e.date,
  time: e.time,
  ageRange: e.ageRange,
  registered: e.registered,
  deadline: e.deadline
}));

const familyMembers = dbFamilyMembers.map(m => ({
  id: m.id,
  name: `${m.firstName} ${m.lastName}`,
  age: m.age,
  relationship: m.relationship
}));

const volunteerOpportunities = volunteerTasks.map(task => ({
  id: task.id,
  title: task.title,
  date: task.date.toISOString().split('T')[0],
  time: '',
  location: task.location,
  stars: task.starsReward,
  registered: false
}));

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

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="h-5 w-5" />
              <span>Profile</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="h-24 w-24 rounded-full bg-brand-100 flex items-center justify-center">
                <UserCircle className="h-16 w-16 text-brand-700" />
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-xl font-semibold">{user.firstName} {user.lastName}</h3>
                <div className="space-y-1 text-gray-600">
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{user.phone || "No phone number added"}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{user.address || "No address added"}</span>
                  </p>
                </div>
              </div>
              <div>
                <Button asChild>
                  <Link to="/profile">Edit Profile</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

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
              <CardTitle>Volunteering</CardTitle>
              <CardDescription>
                Your volunteer activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{volunteerOpportunities.filter(v => v.registered).length}</div>
              <p className="text-sm text-gray-500">registered opportunities</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/volunteers">Find Opportunities</Link>
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
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button variant="outline" asChild>
                <Link to="/family">Manage Family</Link>
              </Button>
              <Button>
                Add Family Member
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

        {/* Volunteer Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5" />
              <span>Volunteer Opportunities</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {volunteerOpportunities.length > 0 ? (
                volunteerOpportunities.map((opportunity) => (
                  <div key={opportunity.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div className="space-y-1">
                      <div className="font-medium">{opportunity.title}</div>
                      <div className="text-sm text-gray-500">
                        {formatDate(opportunity.date)} at {opportunity.time}
                      </div>
                      <div className="flex gap-2 items-center mt-1">
                        <Badge variant={opportunity.registered ? "default" : "outline"}>
                          {opportunity.registered ? "Registered" : "Open"}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Award className="h-3.5 w-3.5 text-amber-500" />
                          <span className="text-xs">{opportunity.stars} stars</span>
                        </div>
                        <span className="text-xs text-gray-500">{opportunity.location}</span>
                      </div>
                    </div>
                    <Button size="sm">
                      {opportunity.registered ? "View Details" : "Volunteer"}
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  No upcoming volunteer opportunities
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button variant="outline" className="w-full" asChild>
              <Link to="/volunteers">View All Opportunities</Link>
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
