
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Users, Clock, Filter } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// Mock events data
const mockEvents = [
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
    price: 75
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
    price: 45
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
    price: 30
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
    price: 50
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
    spotsLeft: 10,
    price: 25
  }
];

const Events: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [ageFilter, setAgeFilter] = useState("All");

  if (!user) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Filter events based on search term, category, and age
  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || event.category === categoryFilter;
    
    // Simple age filter logic - could be more sophisticated in a real app
    const matchesAge = ageFilter === "All" || 
                      (ageFilter === "Children" && event.ageRange.includes("6-10")) ||
                      (ageFilter === "Teens" && event.ageRange.includes("13-17")) ||
                      (ageFilter === "Adults" && (event.ageRange.includes("18") || event.ageRange.includes("All"))) ||
                      (ageFilter === "Seniors" && event.ageRange.includes("65+"));
    
    return matchesSearch && matchesCategory && matchesAge;
  });

  const registeredEvents = filteredEvents.filter(event => event.registered);
  const availableEvents = filteredEvents.filter(event => !event.registered);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Events & Activities</h1>
          <p className="text-gray-500">
            Browse and register for upcoming events
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                <SelectItem value="Sports">Sports</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Social">Social</SelectItem>
                <SelectItem value="Arts">Arts</SelectItem>
                <SelectItem value="Games">Games</SelectItem>
              </SelectContent>
            </Select>

            <Select value={ageFilter} onValueChange={setAgeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Age Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Ages</SelectItem>
                <SelectItem value="Children">Children (5-12)</SelectItem>
                <SelectItem value="Teens">Teens (13-17)</SelectItem>
                <SelectItem value="Adults">Adults (18+)</SelectItem>
                <SelectItem value="Seniors">Seniors (65+)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Events Tabs */}
        <Tabs defaultValue="available" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="available">Available Events</TabsTrigger>
            <TabsTrigger value="registered">Registered Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="available">
            {availableEvents.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {availableEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden event-card">
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
                          <span className="font-medium">Availability:</span>
                          <Badge variant={event.spotsLeft < 5 ? "destructive" : "outline"}>
                            {event.spotsLeft} spots left
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <Button className="w-full">Register</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-md bg-gray-50">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No events found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your filters to find events
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="registered">
            {registeredEvents.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {registeredEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden event-card">
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
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4 flex justify-between">
                      <Button variant="outline">View Details</Button>
                      <Button variant="destructive">Unregister</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-md bg-gray-50">
                <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No registered events</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You haven't registered for any events yet
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Events;
