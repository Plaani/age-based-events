
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";

// Define types for events and registration
interface FamilyLimit {
  type: "fixed" | "proportional" | "unlimited";
  value: number | null;
}

interface WaitingListEntry {
  userId: string;
  timestamp: string;
  familyMembers?: number;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  ageRange: string;
  category: string;
  registered: boolean;
  deadline: string;
  capacity: number;
  spotsLeft: number;
  price: number;
  familyLimit: FamilyLimit;
  waitingList: WaitingListEntry[];
}

interface RegistrationDialogProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onRegister: (eventId: string, includeFamily: boolean, familyMembers?: number) => void;
}

const RegistrationDialog: React.FC<RegistrationDialogProps> = ({ event, isOpen, onClose, onRegister }) => {
  const [includeFamily, setIncludeFamily] = useState(false);
  const [familyMembers, setFamilyMembers] = useState(1);
  const { user } = useAuth();
  
  // Calculate maximum family members allowed based on family limit type
  const getMaxFamilyMembers = () => {
    if (!event.familyLimit || event.familyLimit.type === "unlimited") return 10; // Arbitrary high number
    
    if (event.familyLimit.type === "fixed") {
      return event.familyLimit.value || 1;
    }
    
    if (event.familyLimit.type === "proportional") {
      const percentage = event.familyLimit.value || 0;
      return Math.max(1, Math.floor((percentage / 100) * event.capacity));
    }
    
    return 1;
  };

  const maxFamilyMembers = getMaxFamilyMembers();
  const isFull = event.spotsLeft <= 0;
  const familyOptions = Array.from({ length: maxFamilyMembers }, (_, i) => i + 1);
  
  // Format date function moved inside component
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Register for {event.title}</DialogTitle>
          <DialogDescription>
            {isFull ? (
              "This event is full. You will be added to the waiting list."
            ) : (
              `Complete your registration for this event. ${event.spotsLeft} spots remaining.`
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium">Event Details</h4>
            <p className="text-sm text-gray-500">
              {formatDate(event.date)} • {event.time}<br />
              Location: {event.location}<br />
              Price: ${event.price}
            </p>
          </div>
          
          {user?.familyId && (
            <div className="space-y-2">
              <h4 className="font-medium">Family Registration</h4>
              
              {event.familyLimit.type !== "unlimited" ? (
                <p className="text-sm text-gray-500">
                  This event has a limit of {event.familyLimit.type === "fixed" 
                    ? `${event.familyLimit.value} family members` 
                    : `${event.familyLimit.value}% of total capacity (${maxFamilyMembers} members)`} per registration.
                </p>
              ) : (
                <p className="text-sm text-gray-500">
                  This event allows unlimited family members per registration.
                </p>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="includeFamily"
                  checked={includeFamily}
                  onChange={() => setIncludeFamily(!includeFamily)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="includeFamily" className="text-sm font-medium">
                  Include family members
                </label>
              </div>
              
              {includeFamily && (
                <div className="pt-2">
                  <label className="text-sm font-medium">Number of family members (including you)</label>
                  <Select 
                    value={familyMembers.toString()} 
                    onValueChange={(value) => setFamilyMembers(parseInt(value))}
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select number" />
                    </SelectTrigger>
                    <SelectContent>
                      {familyOptions.map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "person" : "people"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
          
          {isFull && (
            <div className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
              <p className="text-sm text-yellow-800">
                You will be placed on a waiting list. We'll notify you if a spot becomes available.
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={() => onRegister(event.id, includeFamily, includeFamily ? familyMembers : undefined)}
            className="bg-primary text-white hover:bg-primary/90"
          >
            {isFull ? "Join Waiting List" : "Complete Registration"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationDialog;
