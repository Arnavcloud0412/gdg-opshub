import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TourStep, WebsiteTour } from '../services/tourService';
import { X, ChevronLeft, ChevronRight, Play, Pause, SkipForward } from 'lucide-react';

interface WebsiteTourProps {
  tour: WebsiteTour;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (page: string) => void;
}

export const WebsiteTourComponent: React.FC<WebsiteTourProps> = ({
  tour,
  isOpen,
  onClose,
  onNavigate
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
  const tourOverlayRef = useRef<HTMLDivElement>(null);
  const currentStep = tour.steps[currentStepIndex];

  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
      setIsPlaying(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      removeHighlight();
    }

    return () => {
      document.body.style.overflow = 'unset';
      removeHighlight();
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && currentStep) {
      highlightElement(currentStep);
      if (currentStep.action === 'navigate' && currentStep.page && onNavigate) {
        onNavigate(currentStep.page);
      }
    }
  }, [currentStepIndex, isOpen, currentStep, onNavigate]);

  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        if (currentStepIndex < tour.steps.length - 1) {
          setCurrentStepIndex(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 3000); // Auto-advance every 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentStepIndex, tour.steps.length]);

  const highlightElement = (step: TourStep) => {
    removeHighlight();
    
    if (step.target === 'body') {
      return;
    }

    const element = document.querySelector(step.target) as HTMLElement;
    if (element) {
      element.style.position = 'relative';
      element.style.zIndex = '1000';
      element.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.5)';
      element.style.borderRadius = '8px';
      setHighlightedElement(element);
    }
  };

  const removeHighlight = () => {
    if (highlightedElement) {
      highlightedElement.style.position = '';
      highlightedElement.style.zIndex = '';
      highlightedElement.style.boxShadow = '';
      highlightedElement.style.borderRadius = '';
      setHighlightedElement(null);
    }
  };

  const nextStep = () => {
    if (currentStepIndex < tour.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const previousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const skipToEnd = () => {
    setCurrentStepIndex(tour.steps.length - 1);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const getTooltipPosition = (step: TourStep) => {
    if (!step.target || step.target === 'body') {
      return 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
    }

    const element = document.querySelector(step.target) as HTMLElement;
    if (!element) {
      return 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
    }

    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    let top = rect.bottom + 10;
    let left = rect.left;

    // Adjust position based on step.position
    switch (step.position) {
      case 'top':
        top = rect.top - 10;
        left = rect.left;
        break;
      case 'bottom':
        top = rect.bottom + 10;
        left = rect.left;
        break;
      case 'left':
        top = rect.top;
        left = rect.left - 10;
        break;
      case 'right':
        top = rect.top;
        left = rect.right + 10;
        break;
    }

    // Ensure tooltip stays within viewport
    if (top + 200 > windowHeight) {
      top = rect.top - 210;
    }
    if (left + 400 > windowWidth) {
      left = windowWidth - 410;
    }
    if (left < 10) {
      left = 10;
    }

    return `fixed top-[${top}px] left-[${left}px]`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        ref={tourOverlayRef}
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />

      {/* Tour Tooltip */}
      <Card 
        className={`z-50 w-96 shadow-2xl border-2 border-blue-500 ${getTooltipPosition(currentStep)}`}
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              {currentStep.title}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            {currentStep.description}
          </p>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Step {currentStepIndex + 1} of {tour.steps.length}</span>
              <span>{Math.round(((currentStepIndex + 1) / tour.steps.length) * 100)}%</span>
            </div>
            <Progress value={(currentStepIndex + 1) / tour.steps.length * 100} className="h-2" />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={previousStep}
                disabled={currentStepIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={nextStep}
                disabled={currentStepIndex === tour.steps.length - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={skipToEnd}
              className="text-xs"
            >
              <SkipForward className="h-3 w-3 mr-1" />
              Skip to end
            </Button>
          </div>

          {/* Step indicators */}
          <div className="flex justify-center gap-1">
            {tour.steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStepIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStepIndex 
                    ? 'bg-blue-500' 
                    : index < currentStepIndex 
                      ? 'bg-blue-300' 
                      : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}; 