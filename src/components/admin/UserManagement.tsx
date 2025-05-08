
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, UserCheck, UserX } from "lucide-react";
import { format } from "date-fns";

// Types for user management
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  nationalId: string;
  joinDate: Date;
  status: 'active' | 'suspended' | 'pending';
  hasFamilyAccess: boolean;
  familySize: number;
}

// Mock users data
const mockUsers: User[] = [
  {
    id: "101",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@example.com",
    nationalId: "750412-3456",
    joinDate: new Date("2025-01-15"),
    status: "active",
    hasFamilyAccess: true,
    familySize: 3
  },
  {
    id: "102",
    firstName: "Maria",
    lastName: "Garcia",
    email: "maria@example.com",
    nationalId: "880712-1234",
    joinDate: new Date("2025-02-03"),
    status: "active",
    hasFamilyAccess: true,
    familySize: 2
  },
  {
    id: "103",
    firstName: "Robert",
    lastName: "Wilson",
    email: "robert@example.com",
    nationalId: "670514-2345",
    joinDate: new Date("2025-03-10"),
    status: "suspended",
    hasFamilyAccess: false,
    familySize: 0
  },
  {
    id: "104",
    firstName: "Linda",
    lastName: "Johnson",
    email: "linda@example.com",
    nationalId: "780912-4567",
    joinDate: new Date("2025-03-22"),
    status: "active",
    hasFamilyAccess: true,
    familySize: 1
  },
  {
    id: "105",
    firstName: "Michael",
    lastName: "Brown",
    email: "michael@example.com",
    nationalId: "910205-6789",
    joinDate: new Date("2025-04-05"),
    status: "active",
    hasFamilyAccess: false,
    familySize: 0
  }
];

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [users] = useState<User[]>(mockUsers);
  
  const filteredUsers = users.filter(user => {
    // Search filter
    const matchesSearch = 
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.nationalId.includes(searchTerm);
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesStatus;
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
      setSelectedUsers(filteredUsers.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              View and manage all system users
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              disabled={selectedUsers.length === 0}
            >
              <UserX className="mr-2 h-4 w-4" />
              Suspend Selected
            </Button>
            <Button 
              size="sm"
              disabled={selectedUsers.length === 0}
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Activate Selected
            </Button>
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
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                    onCheckedChange={handleSelectAllUsers}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>National ID</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Family</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
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
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.nationalId}</TableCell>
                    <TableCell>{format(user.joinDate, "yyyy-MM-dd")}</TableCell>
                    <TableCell>
                      {user.status === 'active' && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Active
                        </Badge>
                      )}
                      {user.status === 'suspended' && (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          Suspended
                        </Badge>
                      )}
                      {user.status === 'pending' && (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.hasFamilyAccess ? (
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            Yes ({user.familySize})
                          </Badge>
                        </div>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                          No
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        {user.status === 'active' ? (
                          <Button variant="destructive" size="sm">
                            Suspend
                          </Button>
                        ) : (
                          <Button size="sm">
                            Activate
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
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
          {filteredUsers.length} user(s) displayed
        </div>
        <div className="text-sm text-gray-500">
          {selectedUsers.length} selected
        </div>
      </CardFooter>
    </Card>
  );
};

export default UserManagement;
