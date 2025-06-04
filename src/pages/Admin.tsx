
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";
import { 
  Users, 
  Calendar as CalendarIcon, 
  Settings, 
  FileText, 
  Plus,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  Download
} from "lucide-react";
import { format } from "date-fns";
import { events as mockEvents, familyMembers as mockFamilyMembers } from "@/data/mockDatabase";

// Define User interface for admin panel
interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  email: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected';
  registeredAt: string;
}

// Mock users data for admin panel
const mockUsers: AdminUser[] = [
  {
    id: "1",
    firstName: "Mari",
    lastName: "Tamm",
    nationalId: "39801010001",
    email: "mari.tamm@email.ee",
    phone: "+372 5123 4567",
    status: "approved",
    registeredAt: "2024-01-15"
  },
  {
    id: "2", 
    firstName: "Jaan",
    lastName: "Kask",
    nationalId: "48512150002",
    email: "jaan.kask@email.ee",
    phone: "+372 5234 5678",
    status: "pending",
    registeredAt: "2024-03-20"
  },
  {
    id: "3",
    firstName: "Liisa",
    lastName: "Mets",
    nationalId: "37205120003",
    email: "liisa.mets@email.ee", 
    phone: "+372 5345 6789",
    status: "approved",
    registeredAt: "2024-02-10"
  }
];

// Extended Event interface for admin functionality
interface AdminEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  targetAge?: string;
  participants?: Array<{
    id: string;
    firstName: string;
    lastName: string;
  }>;
}

