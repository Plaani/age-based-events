
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Eye, EyeOff, UserPlus } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

export interface VolunteerTask {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  duration: number; // in hours
  spotsAvailable: number;
  spotsTotal: number;
  starsReward: number;
  category: string;
  volunteers: Volunteer[];
  createdBy: string;
  creatorId: string;
  isPublished: boolean;
  invitedVolunteers?: string[]; // New field for invited volunteers
}

export interface Volunteer {
  id: string;
  name: string;
  nationalId: string;
}

interface VolunteerTaskProps {
  task: VolunteerTask;
  onVolunteer?: () => void;
  onViewVolunteers?: () => void;
  onToggleVisibility?: () => void;
  showVolunteerButton?: boolean;
  onUpdateTask?: (updatedTask: VolunteerTask) => void;
}

const VolunteerTask: React.FC<VolunteerTaskProps> = ({ 
  task, 
  onVolunteer, 
  onViewVolunteers,
  onToggleVisibility,
  showVolunteerButton = true,
  onUpdateTask
}) => {
  const { user } = useAuth();
  const spotsLeft = task.spotsTotal - task.volunteers.length;
  const isFull = spotsLeft === 0;
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [maxVolunteers, setMaxVolunteers] = useState(task.spotsTotal.toString());
  
  // Determine if current user has rights to manage this event
  const canManageEvent = 
    user?.isAdmin || 
    task.creatorId === user?.id || 
    (user?.isVolunteer && user?.volunteerFor?.includes('all'));

  const handleInviteVolunteer = () => {
    if (!inviteEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    // Here we would typically send an invitation via email
    // For this mock-up, we'll just add to the invited list
    const updatedTask = {
      ...task,
      invitedVolunteers: [...(task.invitedVolunteers || []), inviteEmail]
    };
    
    if (onUpdateTask) {
      onUpdateTask(updatedTask);
    }

    toast({
      title: "Invitation Sent",
      description: `An invitation has been sent to ${inviteEmail}`
    });

    setInviteEmail('');
    setShowInviteDialog(false);
  };

  const handleUpdateSpots = () => {
    const newTotal = parseInt(maxVolunteers);
    
    if (isNaN(newTotal) || newTotal < 1) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid number greater than 0",
        variant: "destructive"
      });
      return;
    }

    // If new total is less than current volunteers, show warning
    if (newTotal < task.volunteers.length) {
      toast({
        title: "Warning",
        description: `This will reduce capacity below current volunteer count (${task.volunteers.length})`,
        variant: "destructive"
      });
      return;
    }

    const updatedTask = {
      ...task,
      spotsTotal: newTotal
    };
    
    if (onUpdateTask) {
      onUpdateTask(updatedTask);
    }

    toast({
      title: "Spots Updated",
      description: `Maximum volunteer spots updated to ${newTotal}`
    });
    
    setShowInviteDialog(false);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{task.title}</CardTitle>
            <CardDescription>{format(task.date, "PPP")}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {!task.isPublished && (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                Draft
              </Badge>
            )}
            <Badge variant={isFull ? "outline" : "secondary"} className={isFull ? "bg-gray-100" : ""}>
              {task.category}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{task.description}</p>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <p className="font-medium text-gray-700">Location</p>
            <p>{task.location}</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Duration</p>
            <p>{task.duration} hour{task.duration !== 1 ? 's' : ''}</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Availability</p>
            <div className="flex items-center">
              <span className={isFull ? 'text-red-600 font-medium' : ''}>
                {task.volunteers.length}/{task.spotsTotal} spots filled
              </span>
            </div>
          </div>
          <div>
            <p className="font-medium text-gray-700">Reward</p>
            <div className="flex items-center">
              <span className="mr-1">{task.starsReward}</span>
              <Award className="h-4 w-4 text-amber-500" />
            </div>
          </div>
        </div>
        
        <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${isFull ? 'bg-red-500' : 'bg-green-500'}`} 
            style={{ width: `${(task.volunteers.length / task.spotsTotal) * 100}%` }}
          ></div>
        </div>

        {task.invitedVolunteers && task.invitedVolunteers.length > 0 && (
          <div className="mt-3 text-sm">
            <p className="font-medium text-gray-700">Invited:</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {task.invitedVolunteers.map((email, index) => (
                <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {email}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="flex gap-2">
          {onViewVolunteers && (
            <Button variant="outline" size="sm" onClick={onViewVolunteers}>
              View Volunteers ({task.volunteers.length})
            </Button>
          )}
          {canManageEvent && onToggleVisibility && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onToggleVisibility}
              className="flex items-center gap-1"
            >
              {task.isPublished ? (
                <>
                  <EyeOff className="h-4 w-4" /> 
                  <span>Make Draft</span>
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  <span>Publish</span>
                </>
              )}
            </Button>
          )}
          {canManageEvent && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowInviteDialog(true)}
              className="flex items-center gap-1"
            >
              <UserPlus className="h-4 w-4" />
              <span>Manage Volunteers</span>
            </Button>
          )}
        </div>
        
        {showVolunteerButton && (
          <Button 
            variant={isFull ? "outline" : "default"} 
            size="sm"
            disabled={isFull || !task.isPublished}
            onClick={onVolunteer}
          >
            {!task.isPublished ? 'Not Published' : isFull ? 'Task Full' : 'Volunteer'}
          </Button>
        )}
      </CardFooter>

      {/* Dialog for inviting volunteers and updating spots */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Volunteers</DialogTitle>
            <DialogDescription>
              Invite volunteers directly or update the maximum number of spots.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="font-medium">Send Direct Invitation</h3>
              <div className="flex gap-2">
                <Input 
                  placeholder="Email address" 
                  value={inviteEmail} 
                  onChange={(e) => setInviteEmail(e.target.value)} 
                  className="flex-1"
                />
                <Button onClick={handleInviteVolunteer}>Invite</Button>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h3 className="font-medium">Maximum Volunteers</h3>
              <div className="flex gap-2">
                <Input 
                  type="number" 
                  min="1"
                  value={maxVolunteers} 
                  onChange={(e) => setMaxVolunteers(e.target.value)} 
                  className="flex-1"
                />
                <Button onClick={handleUpdateSpots}>Update</Button>
              </div>
              <p className="text-xs text-gray-500">
                Current volunteers: {task.volunteers.length} / {task.spotsTotal}
              </p>
            </div>

            {task.invitedVolunteers && task.invitedVolunteers.length > 0 && (
              <div className="space-y-2 pt-2">
                <h3 className="font-medium">Invited Volunteers</h3>
                <div className="flex flex-wrap gap-1">
                  {task.invitedVolunteers.map((email, index) => (
                    <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {email}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default VolunteerTask;
