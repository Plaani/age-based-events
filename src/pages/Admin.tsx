
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShieldCheck, UserCheck, UserX, Calendar, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

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

const Admin: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedMemberships, setSelectedMemberships] = useState<string[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"approve" | "reject" | "revoke">("approve");
  
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

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-brand-600" />
            <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
          </div>
          <p className="text-gray-500">
            Manage user eligibility, memberships, and access
          </p>
        </div>

        <Tabs defaultValue="pending-users" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="pending-users">Pending Approvals</TabsTrigger>
            <TabsTrigger value="memberships">Invalid Memberships</TabsTrigger>
            <TabsTrigger value="events">Event Management</TabsTrigger>
          </TabsList>
          
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
            <Card className="py-12">
              <div className="flex flex-col items-center justify-center text-center px-4">
                <div className="rounded-full bg-gray-100 p-3 mb-4">
                  <Calendar className="h-6 w-6 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium">Event Management</h3>
                <p className="text-sm text-gray-500 mt-2 max-w-md">
                  Create and manage events, set registration deadlines, and monitor bookings.
                </p>
                <Button className="mt-6">Create Event</Button>
              </div>
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
    </MainLayout>
  );
};

export default Admin;
