
import React, { useState } from "react";
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
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import VolunteerTask, { Volunteer, VolunteerTask as VolunteerTaskType } from "@/components/volunteers/VolunteerTask";
import { Award, CalendarDays, ClipboardCheck, Filter, MapPin, Plus, Star, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Mock data for volunteer tasks
const mockTasks: VolunteerTaskType[] = [
  {
    id: "1",
    title: "Community Garden Clean-up",
    description: "Help clean and prepare the community garden for spring planting. Tools and refreshments provided.",
    date: new Date(2025, 5, 15),
    location: "Central Park Community Garden",
    duration: 3,
    spotsAvailable: 5,
    spotsTotal: 10,
    starsReward: 5,
    category: "Environment",
    volunteers: [
      { id: "1", name: "Robert Wilson", nationalId: "6705142345" },
      { id: "2", name: "Linda Johnson", nationalId: "7809124567" },
      { id: "3", name: "Michael Brown", nationalId: "9102056789" },
      { id: "4", name: "Sarah Davis", nationalId: "8501234567" },
      { id: "5", name: "Thomas Miller", nationalId: "9003123456" },
    ]
  },
  {
    id: "2",
    title: "Food Bank Distribution",
    description: "Help sort and distribute food packages to families in need. No experience required.",
    date: new Date(2025, 5, 20),
    location: "City Food Bank",
    duration: 4,
    spotsAvailable: 3,
    spotsTotal: 8,
    starsReward: 6,
    category: "Community Service",
    volunteers: [
      { id: "1", name: "Robert Wilson", nationalId: "6705142345" },
      { id: "6", name: "Emma Clark", nationalId: "8712090123" },
      { id: "7", name: "James Wilson", nationalId: "8806121234" },
      { id: "8", name: "Emily Taylor", nationalId: "9205043456" },
      { id: "9", name: "Daniel White", nationalId: "7701023456" },
    ]
  },
  {
    id: "3",
    title: "After-School Program Assistance",
    description: "Help children with homework and participate in educational activities at the community center.",
    date: new Date(2025, 5, 25),
    location: "Downtown Community Center",
    duration: 2,
    spotsAvailable: 2,
    spotsTotal: 6,
    starsReward: 4,
    category: "Education",
    volunteers: [
      { id: "2", name: "Linda Johnson", nationalId: "7809124567" },
      { id: "6", name: "Emma Clark", nationalId: "8712090123" },
      { id: "10", name: "Olivia Martinez", nationalId: "9103056789" },
      { id: "11", name: "William Anderson", nationalId: "8407089012" },
    ]
  },
  {
    id: "4",
    title: "Senior Home Visit",
    description: "Spend time with elderly residents. Activities include reading, playing games, and general companionship.",
    date: new Date(2025, 6, 5),
    location: "Golden Years Residence",
    duration: 2,
    spotsAvailable: 4,
    spotsTotal: 4,
    starsReward: 3,
    category: "Healthcare",
    volunteers: []
  },
  {
    id: "5",
    title: "Community Festival Setup",
    description: "Help set up booths, decorations, and equipment for the annual community festival.",
    date: new Date(2025, 6, 10),
    location: "City Square",
    duration: 5,
    spotsAvailable: 0,
    spotsTotal: 15,
    starsReward: 7,
    category: "Event",
    volunteers: [
      { id: "1", name: "Robert Wilson", nationalId: "6705142345" },
      { id: "2", name: "Linda Johnson", nationalId: "7809124567" },
      { id: "3", name: "Michael Brown", nationalId: "9102056789" },
      { id: "4", name: "Sarah Davis", nationalId: "8501234567" },
      { id: "5", name: "Thomas Miller", nationalId: "9003123456" },
      { id: "6", name: "Emma Clark", nationalId: "8712090123" },
      { id: "7", name: "James Wilson", nationalId: "8806121234" },
      { id: "8", name: "Emily Taylor", nationalId: "9205043456" },
      { id: "9", name: "Daniel White", nationalId: "7701023456" },
      { id: "10", name: "Olivia Martinez", nationalId: "9103056789" },
      { id: "11", name: "William Anderson", nationalId: "8407089012" },
      { id: "12", name: "Sophia Garcia", nationalId: "8903124567" },
      { id: "13", name: "Benjamin Moore", nationalId: "9008076543" },
      { id: "14", name: "Ava Wilson", nationalId: "8512093456" },
      { id: "15", name: "Alexander Lee", nationalId: "8307056789" }
    ]
  }
];

// Mock user volunteer history
const mockUserVolunteering = [
  {
    taskId: "1",
    taskTitle: "Community Garden Clean-up",
    date: new Date(2025, 5, 15),
    starsEarned: 5,
    status: "upcoming"
  },
  {
    taskId: "2",
    taskTitle: "Food Bank Distribution",
    date: new Date(2025, 5, 20),
    starsEarned: 6,
    status: "upcoming"
  },
  {
    taskId: "old-1",
    taskTitle: "Winter Clothing Drive",
    date: new Date(2025, 2, 10),
    starsEarned: 4,
    status: "completed"
  },
  {
    taskId: "old-2",
    taskTitle: "Children's Hospital Visit",
    date: new Date(2025, 4, 5),
    starsEarned: 3,
    status: "completed"
  }
];

const categories = [
  "All Categories",
  "Environment",
  "Community Service",
  "Education",
  "Healthcare",
  "Event",
  "Sports",
  "Other"
];

const Volunteers: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [selectedTask, setSelectedTask] = useState<VolunteerTaskType | null>(null);
  const [showVolunteers, setShowVolunteers] = useState(false);
  const [volunteersTab, setVolunteersTab] = useState<'upcoming' | 'completed'>('upcoming');
  const [tasks] = useState<VolunteerTaskType[]>(mockTasks);
  const [myTasks] = useState(mockUserVolunteering);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  const filteredTasks = tasks.filter(task => {
    // Search filter
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = category === 'All Categories' || task.category === category;
    
    // Date filter
    const matchesDate = !selectedDate || 
      (task.date.getDate() === selectedDate.getDate() && 
       task.date.getMonth() === selectedDate.getMonth() && 
       task.date.getFullYear() === selectedDate.getFullYear());
    
    return matchesSearch && matchesCategory && matchesDate;
  });
  
  // Filter user's volunteer tasks based on tab
  const filteredUserTasks = myTasks.filter(task => task.status === volunteersTab);
  
  const handleVolunteer = (task: VolunteerTaskType) => {
    setSelectedTask(task);
  };
  
  const confirmVolunteer = () => {
    if (selectedTask) {
      toast({
        title: "Volunteering Confirmed",
        description: `You have volunteered for ${selectedTask.title}.`,
      });
      
      setSelectedTask(null);
    }
  };
  
  const viewVolunteers = (task: VolunteerTaskType) => {
    setSelectedTask(task);
    setShowVolunteers(true);
  };
  
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center">
              <ClipboardCheck className="h-8 w-8 mr-2 text-primary" />
              Volunteer Opportunities
            </h1>
            <p className="text-gray-500 mt-1">
              Contribute to the community and earn stars
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
              <h3 className="text-lg font-medium mb-4">Find Opportunities</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="search-tasks" className="text-sm font-medium text-gray-700">
                    Search
                  </label>
                  <Input 
                    id="search-tasks"
                    placeholder="Search volunteer tasks..."
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
              <h3 className="text-lg font-medium mb-4">My Volunteering</h3>
              
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
                        ? "No upcoming volunteer tasks" 
                        : "No completed volunteer tasks"}
                    </div>
                  )}
                </div>
              </Tabs>
            </div>
          </div>
          
          {/* Right column with volunteer tasks */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  {category === 'All Categories' 
                    ? 'All Volunteer Tasks' 
                    : `${category} Tasks`}
                  {selectedDate && ` - ${format(selectedDate, 'PP')}`}
                </h2>
                <Badge variant="outline" className="bg-primary/10">
                  {filteredTasks.length} task{filteredTasks.length !== 1 && 's'}
                </Badge>
              </div>
              
              {filteredTasks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTasks.map((task) => (
                    <VolunteerTask 
                      key={task.id} 
                      task={task}
                      onVolunteer={() => handleVolunteer(task)}
                      onViewVolunteers={() => viewVolunteers(task)}
                      showVolunteerButton={user !== null}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <ClipboardCheck className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-600">No volunteer tasks found</h3>
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
      <Dialog open={!!selectedTask && !showVolunteers} onOpenChange={() => setSelectedTask(null)}>
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
