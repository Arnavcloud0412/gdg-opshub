# Chatbot Integration Guide

This guide provides multiple ways to integrate the GDG chatbot into your website.

## Prerequisites

1. **Environment Variables**: Ensure you have the required environment variables set up
2. **Firestore Setup**: Your `faq_data` collection should be properly configured
3. **Gemini API Key**: Get your API key from Google AI Studio

## Integration Options

### Option 1: Floating Widget (Recommended)

The easiest way to add the chatbot - it appears as a floating button that expands into a chat interface.

```tsx
// In your main App or any page component
import { ChatbotWidget } from '@/chatbot';
import { useState } from 'react';

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div>
      {/* Your existing app content */}
      
      {/* Add the chatbot widget */}
      <ChatbotWidget 
        isOpen={isChatOpen} 
        onToggle={() => setIsChatOpen(!isChatOpen)} 
      />
    </div>
  );
}
```

**Pros:**
- Easy to implement
- Doesn't interfere with existing layout
- Always accessible
- Mobile-friendly

**Cons:**
- Takes up screen space when open
- May overlap with content

### Option 2: Dedicated Chat Page

Create a full-page chat experience with sidebar and additional features.

```tsx
// Add to your routing
import { ChatbotPage } from '@/chatbot';

// In your router configuration
<Route path="/chat" element={<ChatbotPage />} />

// Or add to your navigation
<Navigation currentPage={currentPage} onPageChange={setCurrentPage} userData={userData} />
```

**Pros:**
- Full-screen experience
- More space for features
- Can include additional UI elements
- Better for complex conversations

**Cons:**
- Requires navigation
- Takes users away from main content

### Option 3: Embedded in Sidebar

Integrate the chat into your existing sidebar navigation.

```tsx
// In your Navigation component
import { useChatbot } from '@/chatbot';

function Navigation() {
  const { isOpen, messages, sendMessage, toggleChat } = useChatbot();

  return (
    <div className="sidebar">
      {/* Existing navigation items */}
      
      {/* Chat section */}
      <div className="chat-section">
        <button onClick={toggleChat}>
          {isOpen ? 'Close Chat' : 'Open Chat'}
        </button>
        
        {isOpen && (
          <div className="chat-container">
            {/* Custom chat UI using the hook */}
            <div className="messages">
              {messages.map(msg => (
                <div key={msg.id} className={`message ${msg.role}`}>
                  {msg.content}
                </div>
              ))}
            </div>
            
            <input 
              placeholder="Type a message..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  sendMessage(e.target.value);
                  e.target.value = '';
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
```

### Option 4: Modal/Dialog Integration

Open the chat in a modal overlay.

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChatbotPage } from '@/chatbot';
import { useState } from 'react';

function ChatModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Chat with GDG Assistant
      </button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>GDG Assistant</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <ChatbotPage />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

### Option 5: Inline Chat Component

Embed a compact chat directly into a page section.

```tsx
import { useChatbot } from '@/chatbot';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function InlineChat() {
  const { messages, sendMessage, isLoading } = useChatbot();
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Quick Chat</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-64 overflow-y-auto space-y-2">
            {messages.map(msg => (
              <div key={msg.id} className={`p-2 rounded ${
                msg.role === 'user' ? 'bg-blue-100 ml-8' : 'bg-gray-100 mr-8'
              }`}>
                {msg.content}
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question..."
              disabled={isLoading}
            />
            <Button onClick={handleSend} disabled={isLoading}>
              Send
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

## Advanced Customization

### Custom Styling

```tsx
// Custom CSS classes
<ChatbotWidget 
  isOpen={isChatOpen} 
  onToggle={() => setIsChatOpen(!isChatOpen)}
  className="custom-chatbot-styles"
/>

// Add to your CSS
.custom-chatbot-styles {
  --chat-primary-color: #your-color;
  --chat-secondary-color: #your-color;
  --chat-background: #your-color;
}
```

### Custom Configuration

```tsx
import { ChatbotService } from '@/chatbot';

// Configure the chatbot behavior
const chatbotService = ChatbotService.getInstance();

