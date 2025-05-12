
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Award, Users, Calendar } from "lucide-react";

// Mock data for reports
const eventParticipationData = [
  { name: 'Summer Picnic', participants: 35, capacity: 50, category: 'Social' },
  { name: 'Board Meeting', participants: 12, capacity: 15, category: 'Meeting' },
  { name: 'Children Workshop', participants: 18, capacity: 20, category: 'Workshop' },
  { name: 'Movie Night', participants: 42, capacity: 60, category: 'Entertainment' },
  { name: 'Fitness Class', participants: 15, capacity: 25, category: 'Sports' },
  { name: 'Art Exhibition', participants: 28, capacity: 40, category: 'Culture' },
  { name: 'Book Club', events: 10, capacity: 15, category: 'Education' },
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

// Mock data for volunteer reporting
const volunteerData = [
  { id: '1', name: 'Robert Wilson', volunteeredEvents: 8, hours: 24, rating: 4.9, status: 'active' },
  { id: '2', name: 'Linda Johnson', volunteeredEvents: 5, hours: 15, rating: 4.7, status: 'active' },
  { id: '3', name: 'Michael Brown', volunteeredEvents: 7, hours: 21, rating: 4.8, status: 'active' },
  { id: '4', name: 'Sarah Davis', volunteeredEvents: 3, hours: 9, rating: 4.2, status: 'passive' },
  { id: '6', name: 'Emma Clark', volunteeredEvents: 10, hours: 30, rating: 5.0, status: 'active' },
  { id: '10', name: 'Olivia Martinez', volunteeredEvents: 6, hours: 18, rating: 4.5, status: 'active' },
];

// Volunteer hours by month data
const volunteerHoursData = [
  { month: 'Jan', hours: 45 },
  { month: 'Feb', hours: 52 },
  { month: 'Mar', hours: 48 },
  { month: 'Apr', hours: 70 },
  { month: 'May', hours: 95 },
  { month: 'Jun', hours: 120 },
  { month: 'Jul', hours: 110 },
  { month: 'Aug', hours: 85 },
  { month: 'Sep', hours: 75 },
  { month: 'Oct', hours: 65 },
  { month: 'Nov', hours: 55 },
  { month: 'Dec', hours: 80 },
];

// Volunteer distribution by event type
const volunteerDistributionData = [
  { type: 'Social Events', volunteers: 15, color: '#8884d8' },
  { type: 'Workshops', volunteers: 8, color: '#82ca9d' },
  { type: 'Administrative', volunteers: 5, color: '#ffc658' },
  { type: 'Fundraising', volunteers: 12, color: '#ff8042' },
  { type: 'Technical Support', volunteers: 6, color: '#0088fe' },
  { type: 'Community Outreach', volunteers: 10, color: '#00C49F' },
];

const ReportingView: React.FC = () => {
  const [eventTimeframe, setEventTimeframe] = useState('all');
  const [activityFilter, setActivityFilter] = useState('all');
  const [volunteerTimeframe, setVolunteerTimeframe] = useState('all');

  const filteredMembers = memberActivityData.filter(member => {
    if (activityFilter === 'all') return true;
    return member.status === activityFilter;
  });

  const filteredVolunteers = volunteerData.filter(volunteer => {
    if (volunteerTimeframe === 'all') return true;
    return volunteer.status === volunteerTimeframe;
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
      
      {/* New Volunteer Information Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5" />
                Volunteer Activity
              </CardTitle>
              <CardDescription>
                Overview of volunteer participation and contributions
              </CardDescription>
            </div>
            <Select value={volunteerTimeframe} onValueChange={setVolunteerTimeframe}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Volunteers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Volunteers</SelectItem>
                <SelectItem value="active">Active Volunteers</SelectItem>
                <SelectItem value="passive">Inactive Volunteers</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="volunteers" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="volunteers">Volunteer List</TabsTrigger>
              <TabsTrigger value="hours">Volunteer Hours</TabsTrigger>
              <TabsTrigger value="distribution">Event Distribution</TabsTrigger>
            </TabsList>
            
            {/* Volunteer List Tab */}
            <TabsContent value="volunteers" className="pt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Events</TableHead>
                      <TableHead>Total Hours</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Activity Level</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVolunteers.map((volunteer) => (
                      <TableRow key={volunteer.id}>
                        <TableCell className="font-medium">{volunteer.name}</TableCell>
                        <TableCell>
                          {volunteer.status === 'active' ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              Inactive
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{volunteer.volunteeredEvents}</TableCell>
                        <TableCell>{volunteer.hours}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="mr-1">{volunteer.rating}</span>
                            <Award className="h-4 w-4 text-amber-500" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              {volunteer.volunteeredEvents > 0 ? (
                                <div 
                                  className={`h-2.5 rounded-full ${
                                    volunteer.volunteeredEvents > 7 
                                      ? 'bg-green-500' 
                                      : volunteer.volunteeredEvents > 4 
                                        ? 'bg-blue-500' 
                                        : 'bg-amber-500'
                                  }`}
                                  style={{ width: `${Math.min(volunteer.volunteeredEvents * 10, 100)}%` }}
                                ></div>
                              ) : (
                                <div className="bg-red-300 h-2.5 rounded-full w-[5%]"></div>
                              )}
                            </div>
                            <span className="whitespace-nowrap text-xs">
                              {volunteer.volunteeredEvents > 7 
                                ? 'High' 
                                : volunteer.volunteeredEvents > 4 
                                  ? 'Medium' 
                                  : volunteer.volunteeredEvents > 0 
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
            </TabsContent>
            
            {/* Volunteer Hours Tab */}
            <TabsContent value="hours" className="pt-4">
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={volunteerHoursData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="hours" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                      name="Volunteer Hours"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-green-50 border border-green-100 p-4 rounded-lg">
                  <div className="font-medium text-green-800">Total Hours</div>
                  <div className="text-3xl font-bold text-green-900 mt-1">
                    {volunteerHoursData.reduce((sum, item) => sum + item.hours, 0)}
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                  <div className="font-medium text-blue-800">Avg. Monthly</div>
                  <div className="text-3xl font-bold text-blue-900 mt-1">
                    {Math.round(volunteerHoursData.reduce((sum, item) => sum + item.hours, 0) / volunteerHoursData.length)}
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg">
                  <div className="font-medium text-amber-800">Active Volunteers</div>
                  <div className="text-3xl font-bold text-amber-900 mt-1">
                    {volunteerData.filter(v => v.status === 'active').length}
                  </div>
                </div>
                <div className="bg-purple-50 border border-purple-100 p-4 rounded-lg">
                  <div className="font-medium text-purple-800">Avg. per Volunteer</div>
                  <div className="text-3xl font-bold text-purple-900 mt-1">
                    {Math.round(volunteerData.reduce((sum, vol) => sum + vol.hours, 0) / volunteerData.length)}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Volunteer Distribution Tab */}
            <TabsContent value="distribution" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={volunteerDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="volunteers"
                        nameKey="type"
                      >
                        {volunteerDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium">Volunteer Distribution by Event Type</h3>
                  <div className="space-y-3">
                    {volunteerDistributionData
                      .sort((a, b) => b.volunteers - a.volunteers)
                      .map((category, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                            <span>{category.type}</span>
                          </div>
                          <div className="text-sm">{category.volunteers} volunteers</div>
                        </div>
                      ))
                    }
                  </div>
                  <div className="mt-6 pt-4 border-t">
                    <h4 className="font-medium mb-2">Key Insights</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Social Events have the highest volunteer engagement</li>
                      <li>• Administrative tasks need more volunteer support</li>
                      <li>• Technical Support has specialized volunteers with high retention</li>
                      <li>• Fundraising events attract experienced volunteers</li>
                    </ul>
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
