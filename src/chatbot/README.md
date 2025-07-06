# GDG Chatbot

A comprehensive chatbot solution for the GDG Hive AI Hub website that combines FAQ data from Firestore with Gemini AI for intelligent responses and small talk capabilities.

## Features

- **FAQ Integration**: Searches and retrieves answers from Firestore `faq_data` collection
- **AI-Powered Responses**: Uses Google Gemini API for intelligent responses when FAQ doesn't have answers
- **Small Talk**: Handles casual conversations, greetings, and general chit-chat
- **Modern UI**: Beautiful, responsive chat interface with suggested questions
- **Real-time**: Instant responses with loading states and error handling
- **Configurable**: Easy to customize behavior and appearance

## Architecture

```
src/chatbot/
├── types.ts                 # TypeScript interfaces
├── services/
│   ├── faqService.ts        # Firestore FAQ data handling
│   ├── smallTalkService.ts  # Small talk detection and responses
│   └── chatbotService.ts    # Main orchestration service
├── components/
│   ├── ChatbotWidget.tsx    # Main chat widget
│   ├── ChatMessage.tsx      # Individual message component
│   ├── ChatInput.tsx        # Message input component
│   └── SuggestedQuestions.tsx # Suggested questions component
├── hooks/
│   └── useChatbot.ts        # Custom hook for chat state
└── index.ts                 # Public exports
```

## Quick Start

### 1. Basic Integration

Add the chatbot to any page:

```tsx
import { ChatbotWidget } from '@/chatbot';
import { useState } from 'react';

function MyPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div>
      {/* Your page content */}
      <ChatbotWidget 
        isOpen={isChatOpen} 
        onToggle={() => setIsChatOpen(!isChatOpen)} 
      />
    </div>
  );
}
```

### 2. Using the Hook

For more control, use the custom hook:

```tsx
import { useChatbot } from '@/chatbot';

function MyComponent() {
  const { isOpen, messages, sendMessage, toggleChat } = useChatbot();

  const handleSend = async (message: string) => {
    await sendMessage(message);
  };

  return (
    <div>
      <button onClick={toggleChat}>Open Chat</button>
      {/* Custom chat UI */}
    </div>
  );
}
```

## Configuration

### Environment Variables

Add these to your `.env` file:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

### Customizing Behavior

```tsx
import { ChatbotService } from '@/chatbot';

const chatbotService = ChatbotService.getInstance();

// Update configuration
chatbotService.updateConfig({
  name: 'Custom Assistant',
  welcomeMessage: 'Hello! How can I help you today?',
  useFAQ: true,
  useGemini: true,
  smallTalkEnabled: true,
  maxHistoryLength: 20
});
```

## FAQ Data Structure

Your Firestore `faq_data` collection should have documents with this structure:

```typescript
interface FAQDocument {
  question: string;      // The question text
  answer: string;        // The answer text
  category?: string;     // Optional category
  tags?: string[];       // Optional tags for better search
}
```

Example document:
```json
{
  "question": "What is GDG?",
  "answer": "Google Developer Groups (GDG) are local communities of developers interested in Google's developer technology.",
  "category": "general",
  "tags": ["gdg", "community", "google", "developers"]
}
```

## Integration Options

### Option 1: Floating Widget (Recommended)
The chatbot appears as a floating button that expands into a chat interface.

### Option 2: Embedded Chat
Embed the chat directly into a page section.

### Option 3: Modal/Dialog
Open the chat in a modal or dialog overlay.

### Option 4: Sidebar Integration
Integrate the chat into your existing sidebar navigation.

## Customization

### Styling
The chatbot uses Tailwind CSS classes and can be customized by:
- Modifying the component classes
- Using CSS custom properties
- Extending the Tailwind configuration

### Behavior
- Modify the `ChatbotService` for different response logic
- Update the `SmallTalkService` for custom small talk patterns
- Enhance the `FAQService` for more sophisticated search

### UI Components
- Customize individual components in the `components/` folder
- Add new UI elements as needed
- Modify the layout and styling

## API Reference

### ChatbotService
- `getInstance()`: Get singleton instance
- `processMessage(message: string)`: Process user message
- `getSuggestedQuestions()`: Get random FAQ questions
- `updateConfig(config: Partial<ChatbotConfig>)`: Update settings

### useChatbot Hook
- `isOpen`: Chat visibility state
- `messages`: Array of chat messages
- `isLoading`: Loading state
- `sendMessage(message: string)`: Send a message
- `toggleChat()`: Toggle chat visibility
- `clearMessages()`: Clear chat history

## Troubleshooting

### Common Issues

1. **FAQ not loading**: Check Firestore permissions and collection name
2. **Gemini API errors**: Verify API key and quota limits
3. **Styling issues**: Ensure Tailwind CSS is properly configured
4. **Performance**: Consider implementing message pagination for long conversations

### Debug Mode

Enable debug logging:

```tsx
const chatbotService = ChatbotService.getInstance();
chatbotService.updateConfig({
  debug: true
});
```

## Contributing

1. Follow the existing code structure
2. Add TypeScript types for new features
3. Update documentation for changes
4. Test with different FAQ data structures
5. Ensure responsive design works on mobile

## License

This chatbot is part of the GDG Hive AI Hub project. 