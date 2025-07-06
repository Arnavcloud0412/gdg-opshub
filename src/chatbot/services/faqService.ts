import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FAQItem } from '../types';

export class FAQService {
  private static instance: FAQService;
  private faqCache: FAQItem[] = [];
  private lastFetch: Date | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): FAQService {
    if (!FAQService.instance) {
      FAQService.instance = new FAQService();
    }
    return FAQService.instance;
  }

  private async fetchFAQData(): Promise<FAQItem[]> {
    try {
      const faqCollection = collection(db, 'faq_data');
      const q = query(faqCollection, orderBy('question'), limit(100));
      const querySnapshot = await getDocs(q);
      
      const faqItems: FAQItem[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        faqItems.push({
          id: doc.id,
          question: data.question || '',
          answer: data.answer || '',
          category: data.category || '',
          tags: data.tags || []
        });
      });

      return faqItems;
    } catch (error) {
      console.error('Error fetching FAQ data:', error);
      return [];
    }
  }

  public async getFAQData(): Promise<FAQItem[]> {
    const now = new Date();
    
    // Return cached data if it's still valid
    if (this.faqCache.length > 0 && this.lastFetch && 
        (now.getTime() - this.lastFetch.getTime()) < this.CACHE_DURATION) {
      return this.faqCache;
    }

    // Fetch fresh data
    this.faqCache = await this.fetchFAQData();
    this.lastFetch = now;
    return this.faqCache;
  }

  public async searchFAQ(userQuestion: string): Promise<FAQItem[]> {
    const faqData = await this.getFAQData();
    const normalizedQuestion = userQuestion.toLowerCase().trim();

    // Simple keyword matching - you can enhance this with more sophisticated search
    const matchingFAQs = faqData.filter(faq => {
      const questionWords = faq.question.toLowerCase().split(/\s+/);
      const answerWords = faq.answer.toLowerCase().split(/\s+/);
      const userWords = normalizedQuestion.split(/\s+/);

      // Check if any user words match question or answer
      return userWords.some(userWord => 
        questionWords.some(qWord => qWord.includes(userWord) || userWord.includes(qWord)) ||
        answerWords.some(aWord => aWord.includes(userWord) || userWord.includes(aWord))
      );
    });

    // Sort by relevance (simple scoring)
    return matchingFAQs.sort((a, b) => {
      const aScore = this.calculateRelevanceScore(a, normalizedQuestion);
      const bScore = this.calculateRelevanceScore(b, normalizedQuestion);
      return bScore - aScore;
    }).slice(0, 3); // Return top 3 matches
  }

  private calculateRelevanceScore(faq: FAQItem, userQuestion: string): number {
    let score = 0;
    const userWords = userQuestion.split(/\s+/);
    const questionWords = faq.question.toLowerCase().split(/\s+/);
    const answerWords = faq.answer.toLowerCase().split(/\s+/);

    // Exact matches get higher scores
    userWords.forEach(userWord => {
      if (questionWords.includes(userWord)) score += 3;
      if (answerWords.includes(userWord)) score += 1;
      
      // Partial matches
      questionWords.forEach(qWord => {
        if (qWord.includes(userWord) || userWord.includes(qWord)) score += 1;
      });
    });

    return score;
  }

  public async getRandomFAQ(): Promise<FAQItem | null> {
    const faqData = await this.getFAQData();
    if (faqData.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * faqData.length);
    return faqData[randomIndex];
  }
} 