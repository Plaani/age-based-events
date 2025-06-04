import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import VolunteerTask, { Volunteer, VolunteerTask as VolunteerTaskType } from "@/components/volunteers/VolunteerTask";
import { Award, CalendarDays, ClipboardCheck, Filter, MapPin, Plus, Star, Clock, ChevronDown, Calendar as CalendarIcon, Users, UserPlus, Check, X, Ban } from "lucide-react";
import { format, isPast, parseISO, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import {
  volunteerTasks as mockTasks,
  userVolunteerHistory as mockUserVolunteering,
  events as dbEvents,
  familyMembers as dbFamilyMembers
} from "@/data/mockDatabase";

const categories = [
  "All Categories",
  "Environment",
  "Community Service",
  "Education",
  "Healthcare",
  "Event",
  "Sports",
  "Community Event",
  "Meeting",
  "Workshop",
  "Other"
];

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  age: number;
}

// Create a union type for combined items
interface CombinedItem {
  id: string;
  title: string;
  date: Date;
  location: string;
  description: string;
  category: string;
  itemType: 'volunteer-task' | 'event';
  starsReward: number;
  isPublished?: boolean;
  spotsTotal?: number;
  spotsAvailable?: number;
  volunteers?: Volunteer[];
  duration?: number;
  registered?: boolean;
  createdBy?: string;
  creatorId?: string;
}

