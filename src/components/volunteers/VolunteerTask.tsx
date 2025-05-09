
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";
import { format } from "date-fns";

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
  showVolunteerButton?: boolean;
}

const VolunteerTask: React.FC<VolunteerTaskProps> = ({ 
  task, 
  onVolunteer, 
  onViewVolunteers,
  showVolunteerButton = true
}) => {
  const spotsLeft = task.spotsTotal - task.volunteers.length;
  const isFull = spotsLeft === 0;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{task.title}</CardTitle>
            <CardDescription>{format(task.date, "PPP")}</CardDescription>
          </div>
          <Badge variant={isFull ? "outline" : "secondary"} className={isFull ? "bg-gray-100" : ""}>
            {task.category}
          </Badge>
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
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        {onViewVolunteers && (
          <Button variant="outline" size="sm" onClick={onViewVolunteers}>
            View Volunteers ({task.volunteers.length})
          </Button>
        )}
        {showVolunteerButton && (
          <Button 
            variant={isFull ? "outline" : "default"} 
            size="sm"
            disabled={isFull}
            onClick={onVolunteer}
          >
            {isFull ? 'Task Full' : 'Volunteer'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default VolunteerTask;
