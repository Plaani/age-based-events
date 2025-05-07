
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Users, UserPlus, CalendarClock, Share2, Eye, Settings, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

// Mock family data
const mockFamilyMembers = [
  { 
    id: "1", 
    nationalId: "7801154321", 
    firstName: "Emma", 
    lastName: "Smith", 
    age: 14, 
    relationship: "Daughter",
    shareRegistrations: true,
    sharePurchases: false
  },
  { 
    id: "2", 
    nationalId: "1201234567", 
    firstName: "James", 
    lastName: "Smith", 
    age: 10, 
    relationship: "Son",
    shareRegistrations: true,
    sharePurchases: true
  },
  { 
    id: "3", 
    nationalId: "7605124567", 
    firstName: "Sarah", 
    lastName: "Johnson", 
    age: 42, 
    relationship: "Spouse",
    shareRegistrations: true,
    sharePurchases: true
  }
];

const formSchema = z.object({
  nationalId: z.string().min(10, {
    message: "National ID must be at least 10 characters.",
  }),
  firstName: z.string().min(1, {
    message: "First name is required.",
  }),
  lastName: z.string().min(1, {
    message: "Last name is required.",
  }),
  relationship: z.string().min(1, {
    message: "Relationship is required.",
  }),
  shareRegistrations: z.boolean().default(true),
  sharePurchases: z.boolean().default(false),
});

const Family: React.FC = () => {
  const { user } = useAuth();
  const [familyMembers, setFamilyMembers] = useState(mockFamilyMembers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nationalId: "",
      firstName: "",
      lastName: "",
      relationship: "",
      shareRegistrations: true,
      sharePurchases: false,
    },
  });

  if (!user) return null;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, you would send this to your API
    const newMember = {
      id: String(Math.floor(Math.random() * 1000)),
      nationalId: values.nationalId,
      firstName: values.firstName,
      lastName: values.lastName,
      age: 30, // In a real app, this would be calculated from the national ID
      relationship: values.relationship,
      shareRegistrations: values.shareRegistrations,
      sharePurchases: values.sharePurchases
    };
    
    setFamilyMembers([...familyMembers, newMember]);
    setIsAddDialogOpen(false);
    form.reset();
    
    toast({
      title: "Family member added",
      description: `${newMember.firstName} has been added to your family group.`,
    });
  };

  const handleRemoveMember = (id: string) => {
    const memberToRemove = familyMembers.find(member => member.id === id);
    setFamilyMembers(familyMembers.filter(member => member.id !== id));
    
    toast({
      title: "Family member removed",
      description: `${memberToRemove?.firstName} has been removed from your family group.`,
    });
  };

  const toggleSharingOption = (id: string, option: "shareRegistrations" | "sharePurchases") => {
    setFamilyMembers(familyMembers.map(member => {
      if (member.id === id) {
        return { ...member, [option]: !member[option] };
      }
      return member;
    }));
    
    const member = familyMembers.find(m => m.id === id);
    const action = option === "shareRegistrations" ? "event registrations" : "purchases";
    const newValue = !member?.[option];
    
    toast({
      title: "Sharing preference updated",
      description: `${member?.firstName} will ${newValue ? 'now' : 'no longer'} share ${action}.`,
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Family Management</h1>
            <p className="text-gray-500 mt-2">
              Manage your family members and their sharing preferences
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Family Member
          </Button>
        </div>

        {/* Family Members List */}
        {familyMembers.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {familyMembers.map((member) => (
              <Card key={member.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center gap-2">
                      <span>{member.firstName} {member.lastName}</span>
                    </CardTitle>
                    <Badge>{member.relationship}</Badge>
                  </div>
                  <CardDescription>National ID: {member.nationalId}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <CalendarClock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Age: {member.age} years</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Share2 className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Share Event Registrations</span>
                        </div>
                        <Switch 
                          checked={member.shareRegistrations} 
                          onCheckedChange={() => toggleSharingOption(member.id, "shareRegistrations")} 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Eye className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Share Purchase Visibility</span>
                        </div>
                        <Switch 
                          checked={member.sharePurchases} 
                          onCheckedChange={() => toggleSharingOption(member.id, "sharePurchases")} 
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-3 w-3" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    <Trash2 className="mr-2 h-3 w-3" />
                    Remove
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-md bg-gray-50">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No family members</h3>
            <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
              Add family members to start managing events for your entire family
            </p>
            <Button className="mt-6" onClick={() => setIsAddDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Family Member
            </Button>
          </div>
        )}
      </div>

      {/* Add Family Member Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Family Member</DialogTitle>
            <DialogDescription>
              Enter the details of your family member to add them to your group.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="nationalId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>National ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter National ID" {...field} />
                    </FormControl>
                    <FormDescription>
                      The national ID is used for verification and age calculation.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="First Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="relationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Spouse">Spouse</SelectItem>
                        <SelectItem value="Child">Child</SelectItem>
                        <SelectItem value="Parent">Parent</SelectItem>
                        <SelectItem value="Sibling">Sibling</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="shareRegistrations"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Share Event Registrations
                      </FormLabel>
                      <FormDescription>
                        Allow this family member to see your event registrations
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="sharePurchases"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Share Purchase Visibility
                      </FormLabel>
                      <FormDescription>
                        Allow this family member to see your purchases
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Family Member</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Family;
