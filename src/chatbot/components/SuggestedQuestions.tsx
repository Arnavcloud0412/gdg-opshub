import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface SuggestedQuestionsProps {
  questions: string[];
  onQuestionClick: (question: string) => void;
}

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ 
  questions, 
  onQuestionClick 
}) => {
  if (questions.length === 0) return null;

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">Suggested Questions</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {questions.map((question, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="text-xs bg-white hover:bg-blue-50 border-blue-200 text-blue-700"
              onClick={() => onQuestionClick(question)}
            >
              {question}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 