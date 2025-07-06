import { useState, useCallback } from 'react';
import { ChatbotService } from '../services/chatbotService';
import { ChatMessage, ChatbotResponse } from '../types';

export const useChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatbotService = ChatbotService.getInstance();

  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    const loadingMessage: ChatMessage = {
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
      
      const assistantMessage: ChatMessage = {
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

      return response;
    } catch (error) {
      console.error('Error processing message:', error);
      
      const errorMessage: ChatMessage = {
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

      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const initializeChat = useCallback(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      content: chatbotService.getWelcomeMessage(),
      role: 'assistant',
      timestamp: new Date(),
      type: 'text'
    };
    setMessages([welcomeMessage]);
  }, []);

  return {
    isOpen,
    messages,
    isLoading,
    toggleChat,
    sendMessage,
    clearMessages,
    initializeChat,
    chatbotService
  };
}; 