
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User, UserCircle, Mail, Calendar, Bell, BellOff, CreditCard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

const profileFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

const notificationSchema = z.object({
  eventReminders: z.boolean().default(true),
  deadlineAlerts: z.boolean().default(true),
  familyUpdates: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
});

const Profile: React.FC = () => {
  const { user } = useAuth();
  
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
    },
  });
  
  const notificationForm = useForm<z.infer<typeof notificationSchema>>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      eventReminders: true,
      deadlineAlerts: true,
      familyUpdates: true,
      marketingEmails: false,
    },
  });
  
  if (!user) return null;

  const onProfileSubmit = (values: z.infer<typeof profileFormSchema>) => {
    // In a real app, this would update the user profile via API
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  };
  
  const onNotificationSubmit = (values: z.infer<typeof notificationSchema>) => {
    // In a real app, this would update notification preferences via API
    toast({
      title: "Notification preferences updated",
      description: "Your notification preferences have been saved.",
    });
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-gray-500">
            Manage your account settings and preferences
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left sidebar */}
          <div className="lg:w-1/3">
            <Card>
              <CardHeader>
                <div className="flex flex-col items-center">
                  <div className="h-24 w-24 rounded-full bg-brand-100 flex items-center justify-center mb-2">
                    <UserCircle className="h-16 w-16 text-brand-600" />
                  </div>
                  <CardTitle className="mt-2">{user.firstName} {user.lastName}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">National ID</span>
                    <span className="text-sm text-gray-500">{user.nationalId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Age</span>
                    <span className="text-sm text-gray-500">{user.age} years</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Account Status</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Active
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Account Type</span>
                    <Badge variant={user.isAdmin ? "default" : "outline"}>
                      {user.isAdmin ? "Admin" : "Member"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
              </TabsList>
              
              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={profileForm.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormItem>
                            <FormLabel>National ID</FormLabel>
                            <Input value={user.nationalId} disabled />
                            <FormDescription>
                              Your National ID cannot be changed
                            </FormDescription>
                          </FormItem>
                          
                          <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <Input value={user.birthdate} disabled />
                            <FormDescription>
                              Derived from your National ID
                            </FormDescription>
                          </FormItem>
                        </div>
                        
                        <Button type="submit">Save Changes</Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Account Security</CardTitle>
                    <CardDescription>
                      Manage your password and security settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Password</h4>
                        <p className="text-sm text-gray-500">Last updated 3 months ago</p>
                      </div>
                      <Button variant="outline">Change Password</Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-500">Enhance your account security</p>
                      </div>
                      <Button variant="outline">Set Up</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Notifications Tab */}
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Configure how and when you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...notificationForm}>
                      <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                        <FormField
                          control={notificationForm.control}
                          name="eventReminders"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <div className="flex items-center">
                                  <Bell className="mr-2 h-4 w-4 text-brand-600" />
                                  <FormLabel className="text-base font-medium">
                                    Event Reminders
                                  </FormLabel>
                                </div>
                                <FormDescription>
                                  Receive reminders before your registered events
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
                          control={notificationForm.control}
                          name="deadlineAlerts"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <div className="flex items-center">
                                  <Calendar className="mr-2 h-4 w-4 text-brand-600" />
                                  <FormLabel className="text-base font-medium">
                                    Registration Deadlines
                                  </FormLabel>
                                </div>
                                <FormDescription>
                                  Be notified about approaching registration deadlines
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
                          control={notificationForm.control}
                          name="familyUpdates"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <div className="flex items-center">
                                  <User className="mr-2 h-4 w-4 text-brand-600" />
                                  <FormLabel className="text-base font-medium">
                                    Family Updates
                                  </FormLabel>
                                </div>
                                <FormDescription>
                                  Get notifications when family members register for events
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
                          control={notificationForm.control}
                          name="marketingEmails"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <div className="flex items-center">
                                  <Mail className="mr-2 h-4 w-4 text-brand-600" />
                                  <FormLabel className="text-base font-medium">
                                    Marketing Emails
                                  </FormLabel>
                                </div>
                                <FormDescription>
                                  Receive emails about new events and promotions
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
                        
                        <Button type="submit">Save Preferences</Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Billing Tab */}
              <TabsContent value="billing">
                <Card className="py-12">
                  <div className="flex flex-col items-center justify-center text-center px-4">
                    <div className="rounded-full bg-gray-100 p-3 mb-4">
                      <CreditCard className="h-6 w-6 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium">Billing Information</h3>
                    <p className="text-sm text-gray-500 mt-2 max-w-md">
                      View your invoices and manage your payment information.
                    </p>
                    <Button className="mt-6">View Invoices</Button>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
