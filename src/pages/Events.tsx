
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

// Import components
import EventCalendar from "@/components/dashboard/EventCalendar";
import EventFilters from "@/components/events/EventFilters";
import EventsList from "@/components/events/EventsList";
import EmptyState from "@/components/events/EmptyState";
import RegistrationDialog from "@/components/events/RegistrationDialog";

// Import types and mock data
import { Event, CalendarEvent } from "@/components/events/types";
import { mockEvents } from "@/components/events/mockData";

const Events: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // State for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [ageFilter, setAgeFilter] = useState("All");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  // State for events and UI
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [activeTab, setActiveTab] = useState("available");
  
  // Get params from URL on component mount
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'registered' || tab === 'volunteer') {
      setActiveTab(tab);
    }
    
    // Check for eventId parameter
    const eventId = searchParams.get('eventId');
    if (eventId) {
      const event = events.find(e => e.id.toString() === eventId);
      if (event) {
        setSelectedEvent(event);
        setRegistrationDialogOpen(true);
      }
    }
  }, [searchParams, events]);
  
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
  const calendarEvents: CalendarEvent[] = events.map(event => ({
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
    
    // Remove eventId from URL if it exists
    if (searchParams.has('eventId')) {
      searchParams.delete('eventId');
      setSearchParams(searchParams);
    }
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
            const waitingListEntry = {
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
            <EventFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              ageFilter={ageFilter}
              setAgeFilter={setAgeFilter}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
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
            <EventsList
              events={availableEvents}
              type="available"
              formatDate={formatDate}
              onRegister={openRegistrationDialog}
            />
          </TabsContent>
          
          <TabsContent value="registered">
            <EventsList
              events={registeredEvents}
              type="registered"
              formatDate={formatDate}
              onRegister={openRegistrationDialog}
              onUnregister={handleUnregister}
            />
          </TabsContent>
          
          <TabsContent value="volunteer">
            <EmptyState type="volunteer" />
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
