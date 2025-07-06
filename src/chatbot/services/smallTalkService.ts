export class SmallTalkService {
  private static instance: SmallTalkService;
  
  private greetings = [
    'hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening',
    'howdy', 'what\'s up', 'sup', 'yo', 'greetings'
  ];

  private farewells = [
    'bye', 'goodbye', 'see you', 'see ya', 'take care', 'farewell',
    'until next time', 'have a good day', 'good night'
  ];

  private thanks = [
    'thank you', 'thanks', 'thx', 'appreciate it', 'grateful'
  ];

  private howAreYou = [
    'how are you', 'how\'s it going', 'how do you do', 'what\'s up',
    'how have you been', 'are you ok', 'are you alright'
  ];

  private compliments = [
    'you\'re great', 'you\'re awesome', 'you\'re amazing', 'you\'re helpful',
    'good job', 'well done', 'excellent', 'brilliant'
  ];

  private constructor() {}

  public static getInstance(): SmallTalkService {
    if (!SmallTalkService.instance) {
      SmallTalkService.instance = new SmallTalkService();
    }
    return SmallTalkService.instance;
  }

  public detectSmallTalk(userMessage: string): { type: string; confidence: number } {
    const normalizedMessage = userMessage.toLowerCase().trim();
    
    if (this.greetings.some(greeting => normalizedMessage.includes(greeting))) {
      return { type: 'greeting', confidence: 0.9 };
    }
    
    if (this.farewells.some(farewell => normalizedMessage.includes(farewell))) {
      return { type: 'farewell', confidence: 0.9 };
    }
    
    if (this.thanks.some(thank => normalizedMessage.includes(thank))) {
      return { type: 'thanks', confidence: 0.8 };
    }
    
    if (this.howAreYou.some(phrase => normalizedMessage.includes(phrase))) {
      return { type: 'how_are_you', confidence: 0.8 };
    }
    
    if (this.compliments.some(compliment => normalizedMessage.includes(compliment))) {
      return { type: 'compliment', confidence: 0.7 };
    }

    // Check for very short messages that might be small talk
    if (normalizedMessage.length < 20 && !normalizedMessage.includes('?')) {
      return { type: 'casual', confidence: 0.5 };
    }

    return { type: 'none', confidence: 0 };
  }

  public generateSmallTalkResponse(type: string): string {
    const responses = {
      greeting: [
        "Hello! 👋 How can I help you today?",
        "Hi there! 😊 What would you like to know about our GDG community?",
        "Hey! Welcome to GDG Hive AI Hub! 🚀 How can I assist you?",
        "Greetings! I'm here to help with any questions about our community or events."
      ],
      farewell: [
        "Goodbye! 👋 Feel free to come back anytime if you have more questions!",
        "See you later! 😊 Have a great day!",
        "Take care! 🚀 Keep exploring our amazing tech community!",
        "Farewell! Don't hesitate to reach out if you need help in the future."
      ],
      thanks: [
        "You're welcome! 😊 I'm happy to help!",
        "Anytime! That's what I'm here for! 🚀",
        "My pleasure! Feel free to ask more questions!",
        "Glad I could help! 😊 Is there anything else you'd like to know?"
      ],
      how_are_you: [
        "I'm doing great, thanks for asking! 😊 How about you?",
        "I'm functioning perfectly and ready to help! 🚀",
        "I'm excellent! Always happy to assist with GDG-related questions!",
        "I'm doing well! Ready to help you explore our tech community! 😊"
      ],
      compliment: [
        "Thank you! 😊 I try my best to be helpful!",
        "That's very kind of you! 🚀 I'm here to make your experience better!",
        "Thanks! I appreciate that! 😊 How else can I assist you?",
        "You're too kind! 😊 I'm just doing what I can to help our community!"
      ],
      casual: [
        "That's interesting! 😊 Is there anything specific about our GDG community you'd like to know?",
        "Nice! 🚀 While we're chatting, feel free to ask about our events or community!",
        "Cool! 😊 I'm here if you have any questions about our tech community!",
        "Great! 🚀 Don't hesitate to ask about our GDG activities or events!"
      ]
    };

    const typeResponses = responses[type as keyof typeof responses] || responses.casual;
    const randomIndex = Math.floor(Math.random() * typeResponses.length);
    return typeResponses[randomIndex];
  }

  public isSmallTalk(userMessage: string): boolean {
    const detection = this.detectSmallTalk(userMessage);
    return detection.confidence > 0.5;
  }
} 