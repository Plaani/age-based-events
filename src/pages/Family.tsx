
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Users, UserPlus, CalendarClock, Share2, Eye, Settings, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";
import { familyMembers as mockFamilyMembers } from "@/data/mockDatabase";

const formSchema = z.object({
  nationalId: z.string().min(10, {
    message: "Isikukood peab olema vähemalt 10 märki.",
  }),
  firstName: z.string().min(1, {
    message: "Eesnimi on kohustuslik.",
  }),
  lastName: z.string().min(1, {
    message: "Perekonnanimi on kohustuslik.",
  }),
  relationship: z.string().min(1, {
    message: "Sugulus on kohustuslik.",
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

  if (!user) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Palun logi sisse</h2>
            <p className="mt-2 text-gray-600">Perekonna haldamiseks peate olema sisse logitud.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
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
      title: "Pereliige lisatud",
      description: `${newMember.firstName} on lisatud teie perekonda.`,
    });
  };

  const handleRemoveMember = (id: string) => {
    const memberToRemove = familyMembers.find(member => member.id === id);
    setFamilyMembers(familyMembers.filter(member => member.id !== id));
    
    toast({
      title: "Pereliige eemaldatud",
      description: `${memberToRemove?.firstName} on teie perekonnast eemaldatud.`,
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
    const action = option === "shareRegistrations" ? "ürituste registreerimisi" : "ostude nähtavust";
    const newValue = !member?.[option];
    
    toast({
      title: "Jagamise eelistus uuendatud",
      description: `${member?.firstName} ${newValue ? 'jagab nüüd' : 'ei jaga enam'} ${action}.`,
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Perekonna Haldamine</h1>
            <p className="text-gray-500 mt-2">
              Hallake oma pereliikmed ja nende jagamise eelistused
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Lisa Pereliige
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
                  <CardDescription>Isikukood: {member.nationalId}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <CalendarClock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Vanus: {member.age} aastat</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Share2 className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Jaga Ürituste Registreerimisi</span>
                        </div>
                        <Switch 
                          checked={member.shareRegistrations} 
                          onCheckedChange={() => toggleSharingOption(member.id, "shareRegistrations")} 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Eye className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">Jaga Ostude Nähtavust</span>
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
                    Muuda
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    <Trash2 className="mr-2 h-3 w-3" />
                    Eemalda
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
            <h3 className="text-lg font-medium text-gray-900">Pereliikmeid pole</h3>
            <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
              Lisage pereliikmed, et alustada kogu perekonna ürituste haldamist
            </p>
            <Button className="mt-6" onClick={() => setIsAddDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Lisa Pereliige
            </Button>
          </div>
        )}
      </div>

      {/* Add Family Member Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Lisa Pereliige</DialogTitle>
            <DialogDescription>
              Sisestage oma pereliikme andmed, et lisada ta perekonda.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="nationalId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Isikukood</FormLabel>
                    <FormControl>
                      <Input placeholder="Sisestage isikukood" {...field} />
                    </FormControl>
                    <FormDescription>
                      Isikukoodi kasutatakse kontrollimiseks ja vanuse arvutamiseks.
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
                      <FormLabel>Eesnimi</FormLabel>
                      <FormControl>
                        <Input placeholder="Eesnimi" {...field} />
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
                      <FormLabel>Perekonnanimi</FormLabel>
                      <FormControl>
                        <Input placeholder="Perekonnanimi" {...field} />
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
                    <FormLabel>Sugulus</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Valige sugulus" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Abikaasa">Abikaasa</SelectItem>
                        <SelectItem value="Laps">Laps</SelectItem>
                        <SelectItem value="Tütar">Tütar</SelectItem>
                        <SelectItem value="Poeg">Poeg</SelectItem>
                        <SelectItem value="Vanem">Vanem</SelectItem>
                        <SelectItem value="Õde/vend">Õde/vend</SelectItem>
                        <SelectItem value="Muu">Muu</SelectItem>
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
                        Jaga Ürituste Registreerimisi
                      </FormLabel>
                      <FormDescription>
                        Lubage sellel pereliikmel näha teie ürituste registreerimisi
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
                        Jaga Ostude Nähtavust
                      </FormLabel>
                      <FormDescription>
                        Lubage sellel pereliikmel näha teie ostude ajalugu
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
                  Tühista
                </Button>
                <Button type="submit">Lisa Pereliige</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Family;
