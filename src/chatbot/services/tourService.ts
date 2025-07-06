export interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string; // CSS selector or page identifier
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: 'click' | 'navigate' | 'highlight';
  page?: string; // For navigation steps
}

export interface WebsiteTour {
  id: string;
  name: string;
  description: string;
  steps: TourStep[];
}

export class TourService {
  private static instance: TourService;
  
  private tours: WebsiteTour[] = [
    {
      id: 'main-tour',
      name: 'GDG Hive AI Hub Tour',
      description: 'A comprehensive tour of our GDG community platform',
      steps: [
        {
          id: 'welcome',
          title: 'Welcome to GDG Hive AI Hub!',
          description: 'This is your central hub for all GDG community activities. Let me show you around!',
          target: 'body',
          position: 'top'
        },
        {
          id: 'dashboard',
          title: 'Dashboard',
          description: 'Your main dashboard shows an overview of events, members, and tasks. This is where you can quickly see what\'s happening in the community.',
          target: 'dashboard-section',
          position: 'bottom',
          action: 'navigate',
          page: 'dashboard'
        },
        {
          id: 'events',
          title: 'Events Management',
          description: 'Here you can view, create, and manage GDG events. From tech talks to workshops, this is where all our community events are organized.',
          target: 'events-section',
          position: 'bottom',
          action: 'navigate',
          page: 'events'
        },
        {
          id: 'members',
          title: 'Community Members',
          description: 'Meet your fellow GDG community members! You can view profiles, connect with others, and see who\'s active in the community.',
          target: 'members-section',
          position: 'bottom',
          action: 'navigate',
          page: 'members'
        },
        {
          id: 'tasks',
          title: 'Task Management',
          description: 'Stay organized with our task management system. Create tasks, assign them to team members, and track progress for community projects.',
          target: 'tasks-section',
          position: 'bottom',
          action: 'navigate',
          page: 'tasks'
        },
        {
          id: 'ai-docs',
          title: 'AI Documentation',
          description: 'Access AI-powered documentation and resources. This section helps with event documentation, content creation, and community insights.',
          target: 'ai-docs-section',
          position: 'bottom',
          action: 'navigate',
          page: 'ai-docs'
        },
        {
          id: 'chatbot',
          title: 'Your AI Assistant',
          description: 'That\'s me! I\'m here to help you with questions about GDG, events, and anything else you need. Just click the chat button anytime!',
          target: '.chatbot-widget',
          position: 'left'
        },
        {
          id: 'navigation',
          title: 'Navigation',
          description: 'Use the navigation menu to switch between different sections of the platform. Each section has its own specialized features.',
          target: 'nav-menu',
          position: 'bottom'
        },
        {
          id: 'profile',
          title: 'Your Profile',
          description: 'Manage your profile, update your information, and customize your GDG experience. You can also see your activity and contributions.',
          target: 'profile-section',
          position: 'bottom'
        },
        {
          id: 'complete',
          title: 'Tour Complete!',
          description: 'You\'re all set! You now know your way around the GDG Hive AI Hub. Feel free to explore and don\'t hesitate to ask me if you need help with anything.',
          target: 'body',
          position: 'top'
        }
      ]
    },
    {
      id: 'events-tour',
      name: 'Events Tour',
      description: 'Learn how to use the events management system',
      steps: [
        {
          id: 'events-overview',
          title: 'Events Overview',
          description: 'This is where you can see all upcoming and past GDG events. Events are organized by date and include details like location, speakers, and registration.',
          target: 'events-list',
          position: 'bottom'
        },
        {
          id: 'create-event',
          title: 'Create New Event',
          description: 'Click the "Create Event" button to add a new GDG event. You can set the title, date, location, description, and other details.',
          target: 'create-event-btn',
          position: 'bottom'
        },
        {
          id: 'event-details',
          title: 'Event Details',
          description: 'Click on any event to see detailed information, manage registrations, and update event details.',
          target: 'event-card',
          position: 'bottom'
        }
      ]
    },
    {
      id: 'quick-tour',
      name: 'Quick Overview',
      description: 'A brief overview of the main features',
      steps: [
        {
          id: 'quick-dashboard',
          title: 'Dashboard',
          description: 'Your command center - see events, members, and tasks at a glance.',
          target: 'dashboard-section',
          position: 'bottom',
          action: 'navigate',
          page: 'dashboard'
        },
        {
          id: 'quick-events',
          title: 'Events',
          description: 'Browse and manage GDG community events.',
          target: 'events-section',
          position: 'bottom',
          action: 'navigate',
          page: 'events'
        },
        {
          id: 'quick-chat',
          title: 'Need Help?',
          description: 'I\'m always here to help! Just click the chat button for assistance.',
          target: '.chatbot-widget',
          position: 'left'
        }
      ]
    }
  ];

