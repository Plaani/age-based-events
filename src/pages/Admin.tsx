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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
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
    participants: [
      { id: "3", name: "Michael Brown", nationalId: "9102056789" },
      { id: "1", name: "Robert Wilson", nationalId: "6705142345" },
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
});

type EventFormValues = z.infer<typeof eventFormSchema>;

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
  const [allEvents, setAllEvents] = useState(mockEvents);
  const [participantsDialogOpen, setParticipantsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [availableMembers, setAvailableMembers] = useState<any[]>([]);
  const [selectedMember, setSelectedMember] = useState("");
  
  // Event form
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      maxParticipants: 20,
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

  const filteredEvents = allEvents.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        description: `Access has been revoked for ${selectedMemberships.length} user(s).`,
      });
      // Would update membership status in the backend
    }
    
    setConfirmDialogOpen(false);
    setSelectedUsers([]);
    setSelectedMemberships([]);
  };
  
  // Event creation handler
  const onSubmitEvent = (data: EventFormValues) => {
    // Create a new event with default values for the new fields
    const newEvent = {
      ...data,
      id: `${allEvents.length + 1}`,
      createdBy: user.name || "Admin",
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
                <div className="mb-4">
                  <Input
                    placeholder="Search events by title, location, or creator..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
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
                            <TableHead>Participants</TableHead>
                            <TableHead>Capacity</TableHead>
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
                              <TableCell>
                                <div className="flex items-center">
                                  <span className="mr-2">{event.participants.length}</span>
                                  <Badge variant={event.participants.length >= event.maxParticipants ? "destructive" : "outline"}>
                                    {event.participants.length >= event.maxParticipants ? "Full" : "Open"}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell>{event.participants.length}/{event.maxParticipants}</TableCell>
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
                                <p className="font-medium">Registration Deadline</p>
                                <p className="text-gray-500">{format(event.registrationDeadline, "PP")}</p>
                              </div>
                              <div>
                                <p className="font-medium">Unregistration Deadline</p>
                                <p className="text-gray-500">{format(event.unregistrationDeadline, "PP")}</p>
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
                    <h3 className="text-lg font-medium">No Events Created</h3>
                    <p className="text-sm text-gray-500 mt-2 max-w-md">
                      Create your first event by clicking the "Create Event" button above.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              {confirmAction === "approve" && "Approve Selected Users?"}
              {confirmAction === "reject" && "Reject Selected Users?"}
              {confirmAction === "revoke" && "Revoke Access?"}
            </DialogTitle>
            <DialogDescription>
              {confirmAction === "approve" && `You are about to approve ${selectedUsers.length} user(s). They will gain access to the platform.`}
              {confirmAction === "reject" && `You are about to reject ${selectedUsers.length} user(s). They will not be able to access the platform.`}
              {confirmAction === "revoke" && `You are about to revoke access for ${selectedMemberships.length} user(s) with invalid memberships.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant={confirmAction === "reject" || confirmAction === "revoke" ? "destructive" : "default"}
              onClick={handleConfirmAction}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Event Dialog */}
      <Dialog open={createEventDialogOpen} onOpenChange={setCreateEventDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              Fill in the event details. All fields are required.
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
                      <Textarea placeholder="Enter event description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
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
                              <CalendarComponent className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="registrationDeadline"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
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
                              <CalendarComponent className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
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
                    <FormItem className="flex flex-col">
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
                              <CalendarComponent className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="maxParticipants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Participants</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormDescription>
                      Maximum number of people who can attend this event
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setCreateEventDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Event</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Manage Participants Dialog */}
      <Dialog open={participantsDialogOpen} onOpenChange={setParticipantsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Participants</DialogTitle>
            <DialogDescription>
              {selectedEvent && (
                <span>
                  {selectedEvent.title} - {format(selectedEvent.date, 'MMM d, yyyy')} ({selectedEvent.participants.length}/{selectedEvent.maxParticipants} participants)
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <h3 className="text-sm font-medium">Add Participant</h3>
                <div className="flex gap-2">
                  <Select value={selectedMember} onValueChange={setSelectedMember}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select a member" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableMembers.length > 0 ? (
                        availableMembers.map((member) => (
                          <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
                        ))
                      ) : (
                        <SelectItem disabled value="none">No available members</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={addParticipant} 
                    disabled={!selectedMember || selectedEvent.participants.length >= selectedEvent.maxParticipants}
                  >
                    Add
                  </Button>
                </div>
                {selectedEvent.participants.length >= selectedEvent.maxParticipants && (
                  <p className="text-sm text-red-500">Maximum capacity reached</p>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Current Participants</h3>
                <div className="rounded-md border">
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
                                variant="destructive" 
                                size="sm" 
                                onClick={() => removeParticipant(participant.id)}
                              >
                                <UserX className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-4">
                            No participants yet
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setParticipantsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Admin;
