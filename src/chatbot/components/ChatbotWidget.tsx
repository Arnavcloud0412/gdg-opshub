import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { SuggestedQuestions } from './SuggestedQuestions';
import { WebsiteTourComponent } from './WebsiteTour';
import { ChatbotService } from '../services/chatbotService';
import { TourService } from '../services/tourService';
import { ChatMessage as ChatMessageType, ChatbotResponse } from '../types';
import { MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';

interface ChatbotWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
  onNavigate?: (page: string) => void;
}

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({ 
  isOpen, 
  onToggle, 
  className = '',
  onNavigate
}) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [currentTour, setCurrentTour] = useState<any>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const chatbotService = ChatbotService.getInstance();
  const tourService = TourService.getInstance();

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initialize with welcome message
      const welcomeMessage: ChatMessageType = {
        id: 'welcome',
        content: chatbotService.getWelcomeMessage(),
        role: 'assistant',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages([welcomeMessage]);
      
      // Load suggested questions
      loadSuggestedQuestions();
    }
  }, [isOpen]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const loadSuggestedQuestions = async () => {
    try {
      const questions = await chatbotService.getSuggestedQuestions();
      setSuggestedQuestions(questions);
    } catch (error) {
      console.error('Error loading suggested questions:', error);
    }
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    const loadingMessage: ChatMessageType = {
      id: (Date.now() + 1).toString(),
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      type: 'loading'
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setIsLoading(true);

    try {
      const response: ChatbotResponse = await chatbotService.processMessage(content);
      
      const assistantMessage: ChatMessageType = {
        id: (Date.now() + 2).toString(),
        content: response.answer,
        role: 'assistant',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== loadingMessage.id);
        return [...filtered, assistantMessage];
      });

      // Handle tour responses
      if (response.source === 'tour' && response.tourId) {
        const tour = tourService.getTour(response.tourId);
        if (tour) {
          setCurrentTour(tour);
          setIsTourOpen(true);
        }
      }

      // Update suggested questions based on response
      if (response.relatedQuestions && response.relatedQuestions.length > 0) {
        setSuggestedQuestions(response.relatedQuestions);
      } else {
        loadSuggestedQuestions();
      }

    } catch (error) {
      console.error('Error processing message:', error);
      
      const errorMessage: ChatMessageType = {
        id: (Date.now() + 2).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
        type: 'error'
      };

      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== loadingMessage.id);
        return [...filtered, errorMessage];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestionClick = (question: string) => {
    handleSendMessage(question);
  };

  const handleMinimizeToggle = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <>
      <Card className={`fixed bottom-4 right-4 w-96 h-[500px] shadow-xl border-0 ${className}`}>
      <CardHeader className="bg-blue-600 text-white p-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            GDG Assistant
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMinimizeToggle}
              className="h-8 w-8 p-0 text-white hover:bg-blue-700"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="h-8 w-8 p-0 text-white hover:bg-blue-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          <CardContent className="p-0 flex flex-col h-[400px]">
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-2">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    source={message.role === 'assistant' ? 'faq' : undefined}
                  />
                ))}
              </div>
              
              {suggestedQuestions.length > 0 && messages.length > 1 && (
                <div className="mt-4">
                  <SuggestedQuestions
                    questions={suggestedQuestions}
                    onQuestionClick={handleSuggestedQuestionClick}
                  />
                </div>
              )}
            </ScrollArea>

            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={isLoading}
              placeholder="Ask me anything about GDG..."
            />
          </CardContent>
        </>
      )}
    </Card>

    {/* Website Tour */}
    {currentTour && (
      <WebsiteTourComponent
        tour={currentTour}
        isOpen={isTourOpen}
        onClose={() => {
          setIsTourOpen(false);
          setCurrentTour(null);
        }}
        onNavigate={onNavigate}
      />
    )}
  </>
  );
}; 