const Admin: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState<AdminUser[]>(mockUsers);
  const [events, setEvents] = useState<AdminEvent[]>(mockEvents.map(event => ({
    ...event,
    targetAge: "Perekonnad",
    participants: []
  })));
  const [familyMembers, setFamilyMembers] = useState(mockFamilyMembers);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [targetAgeFilter, setTargetAgeFilter] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<AdminEvent | null>(null);
  const [selectedMember, setSelectedMember] = useState<string>("");
  const [availableMembers, setAvailableMembers] = useState<any[]>([]);
  const [participantsDialogOpen, setParticipantsDialogOpen] = useState(false);

  // Check if user is admin
  if (!user?.isAdmin) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Juurdepääs keelatud</h2>
            <p className="mt-2 text-gray-600">Sul pole õigusi admin paneeli kasutamiseks.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const approveUser = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: 'approved' as const } : user
    ));
    
    toast({
      title: "Kasutaja kinnitatud",
      description: "Kasutaja on edukalt kinnitatud ja saab nüüd süsteemi kasutada.",
    });
  };

  const rejectUser = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: 'rejected' as const } : user
    ));
    
    toast({
      title: "Kasutaja tagasi lükatud",
      description: "Kasutaja registreering on tagasi lükatud.",
    });
  };

  const deleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    
    toast({
      title: "Kasutaja kustutatud",
      description: "Kasutaja on süsteemist kustutatud.",
    });
  };

  // Filter events based on selected criteria
  const filteredEvents = events.filter(event => {
    // Age filter
    if (targetAgeFilter !== "all") {
      if (targetAgeFilter === "adults" && event.targetAge !== "Täiskasvanud") return false;
      if (targetAgeFilter === "children" && event.targetAge !== "Lapsed") return false;
      if (targetAgeFilter === "families" && event.targetAge !== "Perekonnad") return false;
    }
    
    // Date filter
    if (selectedDate) {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === selectedDate.getDate() && 
             eventDate.getMonth() === selectedDate.getMonth() && 
             eventDate.getFullYear() === selectedDate.getFullYear();
    }
    
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Kinnitatud</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Ootel</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Tagasi lükatud</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const openParticipantsDialog = (event: AdminEvent) => {
    setSelectedEvent(event);
    setAvailableMembers(familyMembers);
    setParticipantsDialogOpen(true);
  };

  const addParticipant = () => {
    if (selectedMember && selectedEvent) {
      const member = familyMembers.find(m => m.id === selectedMember);
      if (member) {
        const updatedEvents = events.map(event => 
          event.id === selectedEvent.id 
            ? { 
                ...event, 
                participants: [...(event.participants || []), member] 
              }
            : event
        );
        setEvents(updatedEvents);
        setSelectedEvent({
          ...selectedEvent,
          participants: [...(selectedEvent.participants || []), member]
        });
        
        setAvailableMembers(availableMembers.filter(m => m.id !== selectedMember));
        setSelectedMember("");
        
        toast({
          title: "Osaleja lisatud",
          description: `${member.firstName} ${member.lastName} on lisatud üritusele.`,
        });
      }
    }
  };

  const removeParticipant = (participantId: string) => {
    if (selectedEvent) {
      const updatedEvents = events.map(event => 
        event.id === selectedEvent.id 
          ? { 
              ...event, 
              participants: event.participants?.filter(p => p.id !== participantId) || []
            }
          : event
      );
      setEvents(updatedEvents);
      
      const removedMember = selectedEvent.participants?.find(p => p.id === participantId);
      if (removedMember) {
        setAvailableMembers([...availableMembers, removedMember]);
      }
      
      setSelectedEvent({
        ...selectedEvent,
        participants: selectedEvent.participants?.filter(p => p.id !== participantId) || []
      });
      
      toast({
        title: "Osaleja eemaldatud",
        description: "Osaleja on ürituselt eemaldatud.",
      });
    }
  };

  const exportData = () => {
    toast({
      title: "Andmed eksporditud",
      description: "Andmed on edukalt eksporditud.",
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Paneel</h1>
            <p className="text-gray-500 mt-2">
              Haldage kasutajaid, üritusi ja süsteemi seadeid
            </p>
          </div>
          <Button onClick={exportData}>
            <Download className="mr-2 h-4 w-4" />
            Ekspordi Andmed
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Kasutajad</TabsTrigger>
            <TabsTrigger value="events">Üritused</TabsTrigger>
            <TabsTrigger value="reports">Aruanded</TabsTrigger>
            <TabsTrigger value="settings">Seaded</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Kasutajate Haldamine
                </CardTitle>
                <CardDescription>
                  Vaadake ja hallake kõiki süsteemi kasutajaid
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nimi</TableHead>
                        <TableHead>Isikukood</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Telefon</TableHead>
                        <TableHead>Staatus</TableHead>
                        <TableHead>Registreeritud</TableHead>
                        <TableHead>Tegevused</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.firstName} {user.lastName}
                          </TableCell>
                          <TableCell>{user.nationalId}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.phone}</TableCell>
                          <TableCell>
                            {getStatusBadge(user.status)}
                          </TableCell>
                          <TableCell>
                            {format(new Date(user.registeredAt), "dd.MM.yyyy")}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {user.status === 'pending' && (
                                <>
                                  <Button size="sm" onClick={() => approveUser(user.id)}>
                                    Kinnita
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => rejectUser(user.id)}>
                                    Lükka tagasi
                                  </Button>
                                </>
                              )}
                              <Button size="sm" variant="destructive" onClick={() => deleteUser(user.id)}>
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  Ürituste Haldamine
                </CardTitle>
                <CardDescription>
                  Hallake üritusi ja nende osalejaid
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Filters */}
                  <div className="lg:w-1/3 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">
                        Sihtgrupp
                      </label>
                      <Select value={targetAgeFilter} onValueChange={setTargetAgeFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Vali sihtgrupp" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Kõik</SelectItem>
                          <SelectItem value="adults">Täiskasvanud</SelectItem>
                          <SelectItem value="children">Lapsed</SelectItem>
                          <SelectItem value="families">Perekonnad</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">
                        Kuupäev
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
                          Tühista kuupäev
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Events List */}
                  <div className="lg:w-2/3">
                    <div className="space-y-4">
                      {filteredEvents.map((event) => (
                        <Card key={event.id}>
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg">{event.title}</CardTitle>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  <Edit className="mr-2 h-3 w-3" />
                                  Muuda
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => openParticipantsDialog(event)}
                                >
                                  <Eye className="mr-2 h-3 w-3" />
                                  Osalejad
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Kuupäev:</span> {format(new Date(event.date), "dd.MM.yyyy")}
                              </div>
                              <div>
                                <span className="font-medium">Koht:</span> {event.location}
                              </div>
                              <div>
                                <span className="font-medium">Sihtgrupp:</span> {event.targetAge || "Perekonnad"}
                              </div>
                              <div>
                                <span className="font-medium">Osalejaid:</span> {event.participants?.length || 0}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Kokku Kasutajaid</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{users.length}</div>
                  <p className="text-gray-600">Registreeritud kasutajat</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Aktiivsed Üritused</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{events.length}</div>
                  <p className="text-gray-600">Planeeritud üritust</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Perekonnaliikmed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{familyMembers.length}</div>
                  <p className="text-gray-600">Registreeritud liiget</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Süsteemi Seaded
                </CardTitle>
                <CardDescription>
                  Konfigureerige süsteemi üldsätteid
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Organisatsiooni nimi
                  </label>
                  <Input 
                    value="MTÜ Tartu Pereliit" 
                    className="mt-1"
                    readOnly
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Maksimaalne registreerimiste arv ürituse kohta
                  </label>
                  <Input 
                    type="number"
                    defaultValue="50" 
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Automaatne kinnitamine
                  </label>
                  <Select defaultValue="manual">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Käsitsi kinnitamine</SelectItem>
                      <SelectItem value="auto">Automaatne kinnitamine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button>Salvesta Seaded</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Participants Dialog */}
      <Dialog open={participantsDialogOpen} onOpenChange={setParticipantsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Ürituse Osalejad</DialogTitle>
            <DialogDescription>
              {selectedEvent && `${selectedEvent.title} - ${format(new Date(selectedEvent.date), "dd.MM.yyyy")}`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Add Participant */}
              <div>
                <h3 className="text-lg font-medium mb-4">Lisa Osaleja</h3>
                <div className="space-y-4">
                  <Select value={selectedMember} onValueChange={setSelectedMember}>
                    <SelectTrigger>
                      <SelectValue placeholder="Vali pereliige" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.firstName} {member.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    onClick={addParticipant}
                    disabled={!selectedMember}
                    className="w-full"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Lisa Osaleja
                  </Button>
                </div>
              </div>
              
              {/* Current Participants */}
              <div>
                <h3 className="text-lg font-medium mb-4">Praegused Osalejad</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedEvent.participants && selectedEvent.participants.length > 0 ? (
                    selectedEvent.participants.map((participant: any) => (
                      <div key={participant.id} className="flex justify-between items-center p-2 border rounded">
                        <span>{participant.firstName} {participant.lastName}</span>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => removeParticipant(participant.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">Osalejaid pole</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setParticipantsDialogOpen(false)}>
              Sulge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Admin;