  private constructor() {}

  public static getInstance(): TourService {
    if (!TourService.instance) {
      TourService.instance = new TourService();
    }
    return TourService.instance;
  }

  public getTours(): WebsiteTour[] {
    return this.tours;
  }

  public getTour(tourId: string): WebsiteTour | null {
    return this.tours.find(tour => tour.id === tourId) || null;
  }

  public getMainTour(): WebsiteTour {
    return this.tours[0];
  }

  public getQuickTour(): WebsiteTour {
    return this.tours[2];
  }

  public detectTourRequest(userMessage: string): { tourId: string; confidence: number } {
    const normalizedMessage = userMessage.toLowerCase();
    
    // Main tour detection
    if (normalizedMessage.includes('tour') && (
      normalizedMessage.includes('website') || 
      normalizedMessage.includes('site') || 
      normalizedMessage.includes('platform') ||
      normalizedMessage.includes('show me around') ||
      normalizedMessage.includes('guide me') ||
      normalizedMessage.includes('walk me through')
    )) {
      return { tourId: 'main-tour', confidence: 0.9 };
    }

    // Events tour detection
    if (normalizedMessage.includes('tour') && normalizedMessage.includes('event')) {
      return { tourId: 'events-tour', confidence: 0.8 };
    }

    // Quick tour detection
    if (normalizedMessage.includes('quick') && normalizedMessage.includes('tour')) {
      return { tourId: 'quick-tour', confidence: 0.8 };
    }

    // General tour requests
    if (normalizedMessage.includes('tour') || 
        normalizedMessage.includes('guide') || 
        normalizedMessage.includes('walkthrough') ||
        normalizedMessage.includes('show me') ||
        normalizedMessage.includes('how to use') ||
        normalizedMessage.includes('help me navigate')) {
      return { tourId: 'main-tour', confidence: 0.7 };
    }

    return { tourId: '', confidence: 0 };
  }

  public generateTourResponse(tourId: string): string {
    const tour = this.getTour(tourId);
    if (!tour) {
      return "I'd be happy to give you a tour! Let me show you around the GDG Hive AI Hub platform.";
    }

    const responses = {
      'main-tour': [
        "Great! I'd love to give you a comprehensive tour of the GDG Hive AI Hub! Let me walk you through all the main features and show you how to make the most of our community platform.",
        "Perfect! Let me take you on a complete tour of our platform. I'll show you everything from the dashboard to events management and how to connect with other community members.",
        "Excellent! I'm excited to show you around the GDG Hive AI Hub. This tour will cover all the key features that make our community platform special."
      ],
      'events-tour': [
        "Absolutely! Let me show you how to navigate and use our events management system. You'll learn how to browse events, create new ones, and manage registrations.",
        "Perfect! I'll guide you through the events section and show you how to make the most of our event management features."
      ],
      'quick-tour': [
        "Sure! Let me give you a quick overview of the main features so you can get started right away.",
        "Perfect! I'll show you the essentials in just a few steps so you can start exploring the platform."
      ]
    };

    const tourResponses = responses[tourId as keyof typeof responses] || responses['main-tour'];
    const randomIndex = Math.floor(Math.random() * tourResponses.length);
    
    return tourResponses[randomIndex];
  }

  public getTourSteps(tourId: string): TourStep[] {
    const tour = this.getTour(tourId);
    return tour ? tour.steps : [];
  }

  public isTourRequest(userMessage: string): boolean {
    const detection = this.detectTourRequest(userMessage);
    return detection.confidence > 0.5;
  }
} 