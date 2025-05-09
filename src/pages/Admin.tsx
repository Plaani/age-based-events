import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShieldCheck, AlertCircle, CalendarPlus, UserCheck, UserX, Calendar, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import UserManagement from "@/components/admin/UserManagement";
import ReportingView from "@/components/admin/ReportingView";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import EventCalendar from "@/components/dashboard/EventCalendar";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";

// Mock data
const pendingUsers = [
  {
    id: "1",
    nationalId: "9001234567",
    firstName: "Alex",
    lastName: "Thompson",
    email: "alex@example.com",
    registeredDate: "2025-04-25",
    includeFamily: true,
  },
  {
    id: "2",
    nationalId: "8807121234",
    firstName: "Maria",
    lastName: "Garcia",
    email: "maria@example.com",
    registeredDate: "2025-05-01",
    includeFamily: false,
  },
  {
    id: "3",
    nationalId: "7512093456",
    firstName: "John",
    lastName: "Roberts",
    email: "john@example.com",
    registeredDate: "2025-05-03",
    includeFamily: true,
  }
];

const invalidMemberships = [
  {
    id: "1",
    nationalId: "6705142345",
    name: "Robert Wilson",
    expiryDate: "2025-04-01",
    accessStatus: "Active",
  },
  {
    id: "2",
    nationalId: "7809124567",
    name: "Linda Johnson",
    expiryDate: "2025-03-15",
    accessStatus: "Active",
  },
  {
    id: "3",
    nationalId: "9102056789",
    name: "Michael Brown",
    expiryDate: "2025-04-20",
    accessStatus: "Active",
  }
];

// Mock events data
const mockEvents = [
  {
    id: "1",
    title: "Summer Picnic",
    date: new Date(2025, 5, 15),
    location: "Central Park",
    registrationDeadline: new Date(2025, 5, 10),
    unregistrationDeadline: new Date(2025, 5, 12),
    maxParticipants: 50,
    description: "Annual summer picnic for all members and their families",
    createdBy: "Admin",
    targetAge: "All Ages",
    participants: [
      { id: "1", name: "Robert Wilson", nationalId: "6705142345" },
      { id: "2", name: "Linda Johnson", nationalId: "7809124567" },
    ]
  },
  {
    id: "2",
    title: "Board Meeting",
    date: new Date(2025, 5, 20),
    location: "Conference Room A",
    registrationDeadline: new Date(2025, 5, 18),
    unregistrationDeadline: new Date(2025, 5, 19),
    maxParticipants: 15,
    description: "Quarterly board meeting to discuss finances and upcoming events",
    createdBy: "Michael Brown",
    targetAge: "Adults",
    participants: [
      { id: "3", name: "Michael Brown", nationalId: "9102056789" },
      { id: "1", name: "Robert Wilson", nationalId: "6705142345" },
    ]
  },
  {
    id: "3",
    title: "Children's Workshop",
    date: new Date(2025, 6, 5),
    location: "Activity Room B",
    registrationDeadline: new Date(2025, 6, 1),
    unregistrationDeadline: new Date(2025, 6, 3),
    maxParticipants: 20,
    description: "Fun activities and crafts for children aged 5-12",
    createdBy: "Linda Johnson",
    targetAge: "Children 5-12",
    participants: [
      { id: "4", name: "Sarah Davis", nationalId: "8501234567" },
      { id: "5", name: "Thomas Miller", nationalId: "9003123456" },
    ]
  }
];

// Mock members data
const mockMembers = [
  { id: "1", name: "Robert Wilson", nationalId: "6705142345" },
  { id: "2", name: "Linda Johnson", nationalId: "7809124567" },
  { id: "3", name: "Michael Brown", nationalId: "9102056789" },
  { id: "4", name: "Sarah Davis", nationalId: "8501234567" },
  { id: "5", name: "Thomas Miller", nationalId: "9003123456" },
  { id: "6", name: "Emma Clark", nationalId: "8712090123" }
];

