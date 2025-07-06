import React from 'react';
import { Button } from '@/components/ui/button';
import { TourService } from '../services/tourService';
import { Compass } from 'lucide-react';

interface TourTriggerProps {
  tourId?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onTourStart?: (tourId: string) => void;
}

export const TourTrigger: React.FC<TourTriggerProps> = ({
  tourId = 'main-tour',
  variant = 'outline',
  size = 'sm',
  className = '',
  onTourStart
}) => {
  const tourService = TourService.getInstance();

  const handleClick = () => {
    if (onTourStart) {
      onTourStart(tourId);
    }
  };

  const getTourLabel = () => {
    const tour = tourService.getTour(tourId);
    return tour ? tour.name : 'Take a Tour';
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={`gap-2 ${className}`}
    >
      <Compass className="h-4 w-4" />
      {getTourLabel()}
    </Button>
  );
}; 