
import { useState } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';

export const locations = [
  "Angel College Center",
  "Hawkins Hall",
  "Wilson Hall"
];

interface LocationSelectorProps {
  type: 'pickup' | 'dropoff';
  value: string;
  onChange: (value: string) => void;
}

const LocationSelector = ({ type, value, onChange }: LocationSelectorProps) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className="space-y-1 w-full">
      <label htmlFor={`${type}-location`} className="flex items-center space-x-2 text-sm font-medium">
        <MapPin className="h-4 w-4 text-ecampus-green" />
        <span>{type === 'pickup' ? 'Pick-up Location' : 'Drop-off Location'}</span>
      </label>
      
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger 
          id={`${type}-location`}
          className={cn(
            "w-full border-2 rounded-lg transition-all duration-200",
            isFocused ? "border-ecampus-green ring-1 ring-ecampus-green" : "border-border"
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          <SelectValue placeholder={`Select ${type === 'pickup' ? 'Pick-up' : 'Drop-off'} Location`} />
        </SelectTrigger>
        <SelectContent>
          {locations.map((location) => (
            <SelectItem key={location} value={location} className="transition-all duration-200 hover:bg-ecampus-green/10">
              {location}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LocationSelector;
