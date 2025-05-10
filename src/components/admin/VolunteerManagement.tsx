
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { User, useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { users } from "lucide-react";

// Mock events data - this would come from your actual events state
const mockEvents = [
  { id: '1', title: 'Summer Picnic' },
  { id: '2', title: 'Board Meeting' },
  { id: '3', title: 'Children\'s Workshop' },
  { id: '4', title: 'Annual Gathering' },
  { id: '5', title: 'Winter Festival' },
];

// Mock users - this would come from your actual users state
const mockUsersList: User[] = [
  {
    id: '1',
    nationalId: '12345678901',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    isAdmin: true,
    approved: true,
    age: 35,
    birthdate: '1988-05-15',
    isVolunteer: true,
    volunteerFor: ['all']
  },
  {
    id: '2',
    nationalId: '98765432109',
    firstName: 'Regular',
    lastName: 'User',
    email: 'user@example.com',
    isAdmin: false,
    approved: true,
    age: 28,
    birthdate: '1995-10-23',
    isVolunteer: true,
    volunteerFor: ['1', '3']
  },
  {
    id: '4',
    nationalId: '55667788990',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah@example.com',
    isAdmin: false,
    approved: true,
    age: 32,
    birthdate: '1993-08-17',
    isVolunteer: false
  },
  {
    id: '5',
    nationalId: '33445566778',
    firstName: 'Michael',
    lastName: 'Williams',
    email: 'michael@example.com',
    isAdmin: false,
    approved: true,
    age: 45,
    birthdate: '1980-04-23',
    isVolunteer: false
  }
];

// Form schema for volunteer assignment
const volunteerFormSchema = z.object({
  userId: z.string().min(1, "User is required"),
  volunteerType: z.enum(["specific", "all"]),
  eventIds: z.array(z.string()).optional(),
});

type VolunteerFormValues = z.infer<typeof volunteerFormSchema>;

const VolunteerManagement: React.FC = () => {
  const { user } = useAuth();
  const [usersList, setUsersList] = useState<User[]>(mockUsersList);
  const [searchTerm, setSearchTerm] = useState('');
  const [volunteerDialogOpen, setVolunteerDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [volunteerStatusFilter, setVolunteerStatusFilter] = useState<string>("all");

  const form = useForm<VolunteerFormValues>({
    resolver: zodResolver(volunteerFormSchema),
    defaultValues: {
      userId: "",
      volunteerType: "specific",
      eventIds: [],
    }
  });

  // Filter users based on search term and volunteer status
  const filteredUsers = usersList.filter(user => {
    const matchesSearch = 
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.nationalId.includes(searchTerm);
    
    const matchesVolunteerStatus = 
      volunteerStatusFilter === "all" || 
      (volunteerStatusFilter === "volunteer" && user.isVolunteer) || 
      (volunteerStatusFilter === "non-volunteer" && !user.isVolunteer);
    
    return matchesSearch && matchesVolunteerStatus;
  });

  const openVolunteerDialog = (user: User) => {
    setSelectedUser(user);
    form.reset({
      userId: user.id,
      volunteerType: user.volunteerFor?.includes('all') ? "all" : "specific",
      eventIds: user.volunteerFor?.filter(id => id !== 'all') || []
    });
    setVolunteerDialogOpen(true);
  };

  const handleVolunteerSubmit = (data: VolunteerFormValues) => {
    // Update the user's volunteer status
    const updatedUsers = usersList.map(u => {
      if (u.id === data.userId) {
        return {
          ...u,
          isVolunteer: true,
          volunteerFor: data.volunteerType === "all" ? ['all'] : data.eventIds
        };
      }
      return u;
    });

    setUsersList(updatedUsers);
    setVolunteerDialogOpen(false);
    
    toast({
      title: "Volunteer Status Updated",
      description: `${selectedUser?.firstName} ${selectedUser?.lastName} has been ${data.volunteerType === "all" ? "assigned as a volunteer for all events" : "assigned as a volunteer for selected events"}`,
    });
  };

  const removeVolunteerStatus = (userId: string) => {
    const updatedUsers = usersList.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          isVolunteer: false,
          volunteerFor: []
        };
      }
      return u;
    });

    setUsersList(updatedUsers);
    
    toast({
      title: "Volunteer Status Removed",
      description: "User is no longer a volunteer",
    });
  };

  // Get event titles for display
  const getEventTitles = (eventIds: string[]) => {
    if (eventIds.includes('all')) return "All Events";
    
    return eventIds
      .map(id => mockEvents.find(event => event.id === id)?.title)
      .filter(Boolean)
      .join(", ");
  };

  const handleEventCheckboxChange = (eventId: string) => {
    const currentEvents = form.getValues("eventIds") || [];
    const updatedEvents = currentEvents.includes(eventId)
      ? currentEvents.filter(id => id !== eventId)
      : [...currentEvents, eventId];
    
    form.setValue("eventIds", updatedEvents);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Volunteer Management</CardTitle>
            <CardDescription>
              Assign volunteer roles to members
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-3 mb-4 items-start md:items-center">
          <div className="flex-1">
            <Input
              placeholder="Search by name, email, or national ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={volunteerStatusFilter} onValueChange={setVolunteerStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Users" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="volunteer">Volunteers Only</SelectItem>
              <SelectItem value="non-volunteer">Non-Volunteers</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>National ID</TableHead>
                <TableHead>Volunteer</TableHead>
                <TableHead>Volunteering For</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.nationalId}</TableCell>
                    <TableCell>
                      {user.isVolunteer ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Yes
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                          No
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.isVolunteer && user.volunteerFor ? (
                        <span className="text-sm">{getEventTitles(user.volunteerFor)}</span>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant={user.isVolunteer ? "outline" : "default"} 
                          size="sm"
                          onClick={() => openVolunteerDialog(user)}
                        >
                          {user.isVolunteer ? "Update Volunteer Status" : "Make Volunteer"}
                        </Button>
                        
                        {user.isVolunteer && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => removeVolunteerStatus(user.id)}
                          >
                            Remove Volunteer
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-gray-500">
          {filteredUsers.filter(u => u.isVolunteer).length} volunteer(s)
        </div>
      </CardFooter>

      {/* Volunteer Assignment Dialog */}
      <Dialog open={volunteerDialogOpen} onOpenChange={setVolunteerDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.isVolunteer 
                ? `Update Volunteer Status: ${selectedUser?.firstName} ${selectedUser?.lastName}`
                : `Assign as Volunteer: ${selectedUser?.firstName} ${selectedUser?.lastName}`}
            </DialogTitle>
            <DialogDescription>
              Specify which events this person can volunteer for
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleVolunteerSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="volunteerType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Volunteer For</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value: "specific" | "all") => {
                          field.onChange(value);
                          if (value === "all") {
                            form.setValue("eventIds", []);
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select volunteer scope" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="specific">Specific Events</SelectItem>
                          <SelectItem value="all">All Events (Can Create Events)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("volunteerType") === "specific" && (
                <div className="space-y-4">
                  <FormLabel className="block text-sm font-medium">Select Events</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {mockEvents.map(event => (
                      <div key={event.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`event-${event.id}`} 
                          checked={(form.watch("eventIds") || []).includes(event.id)} 
                          onCheckedChange={() => handleEventCheckboxChange(event.id)}
                        />
                        <label htmlFor={`event-${event.id}`} className="text-sm">
                          {event.title}
                        </label>
                      </div>
                    ))}
                  </div>
                  {form.formState.errors.eventIds && (
                    <p className="text-sm text-red-500">Please select at least one event</p>
                  )}
                </div>
              )}
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setVolunteerDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedUser?.isVolunteer ? "Update Volunteer Status" : "Assign as Volunteer"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default VolunteerManagement;
