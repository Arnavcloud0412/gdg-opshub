import { FAQService } from './faqService';
import { SmallTalkService } from './smallTalkService';
import { TourService } from './tourService';
import { ChatbotResponse, ChatbotConfig } from '../types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export class ChatbotService {
  private static instance: ChatbotService;
  private faqService: FAQService;
  private smallTalkService: SmallTalkService;
  private tourService: TourService;
  private config: ChatbotConfig;

  private constructor() {
    this.faqService = FAQService.getInstance();
    this.smallTalkService = SmallTalkService.getInstance();
    this.tourService = TourService.getInstance();
    this.config = {
      name: 'GDG Assistant',
      welcomeMessage: 'Hello! I\'m your GDG Assistant. I can help you with questions about our community, events, and more. How can I assist you today?',
      maxHistoryLength: 10,
      useFAQ: true,
      useGemini: true,
      smallTalkEnabled: true
    };
  }

  public static getInstance(): ChatbotService {
    if (!ChatbotService.instance) {
      ChatbotService.instance = new ChatbotService();
    }
    return ChatbotService.instance;
  }

  public getConfig(): ChatbotConfig {
    return this.config;
  }

  public updateConfig(newConfig: Partial<ChatbotConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  public async processMessage(userMessage: string): Promise<ChatbotResponse> {
    const normalizedMessage = userMessage.toLowerCase().trim();

    // Check for tour requests first
    if (this.tourService.isTourRequest(userMessage)) {
      const tourDetection = this.tourService.detectTourRequest(userMessage);
      const tourResponse = this.tourService.generateTourResponse(tourDetection.tourId);
      
      return {
        answer: tourResponse,
        source: 'tour',
        confidence: tourDetection.confidence,
        tourId: tourDetection.tourId
      };
    }

    // Check for small talk
    if (this.config.smallTalkEnabled && this.smallTalkService.isSmallTalk(userMessage)) {
      const smallTalkDetection = this.smallTalkService.detectSmallTalk(userMessage);
      const response = this.smallTalkService.generateSmallTalkResponse(smallTalkDetection.type);
      
      return {
        answer: response,
        source: 'small-talk',
        confidence: smallTalkDetection.confidence
      };
    }

    // Try FAQ search
    if (this.config.useFAQ) {
      const faqResults = await this.faqService.searchFAQ(userMessage);
      
      if (faqResults.length > 0) {
        const bestMatch = faqResults[0];
        const relatedQuestions = faqResults.slice(1).map(faq => faq.question);
        
        return {
          answer: bestMatch.answer,
          source: 'faq',
          confidence: 0.8,
          relatedQuestions
        };
      }
    }

    // Fall back to Gemini API
    if (this.config.useGemini && GEMINI_API_KEY) {
      try {
        const geminiResponse = await this.callGeminiAPI(userMessage);
        return {
          answer: geminiResponse,
          source: 'gemini',
          confidence: 0.6
        };
      } catch (error) {
        console.error('Gemini API error:', error);
      }
    }

    // Default response if all else fails
    return {
      answer: "I'm sorry, I don't have a specific answer for that question. Could you try rephrasing it or ask about our GDG community, events, or general tech topics?",
      source: 'faq',
      confidence: 0.1
    };
  }

  private async callGeminiAPI(userMessage: string): Promise<string> {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a helpful assistant for a Google Developer Group (GDG) community. 
            
Context: You help answer questions about GDG events, community activities, tech topics, and general developer community information.

User Question: ${userMessage}

Please provide a helpful, friendly, and informative response. Keep it conversational and engaging. If you don't know something specific about GDG, you can provide general helpful information about developer communities or suggest they check the official GDG website.

Response should be concise (2-3 sentences) and friendly.`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 500,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 
           "I'm sorry, I couldn't generate a response right now. Please try asking about our GDG community or events!";
  }

  public async getSuggestedQuestions(): Promise<string[]> {
    try {
      const faqData = await this.faqService.getFAQData();
      const randomQuestions = faqData
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(faq => faq.question);
      
      return randomQuestions;
    } catch (error) {
      return [
        "What events are coming up?",
        "How can I join the GDG community?",
        "What is GDG?"
      ];
    }
  }

  public getWelcomeMessage(): string {
    return this.config.welcomeMessage;
  }
} 