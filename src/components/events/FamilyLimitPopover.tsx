
import React from 'react';
import { Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface FamilyLimit {
  type: "fixed" | "proportional" | "unlimited";
  value: number | null;
}

interface FamilyLimitPopoverProps {
  familyLimit: FamilyLimit;
}

const FamilyLimitPopover: React.FC<FamilyLimitPopoverProps> = ({ familyLimit }) => {
  let description;
  
  switch (familyLimit.type) {
    case "fixed":
      description = `Maximum ${familyLimit.value} family members allowed`;
      break;
    case "proportional":
      description = `Limited to ${familyLimit.value}% of total capacity for family members`;
      break;
    case "unlimited":
      description = "No limit on family participants";
      break;
  }
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 p-0 hover:bg-transparent">
          <Users className="h-4 w-4 text-gray-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 text-sm p-3">
        <div className="font-medium">Family Participation Limit</div>
        <p className="text-gray-600 mt-1">{description}</p>
      </PopoverContent>
    </Popover>
  );
};

export default FamilyLimitPopover;