const Volunteers: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [selectedTask, setSelectedTask] = useState<VolunteerTaskType | null>(null);
  const [showVolunteers, setShowVolunteers] = useState(false);
  const [volunteersTab, setVolunteersTab] = useState<'upcoming' | 'completed'>('upcoming');
  const [tasks, setTasks] = useState<VolunteerTaskType[]>(mockTasks);
  const [myTasks] = useState(mockUserVolunteering);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [events] = useState<EventItem[]>(
    dbEvents.map(e => ({
      id: e.id,
      title: e.title,
      date: new Date(e.date),
      location: e.location,
      description: e.description,
      category: e.category,
      registered: e.registered
    }))
  );
  const [groupsExpanded, setGroupsExpanded] = useState<Record<string, boolean>>({
    "Environment": true,
    "Community Service": true,
    "Education": true,
    "Healthcare": true,
    "Event": true,
    "Sports": true,
    "Community Event": true,
    "Meeting": true,
    "Workshop": true,
    "Other": true
  });
  
  // Family members registration states
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [selectedFamilyMembers, setSelectedFamilyMembers] = useState<string[]>([]);
  const [showFamilySelection, setShowFamilySelection] = useState(false);
  const [registeredTasks, setRegisteredTasks] = useState<Record<string, string[]>>({});
  
  // Load family members and registered tasks
  useEffect(() => {
    // Load family members from localStorage
    const storedFamilyMembers = localStorage.getItem('familyMembers');
    if (storedFamilyMembers) {
      setFamilyMembers(JSON.parse(storedFamilyMembers));
    } else {
      setFamilyMembers(
        dbFamilyMembers.map(m => ({
          id: m.id,
          name: `${m.firstName} ${m.lastName}`,
          relationship: m.relationship,
          age: m.age
        }))
      );
    }
    
    // Load registered tasks from localStorage
    const storedRegistrations = localStorage.getItem('volunteerRegistrations');
    if (storedRegistrations) {
      setRegisteredTasks(JSON.parse(storedRegistrations));
    }
  }, []);
  
  // Save registrations to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(registeredTasks).length > 0) {
      localStorage.setItem('volunteerRegistrations', JSON.stringify(registeredTasks));
    }
  }, [registeredTasks]);
  
  const toggleGroup = (category: string) => {
    setGroupsExpanded(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
  // Check if a task has passed its deadline (for this example, we'll set deadline as 2 days before event)
  const isPastDeadline = (taskDate: Date) => {
    const deadline = addDays(taskDate, -2); // Deadline is 2 days before event
    return isPast(deadline);
  };
  
  // Combine tasks and events into one dataset
  const combinedItems: CombinedItem[] = [
    ...tasks.map(task => ({
      ...task,
      itemType: 'volunteer-task' as const,
      starsReward: task.starsReward
    })),
    ...events.map(event => ({
      ...event,
      itemType: 'event' as const,
      starsReward: 0 // Events don't have star rewards
    }))
  ];
  
  // Filter combined items
  const filteredItems = combinedItems.filter(item => {
    // Search filter
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = category === 'All Categories' || item.category === category;
    
    // Date filter
    const matchesDate = !selectedDate || 
      (item.date.getDate() === selectedDate.getDate() && 
       item.date.getMonth() === selectedDate.getMonth() && 
       item.date.getFullYear() === selectedDate.getFullYear());
    
    return matchesSearch && matchesCategory && matchesDate;
  });
  
  // Group filtered items by category
  const groupedItems = filteredItems.reduce((groups, item) => {
    const category = item.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {} as Record<string, any[]>);
  
  // Sort categories to keep them in consistent order
  const sortedCategories = Object.keys(groupedItems).sort();
  
  // Filter user's volunteer tasks based on tab
  const filteredUserTasks = myTasks.filter(task => task.status === volunteersTab);
  
  // Check if user or any family member is registered for a task
  const isRegisteredForTask = (taskId: string): boolean => {
    return registeredTasks[taskId] !== undefined && registeredTasks[taskId].length > 0;
  };
  
  const handleVolunteer = (task: VolunteerTaskType) => {
    // If family members exist, show family selection dialog
    if (familyMembers.length > 0) {
      setSelectedTask(task);
      setSelectedFamilyMembers([user?.id || '']);  // Default select the current user
      setShowFamilySelection(true);
    } else {
      // If no family members, just register the current user
      setSelectedTask(task);
      setSelectedFamilyMembers([user?.id || '']);
      confirmVolunteer();
    }
  };
  
  const toggleFamilyMemberSelection = (memberId: string) => {
    setSelectedFamilyMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId) 
        : [...prev, memberId]
    );
  };
  
  const confirmVolunteer = () => {
    if (selectedTask) {
      // Register selected family members
      setRegisteredTasks(prev => ({
        ...prev,
        [selectedTask.id]: selectedFamilyMembers
      }));
      
      toast({
        title: "Volunteering Confirmed",
        description: `You have volunteered for ${selectedTask.title} with ${selectedFamilyMembers.length} people.`,
      });
      
      setSelectedTask(null);
      setShowFamilySelection(false);
      
      // Update the tasks list to reflect the new registrations
      setTasks(prev => 
        prev.map(task => 
          task.id === selectedTask.id 
            ? {
                ...task,
                volunteers: [
                  ...task.volunteers,
                  {
                    id: user?.id || 'current-user',
                    name: `${user?.firstName || 'Current'} ${user?.lastName || 'User'}`,
                    nationalId: user?.nationalId || '0000000000'
                  }
                ]
              } 
            : task
        )
      );
    }
  };
  
  const unregisterFromTask = (task: CombinedItem) => {
    // Remove registrations for this task
    setRegisteredTasks(prev => {
      const newRegistrations = { ...prev };
      delete newRegistrations[task.id];
      return newRegistrations;
    });
    
    // Update the tasks list to reflect the cancellation
    if (task.itemType === 'volunteer-task') {
      setTasks(prev => 
        prev.map(t => 
          t.id === task.id 
            ? {
                ...t,
                volunteers: t.volunteers.filter(v => v.id !== user?.id)
              } 
            : t
        )
      );
    }
    
    toast({
      title: "Registration Cancelled",
      description: `You have unregistered from ${task.title}.`,
    });
  };
  
  const viewVolunteers = (task: VolunteerTaskType) => {
    setSelectedTask(task);
    setShowVolunteers(true);
  };

  const handleEventRegistration = (event: CombinedItem) => {
    toast({
      title: "Event Registration",
      description: `You have registered for ${event.title}.`,
    });
  };
  
  // Determine button state for a task or event
  const getButtonState = (item: CombinedItem) => {
    // For volunteer tasks
    if (item.itemType === 'volunteer-task') {
      const isFull = item.volunteers && item.volunteers.length >= (item.spotsTotal || 0);
      const isRegistered = isRegisteredForTask(item.id);
      const pastDeadline = isPastDeadline(item.date);
      
      if (pastDeadline) {
        return {
          text: 'Registration Closed',
          variant: 'outline' as const,
          disabled: true,
          onClick: () => {},
          icon: <Ban className="h-4 w-4 mr-1" />
        };
      }
      
      if (isRegistered) {
        return {
          text: 'Unregister',
          variant: 'destructive' as const,
          disabled: false,
          onClick: () => unregisterFromTask(item),
          icon: <X className="h-4 w-4 mr-1" />
        };
      }
      
      if (isFull) {
        return {
          text: 'Task Full',
          variant: 'outline' as const,
          disabled: true,
          onClick: () => {},
          icon: null
        };
      }
      
      if (!item.isPublished) {
        return {
          text: 'Not Published',
          variant: 'outline' as const,
          disabled: true,
          onClick: () => {},
          icon: null
        };
      }
      
      return {
        text: 'Volunteer',
        variant: 'default' as const,
        disabled: false,
        onClick: () => {
          // Convert CombinedItem to VolunteerTaskType with the required properties
          const volunteerTask: VolunteerTaskType = {
            id: item.id,
            title: item.title,
            date: item.date,
            location: item.location,
            description: item.description,
            category: item.category,
            starsReward: item.starsReward,
            spotsAvailable: item.spotsAvailable || 0,
            spotsTotal: item.spotsTotal || 0,
            volunteers: item.volunteers || [],
            duration: item.duration || 0,
            createdBy: item.createdBy || 'Unknown',
            creatorId: item.creatorId || '0',
            isPublished: item.isPublished || true
          };
          handleVolunteer(volunteerTask);
        },
        icon: <Check className="h-4 w-4 mr-1" />
      };
    }
    
    // For events
    const isRegistered = item.registered;
    return {
      text: isRegistered ? 'Registered' : 'Register',
      variant: isRegistered ? 'outline' as const : 'default' as const,
      disabled: isRegistered,
      onClick: () => handleEventRegistration(item),
      icon: isRegistered ? <Check className="h-4 w-4 mr-1" /> : null
    };
  };
  
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center">
              <ClipboardCheck className="h-8 w-8 mr-2 text-primary" />
              Community Activities
            </h1>
            <p className="text-gray-500 mt-1">
              Register for events and volunteer opportunities
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-primary/10 rounded-full px-3 py-1 text-primary">
              <Award className="h-4 w-4 text-amber-500" />
              <span className="font-medium">{user ? 18 : 0} Stars Earned</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column with filters and calendar */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-medium mb-4">Find Activities</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="search-tasks" className="text-sm font-medium text-gray-700">
                    Search
                  </label>
                  <Input 
                    id="search-tasks"
                    placeholder="Search activities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label htmlFor="category-filter" className="text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category-filter" className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Date
                  </label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="border rounded-md"
                  />
                  {selectedDate && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2 w-full"
                      onClick={() => setSelectedDate(undefined)}
                    >
                      Clear Date
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-medium mb-4">My Activities</h3>
              
              <Tabs value={volunteersTab} onValueChange={(v) => setVolunteersTab(v as 'upcoming' | 'completed')}>
                <TabsList className="w-full">
                  <TabsTrigger value="upcoming" className="flex-1">Upcoming</TabsTrigger>
                  <TabsTrigger value="completed" className="flex-1">Completed</TabsTrigger>
                </TabsList>
                
                <div className="mt-4">
                  {filteredUserTasks.length > 0 ? (
                    <div className="space-y-3">
                      {filteredUserTasks.map((userTask, index) => (
                        <div key={userTask.taskId} className={cn("p-3 rounded-lg", 
                          volunteersTab === 'upcoming' ? "bg-blue-50" : "bg-green-50"
                        )}>
                          <div className="font-medium">{userTask.taskTitle}</div>
                          <div className="text-sm text-gray-600 flex items-center">
                            <CalendarDays className="h-3 w-3 mr-1" /> 
                            {format(userTask.date, "PP")}
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <Badge variant="outline" className={cn(
                              "text-xs",
                              volunteersTab === 'upcoming' 
                                ? "bg-blue-100 text-blue-800" 
                                : "bg-green-100 text-green-800"
                            )}>
                              {volunteersTab === 'upcoming' ? 'Upcoming' : 'Completed'}
                            </Badge>
                            <div className="flex items-center text-amber-600">
                              <span className="text-xs font-medium mr-0.5">{userTask.starsEarned}</span>
                              <Star className="h-3 w-3" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      {volunteersTab === 'upcoming' 
                        ? "No upcoming activities" 
                        : "No completed activities"}
                    </div>
                  )}
                </div>
              </Tabs>
            </div>
          </div>
          
          {/* Right column with combined events and volunteer tasks */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  {category === 'All Categories' 
                    ? 'All Activities' 
                    : `${category} Activities`}
                  {selectedDate && ` - ${format(selectedDate, 'PP')}`}
                </h2>
                <Badge variant="outline" className="bg-primary/10">
                  {filteredItems.length} activit{filteredItems.length !== 1 ? 'ies' : 'y'}
                </Badge>
              </div>
              
              {filteredItems.length > 0 ? (
                <div className="space-y-6">
                  {sortedCategories.map(category => (
                    <Collapsible 
                      key={category}
                      open={groupsExpanded[category]}
                      onOpenChange={() => toggleGroup(category)}
                      className="mb-4"
                    >
                      <CollapsibleTrigger asChild>
                        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md cursor-pointer hover:bg-gray-100 transition-colors">
                          <h3 className="font-medium flex items-center">
                            <span>{category}</span>
                            <Badge variant="outline" className="ml-2 bg-white">
                              {groupedItems[category].length}
                            </Badge>
                          </h3>
                          <ChevronDown className={`h-4 w-4 transition-transform ${groupsExpanded[category] ? 'transform rotate-180' : ''}`} />
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pt-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {groupedItems[category].map((item) => (
                            item.itemType === 'volunteer-task' ? (
                              <div key={item.id} className="border rounded-lg overflow-hidden hover:shadow transition-shadow">
                                <div className="p-4">
                                  <div className="flex items-start justify-between">
                                    <h3 className="font-medium text-base">{item.title}</h3>
                                    <div className="flex items-center gap-2">
                                      {!item.isPublished && (
                                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                          Draft
                                        </Badge>
                                      )}
                                      <Badge variant={isRegisteredForTask(item.id) ? "secondary" : "outline"}>
                                        {isRegisteredForTask(item.id) ? "Registered" : item.category}
                                      </Badge>
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-600 my-2 line-clamp-2">{item.description}</p>
                                  
                                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mt-3">
                                    <div className="flex items-center text-gray-600">
                                      <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                                      <span>{format(item.date, "PP")}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                      <MapPin className="h-3.5 w-3.5 mr-1" />
                                      <span>{item.location}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                      <Clock className="h-3.5 w-3.5 mr-1" />
                                      <span>{item.duration}h</span>
                                    </div>
                                    <div className="flex items-center text-amber-600">
                                      <Award className="h-3.5 w-3.5 mr-1" />
                                      <span>{item.starsReward} stars</span>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className={`h-2 rounded-full ${item.volunteers.length >= item.spotsTotal ? 'bg-red-500' : 'bg-green-500'}`} 
                                      style={{ width: `${(item.volunteers.length / item.spotsTotal) * 100}%` }}
                                    ></div>
                                  </div>
                                  
                                  <div className="flex items-center justify-between mt-3">
                                    <span className="text-sm text-gray-600">
                                      {item.volunteers.length}/{item.spotsTotal} spots
                                    </span>
                                    {user && (
                                      <div className="flex gap-2">
                                        {isRegisteredForTask(item.id) && (
                                          <Badge className="bg-green-100 text-green-800 border-green-200">
                                            You're registered
                                          </Badge>
                                        )}
                                        {(() => {
                                          const buttonState = getButtonState(item);
                                          return (
                                            <Button
                                              variant={buttonState.variant}
                                              size="sm"
                                              disabled={buttonState.disabled}
                                              onClick={buttonState.onClick}
                                              className="flex items-center"
                                            >
                                              {buttonState.icon}
                                              {buttonState.text}
                                            </Button>
                                          );
                                        })()}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div key={item.id} className="border rounded-lg p-4 hover:shadow transition-shadow">
                                <div className="flex items-start justify-between">
                                  <h3 className="font-medium text-base">{item.title}</h3>
                                  <Badge variant={item.registered ? "secondary" : "outline"}>
                                    {item.registered ? "Registered" : "Open"}
                                  </Badge>
                                </div>
                                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{item.description}</p>
                                <div className="flex items-center mt-3 text-sm text-gray-500">
                                  <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                                  <span className="mr-3">{format(item.date, "PP")}</span>
                                  <MapPin className="h-3.5 w-3.5 mr-1" />
                                  <span>{item.location}</span>
                                </div>
                                <div className="flex justify-between items-center mt-3">
                                  <Badge variant="outline" className="text-xs">
                                    {item.category}
                                  </Badge>
                                  {!item.registered && user && (
                                    <Button 
                                      size="sm" 
                                      onClick={() => handleEventRegistration(item)}
                                    >
                                      Register
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <ClipboardCheck className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-600">No activities found</h3>
                  <p className="text-gray-500 mt-1">
                    Try changing your search criteria or check back later
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Volunteer confirmation dialog */}
      <Dialog open={!!selectedTask && !showVolunteers && !showFamilySelection} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Volunteer Confirmation</DialogTitle>
            <DialogDescription>
              Are you sure you want to volunteer for this task?
            </DialogDescription>
          </DialogHeader>
          
          {selectedTask && (
            <div className="py-2">
              <h3 className="font-medium text-lg">{selectedTask.title}</h3>
              
              <div className="mt-2 space-y-2">
                <div className="flex items-start">
                  <CalendarDays className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                  <span>{format(selectedTask.date, "PPP")}</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                  <span>{selectedTask.location}</span>
                </div>
                <div className="flex items-start">
                  <Clock className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                  <span>{selectedTask.duration} hour{selectedTask.duration !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-2 text-amber-500" />
                  <span>You'll earn {selectedTask.starsReward} star{selectedTask.starsReward !== 1 ? 's' : ''}</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <p className="text-sm text-gray-600">
                By volunteering, you commit to attend this event at the specified date and time.
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTask(null)}>
              Cancel
            </Button>
            <Button onClick={confirmVolunteer}>
              Confirm Volunteering
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Family members selection dialog */}
      <Dialog open={showFamilySelection} onOpenChange={() => {
        setShowFamilySelection(false);
        setSelectedTask(null);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Who is volunteering?</DialogTitle>
            <DialogDescription>
              Select family members who will be joining you in this volunteer activity
            </DialogDescription>
          </DialogHeader>
          
          {selectedTask && (
            <div>
              <h3 className="font-medium text-lg mb-2">{selectedTask.title}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {format(selectedTask.date, "PPP")} • {selectedTask.location}
              </p>
              
              <div className="space-y-2 my-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="current-user" 
                    checked={true}
                    disabled={true}
                  />
                  <label htmlFor="current-user" className="font-medium text-sm">
                    You {user && `(${user.firstName} ${user.lastName})`}
                  </label>
                </div>
                
                <Separator className="my-3" />
                
                <div className="font-medium text-sm flex items-center mb-2">
                  <Users className="h-4 w-4 mr-1" />
                  <span>Family Members</span>
                </div>
                
                {familyMembers.length > 0 ? (
                  <div className="space-y-2">
                    {familyMembers.map(member => (
                      <div key={member.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`member-${member.id}`}
                          checked={selectedFamilyMembers.includes(member.id)}
                          onCheckedChange={() => toggleFamilyMemberSelection(member.id)}
                        />
                        <label htmlFor={`member-${member.id}`} className="text-sm flex-1">
                          <div className="font-medium">{member.name}</div>
                          <div className="text-xs text-gray-500">{member.relationship} • {member.age} years old</div>
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p>No family members found</p>
                    <Button variant="link" size="sm" asChild className="mt-1">
                      <a href="/family">Add family members</a>
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800 mt-4">
                <p className="flex items-center">
                  <UserPlus className="h-4 w-4 mr-2 text-blue-500" />
                  <span>
                    You can add more family members from the <a href="/family" className="underline">Family page</a>
                  </span>
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowFamilySelection(false);
              setSelectedTask(null);
            }}>
              Cancel
            </Button>
            <Button 
              onClick={confirmVolunteer}
              disabled={selectedFamilyMembers.length === 0}
            >
              Confirm ({selectedFamilyMembers.length} {selectedFamilyMembers.length === 1 ? 'person' : 'people'})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View volunteers dialog */}
      <Dialog open={showVolunteers} onOpenChange={() => {
        setShowVolunteers(false);
        setSelectedTask(null);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Current Volunteers</DialogTitle>
            <DialogDescription>
              {selectedTask && (
                <>
                  {selectedTask.title} - {format(selectedTask.date, "PPP")}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedTask && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">
                  {selectedTask.volunteers.length}/{selectedTask.spotsTotal} spots filled
                </span>
                <Badge variant={selectedTask.volunteers.length >= selectedTask.spotsTotal ? "destructive" : "outline"}>
                  {selectedTask.volunteers.length >= selectedTask.spotsTotal ? "Full" : `${selectedTask.spotsTotal - selectedTask.volunteers.length} spots left`}
                </Badge>
              </div>
              
              {selectedTask.volunteers.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>ID</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedTask.volunteers.map((volunteer) => (
                        <TableRow key={volunteer.id}>
                          <TableCell className="font-medium">{volunteer.name}</TableCell>
                          <TableCell>{volunteer.nationalId}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 border rounded-md">
                  No volunteers have signed up yet
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowVolunteers(false);
              setSelectedTask(null);
            }}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Volunteers;
