# Website Tour Feature

The chatbot now includes an interactive website tour feature that can guide users through your GDG platform!

## 🎯 **How It Works**

When users ask for a tour, the chatbot will:
1. **Detect tour requests** in natural language
2. **Launch an interactive tour** with step-by-step guidance
3. **Highlight elements** on the page
4. **Navigate between sections** automatically
5. **Provide contextual explanations** for each feature

## 🚀 **Tour Triggers**

Users can request tours in many ways:

### Natural Language Requests
- "Can you give me a tour of the website?"
- "Show me around the platform"
- "I need a guide to navigate this site"
- "How do I use this website?"
- "Walk me through the features"
- "Give me a quick tour"

### Specific Tour Requests
- "Tour the events section"
- "Show me the events tour"
- "Quick tour please"

## 🎨 **Tour Features**

### Interactive Elements
- **Step-by-step guidance** with progress indicators
- **Element highlighting** with blue glow effects
- **Auto-navigation** between pages/sections
- **Play/Pause controls** for automatic advancement
- **Manual navigation** with previous/next buttons
- **Skip to end** option for experienced users

### Visual Design
- **Overlay background** to focus attention
- **Positioned tooltips** that follow elements
- **Progress bar** showing completion status
- **Step indicators** for easy navigation
- **Responsive design** that works on all devices

## 📝 **Available Tours**

### 1. Main Tour (Comprehensive)
- **ID**: `main-tour`
- **Description**: Complete walkthrough of all platform features
- **Steps**: 10 steps covering dashboard, events, members, tasks, AI docs, and more

### 2. Events Tour (Focused)
- **ID**: `events-tour`
- **Description**: Specific guidance for events management
- **Steps**: 3 steps covering events overview, creation, and management

### 3. Quick Tour (Overview)
- **ID**: `quick-tour`
- **Description**: Brief introduction to main features
- **Steps**: 3 steps covering essentials only

## 🔧 **Integration Examples**

### 1. Chatbot Integration (Automatic)
The tour is automatically triggered when users ask for it in the chat:

```tsx
// Already integrated in ChatbotWidget
// Users just need to ask: "Can you give me a tour?"
```

### 2. Manual Tour Trigger
Add a tour button to your navigation or any component:

```tsx
import { TourTrigger, WebsiteTourComponent } from '@/chatbot';
import { useState } from 'react';

function Navigation() {
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [currentTour, setCurrentTour] = useState(null);

  const handleTourStart = (tourId: string) => {
    const tour = tourService.getTour(tourId);
    setCurrentTour(tour);
    setIsTourOpen(true);
  };

  return (
    <nav>
      {/* Your existing navigation */}
      
      <TourTrigger 
        onTourStart={handleTourStart}
        variant="outline"
        size="sm"
      />

      {/* Tour Component */}
      {currentTour && (
        <WebsiteTourComponent
          tour={currentTour}
          isOpen={isTourOpen}
          onClose={() => {
            setIsTourOpen(false);
            setCurrentTour(null);
          }}
          onNavigate={(page) => setCurrentPage(page)}
        />
      )}
    </nav>
  );
}
```

### 3. Welcome Tour for New Users
Automatically show a tour for first-time visitors:

```tsx
import { useEffect } from 'react';
import { TourService, WebsiteTourComponent } from '@/chatbot';

function App() {
  const [showWelcomeTour, setShowWelcomeTour] = useState(false);
  const tourService = TourService.getInstance();

  useEffect(() => {
    // Check if user is new
    const isNewUser = !localStorage.getItem('hasSeenTour');
    if (isNewUser) {
      setShowWelcomeTour(true);
      localStorage.setItem('hasSeenTour', 'true');
    }
  }, []);

  return (
    <div>
      {/* Your app content */}
      
      {showWelcomeTour && (
        <WebsiteTourComponent
          tour={tourService.getMainTour()}
          isOpen={showWelcomeTour}
          onClose={() => setShowWelcomeTour(false)}
          onNavigate={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
}
```

### 4. Contextual Tour Help
Show specific tours based on user actions:

```tsx
function EventsPage() {
  const [showEventsTour, setShowEventsTour] = useState(false);
  const tourService = TourService.getInstance();

  const handleHelpClick = () => {
    setShowEventsTour(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1>Events</h1>
        <Button onClick={handleHelpClick} variant="ghost">
          <HelpCircle className="h-4 w-4" />
          Help
        </Button>
      </div>

      {/* Events content */}

      <WebsiteTourComponent
        tour={tourService.getTour('events-tour')}
        isOpen={showEventsTour}
        onClose={() => setShowEventsTour(false)}
      />
    </div>
  );
}
```

## 🎛️ **Customization**

### Custom Tour Steps
You can create custom tours by modifying the TourService:

```tsx
// In tourService.ts
const customTour: WebsiteTour = {
  id: 'custom-tour',
  name: 'Custom Feature Tour',
  description: 'Tour of custom features',
  steps: [
    {
      id: 'step-1',
      title: 'Custom Feature',
      description: 'This is a custom feature explanation',
      target: '.custom-feature', // CSS selector
      position: 'bottom'
    },
    // Add more steps...
  ]
};
```

### Styling Customization
Customize the tour appearance:

```css
/* Custom tour styles */
.tour-highlight {
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5) !important;
  border-radius: 8px !important;
}

.tour-tooltip {
  --tour-primary-color: #your-color;
  --tour-secondary-color: #your-color;
}
```

### Tour Behavior
Configure tour behavior:

```tsx
// Auto-advance timing
const autoAdvanceDelay = 3000; // 3 seconds

// Tour triggers
const tourTriggers = [
  'tour',
  'guide',
  'walkthrough',
  'show me around',
  'help me navigate'
];
```

## 🧪 **Testing the Tour**

### Test Scenarios
1. **Chatbot Tour Request**
   - Ask: "Can you give me a tour?"
   - Verify tour launches automatically

2. **Manual Tour Trigger**
   - Click tour button
   - Verify tour starts correctly

3. **Tour Navigation**
   - Test previous/next buttons
   - Test auto-play functionality
   - Test skip to end

4. **Element Highlighting**
   - Verify elements are highlighted
   - Check tooltip positioning
   - Test responsive behavior

### Sample Test Commands
```bash
# Test in chatbot
"Give me a tour of the website"
"Show me around the platform"
"I need help navigating this site"
"Can you walk me through the features?"
"Quick tour please"
```

## 🎯 **Best Practices**

### 1. Tour Content
- Keep descriptions concise and clear
- Focus on value and benefits
- Use action-oriented language
- Include next steps for users

### 2. User Experience
- Don't force tours on users
- Provide easy ways to skip or exit
- Make tours skippable and resumable
- Consider user skill levels

### 3. Performance
- Load tour data efficiently
- Minimize DOM manipulation
- Clean up highlights properly
- Handle navigation gracefully

### 4. Accessibility
- Ensure keyboard navigation works
- Provide screen reader support
- Use high contrast colors
- Include alternative text

## 🚀 **Next Steps**

1. **Test the tour feature** with your current setup
2. **Customize tour content** for your specific features
3. **Add tour triggers** to your navigation
4. **Consider welcome tours** for new users
5. **Monitor tour usage** and gather feedback
6. **Iterate and improve** based on user needs

The tour feature is now fully integrated and ready to help your users navigate the GDG platform effectively! 🎉 