import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Users, Clock, Filter } from "lucide-react";
import EventCalendar from "@/components/dashboard/EventCalendar";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Define types for events and registration
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

// Mock events data with properly typed family limitations and waiting list status
const mockEvents: Event[] = [
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

interface RegistrationDialogProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onRegister: (eventId: string, includeFamily: boolean, familyMembers?: number) => void;
}

const RegistrationDialog: React.FC<RegistrationDialogProps> = ({ event, isOpen, onClose, onRegister }) => {
  const [includeFamily, setIncludeFamily] = useState(false);
  const [familyMembers, setFamilyMembers] = useState(1);
  const { user } = useAuth();
  
  // Calculate maximum family members allowed based on family limit type
  const getMaxFamilyMembers = () => {
    if (!event.familyLimit || event.familyLimit.type === "unlimited") return 10; // Arbitrary high number
    
    if (event.familyLimit.type === "fixed") {
      return event.familyLimit.value || 1;
    }
    
    if (event.familyLimit.type === "proportional") {
      const percentage = event.familyLimit.value || 0;
      return Math.max(1, Math.floor((percentage / 100) * event.capacity));
    }
    
    return 1;
  };

  const maxFamilyMembers = getMaxFamilyMembers();
  const isFull = event.spotsLeft <= 0;
  const familyOptions = Array.from({ length: maxFamilyMembers }, (_, i) => i + 1);
  
  // Format date function moved inside component
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Register for {event.title}</DialogTitle>
          <DialogDescription>
            {isFull ? (
              "This event is full. You will be added to the waiting list."
            ) : (
              `Complete your registration for this event. ${event.spotsLeft} spots remaining.`
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium">Event Details</h4>
            <p className="text-sm text-gray-500">
              {formatDate(event.date)} • {event.time}<br />
              Location: {event.location}<br />
              Price: ${event.price}
            </p>
          </div>
          
          {user?.familyId && (
            <div className="space-y-2">
              <h4 className="font-medium">Family Registration</h4>
              
              {event.familyLimit.type !== "unlimited" ? (
                <p className="text-sm text-gray-500">
                  This event has a limit of {event.familyLimit.type === "fixed" 
                    ? `${event.familyLimit.value} family members` 
                    : `${event.familyLimit.value}% of total capacity (${maxFamilyMembers} members)`} per registration.
                </p>
              ) : (
                <p className="text-sm text-gray-500">
                  This event allows unlimited family members per registration.
                </p>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="includeFamily"
                  checked={includeFamily}
                  onChange={() => setIncludeFamily(!includeFamily)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="includeFamily" className="text-sm font-medium">
                  Include family members
                </label>
              </div>
              
              {includeFamily && (
                <div className="pt-2">
                  <label className="text-sm font-medium">Number of family members (including you)</label>
                  <Select 
                    value={familyMembers.toString()} 
                    onValueChange={(value) => setFamilyMembers(parseInt(value))}
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select number" />
                    </SelectTrigger>
                    <SelectContent>
                      {familyOptions.map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "person" : "people"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
          
          {isFull && (
            <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
              <p className="text-sm text-yellow-800">
                You will be placed on a waiting list. We'll notify you if a spot becomes available.
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={() => onRegister(event.id, includeFamily, includeFamily ? familyMembers : undefined)}
            className="bg-primary text-white hover:bg-primary/90"
          >
            {isFull ? "Join Waiting List" : "Complete Registration"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const FamilyLimitPopover: React.FC<{ familyLimit: FamilyLimit }> = ({ familyLimit }) => {
  let description;
  
  switch (familyLimit.type) {
    case "fixed":
      description = `Maximum ${familyLimit.value} family members allowed`;
      break;
    case "proportional":
      description = `Limited to ${familyLimit.value}% of total capacity for family members`;
      break;
    case "unlimited":
      description = "No limit on family participants";
      break;
  }
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 p-0 hover:bg-transparent">
          <Users className="h-4 w-4 text-gray-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 text-sm p-3">
        <div className="font-medium">Family Participation Limit</div>
        <p className="text-gray-600 mt-1">{description}</p>
      </PopoverContent>
    </Popover>
  );
};

const Events: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [ageFilter, setAgeFilter] = useState("All");
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("available");
  
  // Get tab from URL params on component mount
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'registered' || tab === 'volunteer') {
      setActiveTab(tab);
    }
  }, [searchParams]);
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Update URL parameters
    if (value !== 'available') {
      setSearchParams({ tab: value });
    } else {
      // Remove the tab parameter for the default tab
      searchParams.delete('tab');
      setSearchParams(searchParams);
    }
  };

  // Format date function for the main component
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Handle date selection from calendar
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    // Convert the selected date to a string format matching our events' date format
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    // Filter events for this date
    setSearchTerm("");
    setCategoryFilter("All");
    setAgeFilter("All");
  };

  // Map events for calendar
  const calendarEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    date: event.date,
    registered: event.registered,
    targetAge: event.ageRange
  }));

  // Filter events based on search term, category, and age
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || event.category === categoryFilter;
    
    // Simple age filter logic - could be more sophisticated in a real app
    const matchesAge = ageFilter === "All" || 
                      (ageFilter === "Children" && event.ageRange.includes("6-10")) ||
                      (ageFilter === "Teens" && event.ageRange.includes("13-17")) ||
                      (ageFilter === "Adults" && (event.ageRange.includes("18") || event.ageRange.includes("All"))) ||
                      (ageFilter === "Seniors" && event.ageRange.includes("65+"));
    
    // Filter by selected date if one is set
    const matchesDate = !selectedDate || event.date.includes(
      `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
    );
    
    return matchesSearch && matchesCategory && matchesAge && matchesDate;
  });

  const registeredEvents = filteredEvents.filter(event => event.registered);
  const availableEvents = filteredEvents.filter(event => !event.registered);

  const openRegistrationDialog = (event: Event) => {
    setSelectedEvent(event);
    setRegistrationDialogOpen(true);
  };

  const closeRegistrationDialog = () => {
    setRegistrationDialogOpen(false);
    setSelectedEvent(null);
  };

  const handleRegister = (eventId: string, includeFamily: boolean, familyMembers?: number) => {
    setEvents(currentEvents => {
      return currentEvents.map(event => {
        if (event.id === eventId) {
          // Calculate how many spots to deduct
          const spotsToDeduct = includeFamily && familyMembers ? familyMembers : 1;
          
          // Check if event is full
          const isFull = event.spotsLeft <= 0;
          
          if (isFull) {
            // Add to waiting list
            const waitingListEntry: WaitingListEntry = {
              userId: user?.id || 'unknown',
              timestamp: new Date().toISOString(),
              familyMembers: includeFamily && familyMembers ? familyMembers : 1
            };
            
            toast({
              title: "Added to waiting list",
              description: `You've been added to the waiting list for ${event.title}.`,
            });
            
            return {
              ...event,
              waitingList: [...event.waitingList, waitingListEntry]
            };
          } else {
            // Regular registration
            const newSpotsLeft = Math.max(0, event.spotsLeft - spotsToDeduct);
            
            toast({
              title: "Registration successful",
              description: `You've successfully registered for ${event.title}${includeFamily ? ` with ${familyMembers! - 1} family members` : ''}.`,
            });
            
            return {
              ...event,
              registered: true,
              spotsLeft: newSpotsLeft
            };
          }
        }
        return event;
      });
    });
    
    closeRegistrationDialog();
  };
  
  const handleUnregister = (eventId: string) => {
    setEvents(currentEvents => {
      return currentEvents.map(event => {
        if (event.id === eventId) {
          // Get the current date to check against deadlines
          const currentDate = new Date();
          const deadlineDate = new Date(event.deadline);
          
          // Check if unregistration is still allowed
          if (currentDate > deadlineDate) {
            toast({
              variant: "destructive",
              title: "Cannot unregister",
              description: `The unregistration deadline for this event has passed (${formatDate(event.deadline)}).`,
            });
            return event;
          }
          
          // Restore spots when unregistering
          // In a real app, we would know exactly how many spots to restore based on the user's registration
          const spotsToRestore = 1; // Simplified for this example
          
          toast({
            title: "Unregistered from event",
            description: `You have successfully unregistered from ${event.title}.`,
          });
          
          return {
            ...event,
            registered: false,
            spotsLeft: event.spotsLeft + spotsToRestore
          };
        }
        return event;
      });
    });
  };

  if (!user) return null;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Events & Activities</h1>
          <p className="text-gray-500">
            Browse and register for upcoming events
          </p>
        </div>

        {/* Top section with calendar and filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: Calendar */}
          <div className="md:col-span-1">
            <EventCalendar 
              events={calendarEvents} 
              onDateSelect={handleDateSelect}
              isInteractive={true}
              viewMode={activeTab as 'all' | 'registered' | 'volunteer'}
              linkDestination="/events"
            />
          </div>
          
          {/* Right: Filters */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Find Events</CardTitle>
                <CardDescription>
                  Filter events by keyword, category, or age group
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div>
                    <Input
                      placeholder="Search events..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-full">
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
                      <SelectTrigger className="w-full">
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
                  
                  {selectedDate && (
                    <div className="flex items-center justify-between bg-primary/10 p-2 rounded-md">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                        <span>Filtering by date: {selectedDate.toLocaleDateString()}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedDate(undefined)}
                      >
                        Clear
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Events Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="available">Available Events</TabsTrigger>
            <TabsTrigger value="registered">Registered Events</TabsTrigger>
            <TabsTrigger value="volunteer">Volunteer Opportunities</TabsTrigger>
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
                        onClick={() => openRegistrationDialog(event)}
                      >
                        {event.spotsLeft === 0 ? "Join Waiting List" : "Register"}
                      </Button>
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
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium">Unregister By:</span>
                          <span className="text-gray-600">{formatDate(event.deadline)}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4 flex justify-between">
                      <Button variant="outline">View Details</Button>
                      <Button 
                        variant="destructive"
                        onClick={() => handleUnregister(event.id)}
                      >
                        Unregister
                      </Button>
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
          
          <TabsContent value="volunteer">
            <div className="text-center py-12 border rounded-md bg-gray-50">
              <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Volunteer Opportunities</h3>
              <p className="mt-1 text-sm text-gray-500">
                This section will show volunteer opportunities. Coming soon!
              </p>
              <Button className="mt-4" onClick={() => navigate('/volunteers')}>
                Go to Volunteer Dashboard
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Registration Dialog */}
      {selectedEvent && (
        <RegistrationDialog
          event={selectedEvent}
          isOpen={registrationDialogOpen}
          onClose={closeRegistrationDialog}
          onRegister={handleRegister}
        />
      )}
    </MainLayout>
  );
};

export default Events;
