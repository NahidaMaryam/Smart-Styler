
import React, { useRef, useEffect } from 'react';
import { Avatar } from "@/components/ui/avatar";
import { MessageCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import ChatMessage from './ChatMessage';
import { type Message } from '@/hooks/useAIStylistChat';

interface ChatContainerProps {
  messages: Message[];
  isTyping: boolean;
  apiError?: string | null;
  onViewGeneratedImage: (imageUrl: string) => void;
  onRetry?: (content: string) => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ 
  messages, 
  isTyping, 
  apiError,
  onViewGeneratedImage,
  onRetry
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="flex-grow overflow-y-auto p-4 pt-6">
      <div className="space-y-4">
        {apiError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Connection Issue</AlertTitle>
            <AlertDescription>
              The AI Stylist service is currently unavailable. Please try again later.
            </AlertDescription>
          </Alert>
        )}
        
        {messages.map((message) => (
          <ChatMessage 
            key={message.id} 
            message={message} 
            onViewGeneratedImage={onViewGeneratedImage}
            onRetry={onRetry}
          />
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex max-w-[80%] md:max-w-[70%] flex-row">
              <div className="flex-shrink-0 mr-3">
                <Avatar className="bg-accent text-white border-2 border-accent/20">
                  <MessageCircle className="h-5 w-5" />
                </Avatar>
              </div>
              <div className="rounded-xl px-4 py-3 text-sm bg-muted shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatContainer;
