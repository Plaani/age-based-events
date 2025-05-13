
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface EventFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  ageFilter: string;
  setAgeFilter: (value: string) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
}

const EventFilters: React.FC<EventFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  ageFilter,
  setAgeFilter,
  selectedDate,
  setSelectedDate
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Find Events</CardTitle>
        <CardDescription>
          Filter events by keyword, category, or age group
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div>
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                <SelectItem value="Sports">Sports</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Social">Social</SelectItem>
                <SelectItem value="Arts">Arts</SelectItem>
                <SelectItem value="Games">Games</SelectItem>
              </SelectContent>
            </Select>

            <Select value={ageFilter} onValueChange={setAgeFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Age Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Ages</SelectItem>
                <SelectItem value="Children">Children (5-12)</SelectItem>
                <SelectItem value="Teens">Teens (13-17)</SelectItem>
                <SelectItem value="Adults">Adults (18+)</SelectItem>
                <SelectItem value="Seniors">Seniors (65+)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {selectedDate && (
            <div className="flex items-center justify-between bg-primary/10 p-2 rounded-md">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                <span>Filtering by date: {selectedDate.toLocaleDateString()}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedDate(undefined)}
              >
                Clear
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventFilters;
