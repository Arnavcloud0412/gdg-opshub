export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  type: 'text' | 'loading' | 'error';
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  tags?: string[];
}

export interface ChatbotConfig {
  name: string;
  welcomeMessage: string;
  maxHistoryLength: number;
  useFAQ: boolean;
  useGemini: boolean;
  smallTalkEnabled: boolean;
}

export interface ChatbotResponse {
  answer: string;
  source: 'faq' | 'gemini' | 'small-talk' | 'tour';
  confidence?: number;
  relatedQuestions?: string[];
  tourId?: string;
} 