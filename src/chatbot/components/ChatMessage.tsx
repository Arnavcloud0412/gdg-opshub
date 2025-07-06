import React from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, User, Loader2 } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
  source?: 'faq' | 'gemini' | 'small-talk' | 'tour';
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, source }) => {
  const isUser = message.role === 'user';
  const isLoading = message.type === 'loading';
  const isError = message.type === 'error';

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-blue-100 text-blue-600">
            <MessageCircle className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-[80%] ${isUser ? 'order-first' : ''}`}>
        <Card className={`${isUser ? 'bg-blue-600 text-white' : 'bg-gray-50'} ${isError ? 'border-red-200 bg-red-50' : ''}`}>
          <CardContent className="p-3">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            ) : (
              <div>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {source && !isUser && (
                  <div className="mt-2 flex gap-1">
                                         <Badge 
                       variant="outline" 
                       className={`text-xs ${
                         source === 'faq' ? 'bg-green-100 text-green-700' :
                         source === 'gemini' ? 'bg-purple-100 text-purple-700' :
                         source === 'tour' ? 'bg-orange-100 text-orange-700' :
                         'bg-blue-100 text-blue-700'
                       }`}
                     >
                       {source === 'faq' ? 'FAQ' : source === 'gemini' ? 'AI' : source === 'tour' ? 'Tour' : 'Chat'}
                     </Badge>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-gray-100 text-gray-600">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}; 