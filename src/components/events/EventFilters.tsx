
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
        <CardTitle>Otsi üritusi</CardTitle>
        <CardDescription>
          Filtreeri üritusi märksõna, kategooria või vanusegrupi järgi
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div>
            <Input
              placeholder="Otsi üritusi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Kategooria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">Kõik kategooriad</SelectItem>
                <SelectItem value="Sports">Sport</SelectItem>
                <SelectItem value="Education">Haridus</SelectItem>
                <SelectItem value="Social">Suhtlus</SelectItem>
                <SelectItem value="Arts">Kunst</SelectItem>
                <SelectItem value="Games">Mängud</SelectItem>
              </SelectContent>
            </Select>

            <Select value={ageFilter} onValueChange={setAgeFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Vanusegrupp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">Kõik vanused</SelectItem>
                <SelectItem value="Children">Lapsed (5-12)</SelectItem>
                <SelectItem value="Teens">Noored (13-17)</SelectItem>
                <SelectItem value="Adults">Täiskasvanud (18+)</SelectItem>
                <SelectItem value="Seniors">Vanemad (65+)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {selectedDate && (
            <div className="flex items-center justify-between bg-primary/10 p-2 rounded-md">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                <span>Filtreerimine kuupäeva järgi: {selectedDate.toLocaleDateString('et-EE')}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedDate(undefined)}
              >
                Tühista
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventFilters;