chatbotService.updateConfig({
  name: 'Your Custom Assistant',
  welcomeMessage: 'Welcome to our community! How can I help?',
  useFAQ: true,
  useGemini: true,
  smallTalkEnabled: true,
  maxHistoryLength: 15
});
```

### Conditional Rendering

```tsx
// Only show for authenticated users
{user && <ChatbotWidget isOpen={isChatOpen} onToggle={toggleChat} />}

// Only show on specific pages
{currentPage === 'dashboard' && <ChatbotWidget isOpen={isChatOpen} onToggle={toggleChat} />}

// Show different versions based on user role
{userData?.role === 'admin' ? (
  <AdminChatbotWidget />
) : (
  <ChatbotWidget isOpen={isChatOpen} onToggle={toggleChat} />
)}
```

## Performance Considerations

### Lazy Loading

```tsx
import { lazy, Suspense } from 'react';

const ChatbotWidget = lazy(() => import('@/chatbot').then(module => ({ 
  default: module.ChatbotWidget 
})));

function App() {
  return (
    <Suspense fallback={<div>Loading chatbot...</div>}>
      <ChatbotWidget isOpen={isChatOpen} onToggle={toggleChat} />
    </Suspense>
  );
}
```

### Message History Management

```tsx
// Limit message history to prevent memory issues
const { messages, sendMessage } = useChatbot();

// Clear old messages periodically
useEffect(() => {
  if (messages.length > 50) {
    // Keep only last 20 messages
    setMessages(messages.slice(-20));
  }
}, [messages]);
```

## Mobile Optimization

### Responsive Design

```tsx
// Adjust widget size on mobile
<ChatbotWidget 
  isOpen={isChatOpen} 
  onToggle={toggleChat}
  className="md:w-96 w-full md:h-[500px] h-[400px]"
/>
```

### Touch-Friendly Interface

The chatbot components are already optimized for touch devices, but you can add additional mobile-specific features:

```tsx
// Add swipe gestures for mobile
import { useSwipeable } from 'react-swipeable';

const handlers = useSwipeable({
  onSwipedLeft: () => setIsChatOpen(false),
  onSwipedRight: () => setIsChatOpen(true),
});

<div {...handlers}>
  <ChatbotWidget isOpen={isChatOpen} onToggle={toggleChat} />
</div>
```

## Testing Your Integration

### 1. Test FAQ Responses
- Add test data to your Firestore `faq_data` collection
- Try asking questions that should match your FAQ data
- Verify responses are coming from FAQ vs Gemini

### 2. Test Small Talk
- Try greetings: "Hello", "Hi", "Good morning"
- Try farewells: "Goodbye", "See you", "Bye"
- Try thanks: "Thank you", "Thanks"

### 3. Test Error Handling
- Disconnect internet to test offline behavior
- Use invalid Gemini API key to test fallback
- Test with empty FAQ collection

### 4. Test UI Responsiveness
- Test on different screen sizes
- Test on mobile devices
- Test with different browsers

## Troubleshooting

### Common Issues

1. **Chatbot not appearing**: Check if components are properly imported
2. **FAQ not loading**: Verify Firestore permissions and collection name
3. **Gemini API errors**: Check API key and quota limits
4. **Styling issues**: Ensure Tailwind CSS is properly configured

### Debug Mode

```tsx
// Enable debug logging
const chatbotService = ChatbotService.getInstance();
chatbotService.updateConfig({ debug: true });

// Check browser console for detailed logs
```

## Best Practices

1. **Start Simple**: Begin with the floating widget, then customize as needed
2. **Test Thoroughly**: Test all integration points and user flows
3. **Monitor Performance**: Watch for memory leaks with long conversations
4. **User Feedback**: Collect feedback and iterate on the experience
5. **Accessibility**: Ensure the chatbot is accessible to all users
6. **Privacy**: Be transparent about data collection and usage

## Next Steps

1. Choose your preferred integration method
2. Set up environment variables
3. Test with sample FAQ data
4. Customize styling and behavior
5. Deploy and monitor usage
6. Iterate based on user feedback 