
import React, { useRef, useEffect } from 'react';
import { Avatar } from "@/components/ui/avatar";
import { MessageCircle } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { type Message } from '@/hooks/useAIStylistChat';

interface ChatContainerProps {
  messages: Message[];
  isTyping: boolean;
  onViewGeneratedImage: (imageUrl: string) => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ 
  messages, 
  isTyping, 
  onViewGeneratedImage 
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
        {messages.map((message) => (
          <ChatMessage 
            key={message.id} 
            message={message} 
            onViewGeneratedImage={onViewGeneratedImage} 
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
