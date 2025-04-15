
import React from 'react';
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, User, Image as ImageIcon, AlertTriangle, RefreshCw } from 'lucide-react';
import { type Message } from '@/hooks/useAIStylistChat';

interface ChatMessageProps {
  message: Message;
  onViewGeneratedImage: (imageUrl: string) => void;
  onRetry?: (content: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onViewGeneratedImage, onRetry }) => {
  return (
    <div
      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
      style={{ animationDelay: `${message.id * 0.1}s` }}
    >
      <div
        className={`flex max-w-[80%] md:max-w-[70%] ${
          message.isUser ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        <div className={`flex-shrink-0 ${message.isUser ? 'ml-3' : 'mr-3'}`}>
          {message.isUser ? (
            <Avatar className="border-2 border-primary/20">
              <User className="h-5 w-5" />
            </Avatar>
          ) : (
            <Avatar className={`${message.error ? 'bg-destructive' : 'bg-accent'} text-white border-2 ${message.error ? 'border-destructive/20' : 'border-accent/20'}`}>
              {message.error ? <AlertTriangle className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
            </Avatar>
          )}
        </div>
        <div
          className={`rounded-xl px-4 py-3 text-sm ${
            message.isUser
              ? 'bg-primary text-primary-foreground'
              : message.error
                ? 'bg-destructive/10 border border-destructive/30'
                : 'bg-muted'
          } shadow-sm`}
        >
          {message.content}
          
          {message.image && (
            <div className="mt-3">
              <img 
                src={message.image} 
                alt="Uploaded outfit" 
                className="rounded-lg max-h-60 object-contain"
              />
            </div>
          )}
          
          {message.generatedImage && !message.isUser && (
            <div className="mt-3">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2 mt-2"
                onClick={() => onViewGeneratedImage(message.generatedImage!)}
              >
                <ImageIcon className="h-4 w-4" />
                View suggested outfit
              </Button>
            </div>
          )}
          
          {message.error && onRetry && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 mt-2 text-xs"
                onClick={() => onRetry(message.content)}
              >
                <RefreshCw className="h-3 w-3" />
                Try again
              </Button>
            </div>
          )}
          
          <div className="text-xs opacity-70 mt-1">
            {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
