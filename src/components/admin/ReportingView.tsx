
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Award, Users, Calendar } from "lucide-react";

// Mock data for reports
const eventParticipationData = [
  { name: 'Summer Picnic', participants: 35, capacity: 50, category: 'Social' },
  { name: 'Board Meeting', participants: 12, capacity: 15, category: 'Meeting' },
  { name: 'Children Workshop', participants: 18, capacity: 20, category: 'Workshop' },
  { name: 'Movie Night', participants: 42, capacity: 60, category: 'Entertainment' },
  { name: 'Fitness Class', participants: 15, capacity: 25, category: 'Sports' },
  { name: 'Art Exhibition', participants: 28, capacity: 40, category: 'Culture' },
  { name: 'Book Club', participants: 10, capacity: 15, category: 'Education' },
];

const categoryData = [
  { name: 'Social', value: 35, color: '#8884d8' },
  { name: 'Meeting', value: 12, color: '#82ca9d' },
  { name: 'Workshop', value: 18, color: '#ffc658' },
  { name: 'Entertainment', value: 42, color: '#ff8042' },
  { name: 'Sports', value: 15, color: '#0088fe' },
  { name: 'Culture', value: 28, color: '#00C49F' },
  { name: 'Education', value: 10, color: '#FFBB28' },
];

const memberActivityData = [
  { id: '1', name: 'Robert Wilson', eventsAttended: 12, stars: 15, status: 'active' },
  { id: '2', name: 'Linda Johnson', eventsAttended: 8, stars: 6, status: 'active' },
  { id: '3', name: 'Michael Brown', eventsAttended: 10, stars: 9, status: 'active' },
  { id: '4', name: 'Sarah Davis', eventsAttended: 5, stars: 3, status: 'passive' },
  { id: '5', name: 'Thomas Miller', eventsAttended: 2, stars: 0, status: 'passive' },
  { id: '6', name: 'Emma Clark', eventsAttended: 15, stars: 20, status: 'active' },
  { id: '7', name: 'James Wilson', eventsAttended: 7, stars: 8, status: 'active' },
  { id: '8', name: 'Emily Taylor', eventsAttended: 4, stars: 2, status: 'passive' },
  { id: '9', name: 'Daniel White', eventsAttended: 0, stars: 0, status: 'passive' },
  { id: '10', name: 'Olivia Martinez', eventsAttended: 9, stars: 11, status: 'active' },
];

const ReportingView: React.FC = () => {
  const [eventTimeframe, setEventTimeframe] = useState('all');
  const [activityFilter, setActivityFilter] = useState('all');

  const filteredMembers = memberActivityData.filter(member => {
    if (activityFilter === 'all') return true;
    return member.status === activityFilter;
  });

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Event Participation
              </CardTitle>
              <CardDescription>
                Overview of event attendance and popularity
              </CardDescription>
            </div>
            <Select value={eventTimeframe} onValueChange={setEventTimeframe}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="chart" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="chart">Chart View</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="category">By Category</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chart" className="pt-4">
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={eventParticipationData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="participants" fill="#8884d8" name="Participants" />
                    <Bar dataKey="capacity" fill="#82ca9d" name="Capacity" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="table" className="pt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Fill Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {eventParticipationData.map((event, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{event.name}</TableCell>
                        <TableCell>{event.category}</TableCell>
                        <TableCell>{event.participants}</TableCell>
                        <TableCell>{event.capacity}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-primary h-2.5 rounded-full" 
                                style={{ width: `${(event.participants / event.capacity) * 100}%` }}
                              ></div>
                            </div>
                            <span className="whitespace-nowrap">
                              {Math.round((event.participants / event.capacity) * 100)}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="category" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium">Most Popular Categories</h3>
                  <div className="space-y-3">
                    {categoryData
                      .sort((a, b) => b.value - a.value)
                      .map((category, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                            <span>{category.name}</span>
                          </div>
                          <div className="text-sm">{category.value} participants</div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Member Activity
              </CardTitle>
              <CardDescription>
                Track member participation and engagement
              </CardDescription>
            </div>
            <Select value={activityFilter} onValueChange={setActivityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Members" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Members</SelectItem>
                <SelectItem value="active">Active Members</SelectItem>
                <SelectItem value="passive">Passive Members</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Events Attended</TableHead>
                  <TableHead>Stars Earned</TableHead>
                  <TableHead>Activity Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>
                      {member.status === 'active' ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          Passive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{member.eventsAttended}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="mr-1">{member.stars}</span>
                        <Award className="h-4 w-4 text-amber-500" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          {member.eventsAttended > 0 ? (
                            <div 
                              className={`h-2.5 rounded-full ${
                                member.eventsAttended > 10 
                                  ? 'bg-green-500' 
                                  : member.eventsAttended > 5 
                                    ? 'bg-blue-500' 
                                    : 'bg-amber-500'
                              }`}
                              style={{ width: `${Math.min(member.eventsAttended * 6, 100)}%` }}
                            ></div>
                          ) : (
                            <div className="bg-red-300 h-2.5 rounded-full w-[5%]"></div>
                          )}
                        </div>
                        <span className="whitespace-nowrap text-xs">
                          {member.eventsAttended > 10 
                            ? 'High' 
                            : member.eventsAttended > 5 
                              ? 'Medium' 
                              : member.eventsAttended > 0 
                                ? 'Low' 
                                : 'None'}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportingView;