// Event creation form schema
const eventFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.date(),
  registrationDeadline: z.date(),
  unregistrationDeadline: z.date(),
  maxParticipants: z.coerce.number().min(1, "At least 1 participant is required"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  targetAge: z.string().min(1, "Target age is required"),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

// Define the event type based on our mock data structure
type EventType = {
  id: string;
  title: string;
  date: Date;
  location: string;
  registrationDeadline: Date;
  unregistrationDeadline: Date;
  maxParticipants: number;
  description: string;
  createdBy: string;
  targetAge: string;
  participants: { id: string; name: string; nationalId: string }[];
};

const Admin: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedMemberships, setSelectedMemberships] = useState<string[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"approve" | "reject" | "revoke">("approve");
  const [createEventDialogOpen, setCreateEventDialogOpen] = useState(false);
  const [events, setEvents] = useState<EventFormValues[]>([]);
  const [allEvents, setAllEvents] = useState<EventType[]>(mockEvents);
  const [participantsDialogOpen, setParticipantsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [availableMembers, setAvailableMembers] = useState<any[]>([]);
  const [selectedMember, setSelectedMember] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [targetAgeFilter, setTargetAgeFilter] = useState<string>("all");
  
  // Event form
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      maxParticipants: 20,
      targetAge: "All Ages",
    }
  });
  
  // Redirect non-admin users
  React.useEffect(() => {
    if (user && !user.isAdmin) {
      navigate("/dashboard");
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You do not have permission to access the admin panel.",
      });
    }
  }, [user, navigate]);
  
  if (!user || !user.isAdmin) return null;

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const filteredPendingUsers = pendingUsers.filter(user => 
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.nationalId.includes(searchTerm) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredInvalidMemberships = invalidMemberships.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.nationalId.includes(searchTerm)
  );

  const filteredEvents = allEvents.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesTargetAge = 
      targetAgeFilter === "all" || 
      (targetAgeFilter === "adults" && 
        (event.targetAge.includes("Adult") || event.targetAge === "All Ages")) ||
      (targetAgeFilter === "children" && 
        (event.targetAge.includes("Children") || event.targetAge.includes("Kids") || 
         event.targetAge === "All Ages"));
      
    const matchesDate = !selectedDate || 
      (event.date.getDate() === selectedDate.getDate() && 
       event.date.getMonth() === selectedDate.getMonth() && 
       event.date.getFullYear() === selectedDate.getFullYear());
      
    return matchesSearch && matchesTargetAge && matchesDate;
  });

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };
  
  const handleSelectAllUsers = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredPendingUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };
  
  const handleSelectMembership = (membershipId: string) => {
    setSelectedMemberships(prev => 
      prev.includes(membershipId) 
        ? prev.filter(id => id !== membershipId)
        : [...prev, membershipId]
    );
  };
  
  const handleSelectAllMemberships = (checked: boolean) => {
    if (checked) {
      setSelectedMemberships(filteredInvalidMemberships.map(member => member.id));
    } else {
      setSelectedMemberships([]);
    }
  };
  
  const openConfirmDialog = (action: "approve" | "reject" | "revoke") => {
    setConfirmAction(action);
    setConfirmDialogOpen(true);
  };
  
  const handleConfirmAction = () => {
    // In a real app, this would call an API
    if (confirmAction === "approve") {
      toast({
        title: "Users Approved",
        description: `${selectedUsers.length} user(s) have been approved.`,
      });
      // Would update users in the backend
    } else if (confirmAction === "reject") {
      toast({
        title: "Users Rejected",
        description: `${selectedUsers.length} user(s) have been rejected.`,
      });
      // Would delete or mark users as rejected in the backend
    } else if (confirmAction === "revoke") {
      toast({
        title: "Access Revoked",
        description: `Access has been revoked for ${selectedMemberships.length} user(s) with invalid memberships.`,
      });
      // Would update membership status in the backend
    }
    
    setConfirmDialogOpen(false);
    setSelectedUsers([]);
    setSelectedMemberships([]);
  };
  
  // Event creation handler
  const onSubmitEvent = (data: EventFormValues) => {
    // Create a new event with required fields explicitly defined
    const newEvent: EventType = {
      id: `${allEvents.length + 1}`,
      title: data.title,
      date: data.date,
      location: data.location,
      registrationDeadline: data.registrationDeadline,
      unregistrationDeadline: data.unregistrationDeadline,
      maxParticipants: data.maxParticipants,
      description: data.description,
      targetAge: data.targetAge,
      createdBy: user?.firstName + " " + user?.lastName || "Admin",
      participants: []
    };
    
    // Add to both event lists
    setEvents((prev) => [...prev, data]);
    setAllEvents((prev) => [...prev, newEvent]);
    
    toast({
      title: "Event Created",
      description: `${data.title} has been created successfully.`,
    });
    setCreateEventDialogOpen(false);
    form.reset();
  };

  const openParticipantsDialog = (event: any) => {
    setSelectedEvent(event);
    
    // Filter out members already registered for this event
    const eventParticipantIds = event.participants.map((p: any) => p.id);
    const filteredMembers = mockMembers.filter(member => !eventParticipantIds.includes(member.id));
    
    setAvailableMembers(filteredMembers);
    setParticipantsDialogOpen(true);
  };

  const addParticipant = () => {
    if (!selectedMember) return;
    
    const memberToAdd = mockMembers.find(m => m.id === selectedMember);
    if (!memberToAdd) return;
    
    // Add participant to event
    const updatedEvents = allEvents.map(event => {
      if (event.id === selectedEvent.id) {
        return {
          ...event,
          participants: [...event.participants, memberToAdd]
        };
      }
      return event;
    });
    
    setAllEvents(updatedEvents);
    
    // Update selected event and available members
    const updatedEvent = updatedEvents.find(e => e.id === selectedEvent.id)!;
    setSelectedEvent(updatedEvent);
    
    const updatedAvailableMembers = availableMembers.filter(m => m.id !== selectedMember);
    setAvailableMembers(updatedAvailableMembers);
    
    setSelectedMember("");
    
    toast({
      title: "Participant Added",
      description: `${memberToAdd.name} has been added to the event.`,
    });
  };

  const removeParticipant = (participantId: string) => {
    const participantToRemove = selectedEvent.participants.find((p: any) => p.id === participantId);
    
    // Remove participant from event
    const updatedEvents = allEvents.map(event => {
      if (event.id === selectedEvent.id) {
        return {
          ...event,
          participants: event.participants.filter((p: any) => p.id !== participantId)
        };
      }
      return event;
    });
    
    setAllEvents(updatedEvents);
    
    // Update selected event
    const updatedEvent = updatedEvents.find(e => e.id === selectedEvent.id)!;
    setSelectedEvent(updatedEvent);
    
    // Add back to available members
    const memberToAdd = mockMembers.find(m => m.id === participantId);
    if (memberToAdd) {
      setAvailableMembers([...availableMembers, memberToAdd]);
    }
    
    toast({
      title: "Participant Removed",
      description: `${participantToRemove.name} has been removed from the event.`,
    });
  };

  const clearSelectedDate = () => {
    setSelectedDate(undefined);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
          </div>
          <p className="text-gray-500">
            Manage user eligibility, memberships, and access
          </p>
        </div>

        <Tabs defaultValue="all-users" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all-users">All Users</TabsTrigger>
            <TabsTrigger value="pending-users">Pending Approvals</TabsTrigger>
            <TabsTrigger value="memberships">Invalid Memberships</TabsTrigger>
            <TabsTrigger value="events">Event Management</TabsTrigger>
            <TabsTrigger value="reporting">Reporting</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all-users">
            <UserManagement />
          </TabsContent>
          
          <TabsContent value="pending-users">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Pending User Approvals</CardTitle>
                    <CardDescription>
                      Review and approve user registrations
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={selectedUsers.length === 0}
                      onClick={() => openConfirmDialog("reject")}
                    >
                      <UserX className="mr-2 h-4 w-4" />
                      Reject Selected
                    </Button>
                    <Button 
                      size="sm"
                      disabled={selectedUsers.length === 0}
                      onClick={() => openConfirmDialog("approve")}
                    >
                      <UserCheck className="mr-2 h-4 w-4" />
                      Approve Selected
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    placeholder="Search by name, email, or national ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox 
                            checked={selectedUsers.length > 0 && selectedUsers.length === filteredPendingUsers.length}
                            onCheckedChange={handleSelectAllUsers}
                          />
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>National ID</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Registered</TableHead>
                        <TableHead>Family</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPendingUsers.length > 0 ? (
                        filteredPendingUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <Checkbox 
                                checked={selectedUsers.includes(user.id)}
                                onCheckedChange={() => handleSelectUser(user.id)}
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              {user.firstName} {user.lastName}
                            </TableCell>
                            <TableCell>{user.nationalId}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.registeredDate}</TableCell>
                            <TableCell>
                              {user.includeFamily ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  Yes
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                                  No
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleSelectUser(user.id)}>
                                  View
                                </Button>
                                <Button size="sm" onClick={() => {
                                  setSelectedUsers([user.id]);
                                  openConfirmDialog("approve");
                                }}>
                                  Approve
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-4">
                            No pending users found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-gray-500">
                  {filteredPendingUsers.length} user(s) pending approval
                </div>
                <div className="text-sm text-gray-500">
                  {selectedUsers.length} selected
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="memberships">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Invalid Memberships</CardTitle>
                    <CardDescription>
                      Manage expired or invalid memberships
                    </CardDescription>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    disabled={selectedMemberships.length === 0}
                    onClick={() => openConfirmDialog("revoke")}
                  >
                    <UserX className="mr-2 h-4 w-4" />
                    Revoke Access
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    placeholder="Search by name or national ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox 
                            checked={selectedMemberships.length > 0 && selectedMemberships.length === filteredInvalidMemberships.length}
                            onCheckedChange={handleSelectAllMemberships}
                          />
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>National ID</TableHead>
                        <TableHead>Expiry Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInvalidMemberships.length > 0 ? (
                        filteredInvalidMemberships.map((member) => (
                          <TableRow key={member.id}>
                            <TableCell>
                              <Checkbox 
                                checked={selectedMemberships.includes(member.id)}
                                onCheckedChange={() => handleSelectMembership(member.id)}
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              {member.name}
                            </TableCell>
                            <TableCell>{member.nationalId}</TableCell>
                            <TableCell className="text-red-600">{member.expiryDate}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                Expired
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleSelectMembership(member.id)}>
                                  Details
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => {
                                  setSelectedMemberships([member.id]);
                                  openConfirmDialog("revoke");
                                }}>
                                  Revoke
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4">
                            No invalid memberships found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-gray-500">
                  {filteredInvalidMemberships.length} invalid membership(s)
                </div>
                <div className="text-sm text-gray-500">
                  {selectedMemberships.length} selected
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="events">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Event Management</CardTitle>
                    <CardDescription>
                      Create and manage events, set registration deadlines, and monitor bookings
                    </CardDescription>
                  </div>
                  <Button onClick={() => setCreateEventDialogOpen(true)}>
                    <CalendarPlus className="mr-2 h-4 w-4" />
                    Create Event
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <div className="bg-white border rounded-lg p-4">
                      <h3 className="font-medium mb-4">Calendar View</h3>
                      <EventCalendar 
                        events={allEvents.map(event => ({
                          id: event.id,
                          title: event.title,
                          date: event.date.toISOString(),
                          registered: event.participants.length > 0,
                          targetAge: event.targetAge
                        }))}
                        onDateSelect={handleDateSelect}
                        isInteractive={true}
                      />
                      {selectedDate && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2 w-full"
                          onClick={clearSelectedDate}
                        >
                          Clear Selected Date
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <div className="mb-4 flex flex-col md:flex-row gap-3">
                      <div className="flex-1">
                        <Input
                          placeholder="Search events by title, location, or creator..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Select value={targetAgeFilter} onValueChange={setTargetAgeFilter}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by age group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Age Groups</SelectItem>
                          <SelectItem value="adults">Adults</SelectItem>
                          <SelectItem value="children">Children</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {filteredEvents.length > 0 ? (
                      <div className="space-y-6">
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Event</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Created By</TableHead>
                                <TableHead>Age Group</TableHead>
                                <TableHead>Participants</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredEvents.map((event) => (
                                <TableRow key={event.id}>
                                  <TableCell className="font-medium">{event.title}</TableCell>
                                  <TableCell>{format(event.date, 'MMM d, yyyy')}</TableCell>
                                  <TableCell>{event.location}</TableCell>
                                  <TableCell>{event.createdBy}</TableCell>
                                  <TableCell>{event.targetAge}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center">
                                      <span className="mr-2">{event.participants.length}/{event.maxParticipants}</span>
                                      <Badge variant={event.participants.length >= event.maxParticipants ? "destructive" : "outline"}>
                                        {event.participants.length >= event.maxParticipants ? "Full" : "Open"}
                                      </Badge>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => openParticipantsDialog(event)}
                                      >
                                        <Users className="mr-1 h-4 w-4" />
                                        Participants
                                      </Button>
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button size="sm" variant="ghost">⋯</Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                          <DropdownMenuItem>View Details</DropdownMenuItem>
                                          <DropdownMenuItem>Edit Event</DropdownMenuItem>
                                          <DropdownMenuItem className="text-red-600">Cancel Event</DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                          {events.map((event, index) => (
                            <Card key={index} className="event-card">
                              <CardHeader className="pb-2">
                                <CardTitle>{event.title}</CardTitle>
                                <CardDescription>{format(event.date, "PPP")}</CardDescription>
                              </CardHeader>
                              <CardContent className="pb-2">
                                <p className="text-sm text-gray-500 line-clamp-2">{event.description}</p>
                                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                                  <div>
                                    <p className="font-medium">Location</p>
                                    <p className="text-gray-500">{event.location}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Max Participants</p>
                                    <p className="text-gray-500">{event.maxParticipants}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Age Group</p>
                                    <p className="text-gray-500">{event.targetAge}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Registration Deadline</p>
                                    <p className="text-gray-500">{format(event.registrationDeadline, "PP")}</p>
                                  </div>
                                </div>
                              </CardContent>
                              <CardFooter>
                                <div className="flex justify-end w-full gap-2">
                                  <Button variant="outline" size="sm">Edit</Button>
                                  <Button variant="destructive" size="sm">Delete</Button>
                                </div>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center px-4 py-12">
                        <div className="rounded-full bg-secondary p-3 mb-4">
                          <Calendar className="h-6 w-6 text-secondary-foreground" />
                        </div>
                        <h3 className="text-lg font-medium">No Events Found</h3>
                        <p className="text-sm text-gray-500 mt-2 max-w-md">
                          {selectedDate 
                            ? `No events found for ${format(selectedDate, "MMMM d, yyyy")}. Try selecting a different date.` 
                            : "Create your first event by clicking the \"Create Event\" button above."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reporting">
            <ReportingView />
          </TabsContent>
        </Tabs>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {confirmAction === "approve" ? (
                <>
                  <UserCheck className="h-5 w-5 text-primary" />
                  Approve Selected Users
                </>
              ) : confirmAction === "reject" ? (
                <>
                  <UserX className="h-5 w-5 text-destructive" />
                  Reject Selected Users
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  Revoke Access
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {confirmAction === "approve"
                ? "Are you sure you want to approve these users? This will grant them access to the platform."
                : confirmAction === "reject"
                ? "Are you sure you want to reject these users? This will remove their registration request."
                : "Are you sure you want to revoke access for these users? They will no longer be able to access the platform."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={confirmAction === "approve" ? "default" : "destructive"}
              onClick={handleConfirmAction}
            >
              {confirmAction === "approve"
                ? "Approve"
                : confirmAction === "reject"
                ? "Reject"
                : "Revoke Access"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Event Dialog */}
      <Dialog open={createEventDialogOpen} onOpenChange={setCreateEventDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarPlus className="h-5 w-5 text-primary" />
              Create New Event
            </DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new event.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitEvent)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter event title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the event" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <Calendar className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Event location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="registrationDeadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registration Deadline</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <Calendar className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unregistrationDeadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unregistration Deadline</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <Calendar className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="maxParticipants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Participants</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="targetAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Age Group</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select age group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="All Ages">All Ages</SelectItem>
                          <SelectItem value="Adults">Adults</SelectItem>
                          <SelectItem value="Seniors">Seniors</SelectItem>
                          <SelectItem value="Young Adults">Young Adults</SelectItem>
                          <SelectItem value="Teenagers">Teenagers</SelectItem>
                          <SelectItem value="Children 5-12">Children 5-12</SelectItem>
                          <SelectItem value="Children under 5">Children under 5</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit">Create Event</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Participants Dialog */}
      <Dialog open={participantsDialogOpen} onOpenChange={setParticipantsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {selectedEvent && `Manage Participants: ${selectedEvent.title}`}
            </DialogTitle>
            <DialogDescription>
              Add or remove participants for this event.
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-end">
                <div className="flex-1">
                  <Label htmlFor="member">Add Participant</Label>
                  <Select value={selectedMember} onValueChange={setSelectedMember}>
                    <SelectTrigger id="member" className="w-full">
                      <SelectValue placeholder="Select a member" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableMembers.map(member => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} ({member.nationalId})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={addParticipant} 
                  disabled={!selectedMember}
                  className="md:mb-0"
                >
                  Add to Event
                </Button>
              </div>
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>National ID</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedEvent.participants.length > 0 ? (
                      selectedEvent.participants.map((participant: any) => (
                        <TableRow key={participant.id}>
                          <TableCell className="font-medium">{participant.name}</TableCell>
                          <TableCell>{participant.nationalId}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => removeParticipant(participant.id)}
                            >
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-4">
                          No participants registered yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {selectedEvent.participants.length} / {selectedEvent.maxParticipants} participants
                </div>
                <Button variant="outline" onClick={() => setParticipantsDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Admin;
