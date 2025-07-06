import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { SuggestedQuestions } from './SuggestedQuestions';
import { ChatbotService } from '../services/chatbotService';
import { ChatMessage as ChatMessageType, ChatbotResponse } from '../types';
import { MessageCircle, RefreshCw, Settings } from 'lucide-react';

export const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatbotService = ChatbotService.getInstance();

  useEffect(() => {
    initializeChat();
  }, []);

  const initializeChat = () => {
    const welcomeMessage: ChatMessageType = {
      id: 'welcome',
      content: chatbotService.getWelcomeMessage(),
      role: 'assistant',
      timestamp: new Date(),
      type: 'text'
    };
    setMessages([welcomeMessage]);
    loadSuggestedQuestions();
  };

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

  const handleResetChat = () => {
    setMessages([]);
    initializeChat();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">GDG Assistant</h1>
        <p className="text-gray-600">
          Ask me anything about our GDG community, events, or general tech topics!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chat Area */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="bg-blue-600 text-white">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Chat with GDG Assistant
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetChat}
                    className="text-white hover:bg-blue-700"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-blue-700"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 p-0 flex flex-col">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      source={message.role === 'assistant' ? 'faq' : undefined}
                    />
                  ))}
                </div>
                
                {suggestedQuestions.length > 0 && messages.length > 1 && (
                  <div className="mt-6">
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
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleSendMessage("What events are coming up?")}
              >
                📅 Upcoming Events
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleSendMessage("How can I join the GDG community?")}
              >
                👥 Join Community
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleSendMessage("What is GDG?")}
              >
                ℹ️ About GDG
              </Button>
            </CardContent>
          </Card>

          {/* Chat Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Chat Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>FAQ Database Connected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>AI Assistant Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Small Talk Enabled</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 