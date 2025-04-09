
import React, { useState, useRef, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import PageContainer from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { MessageCircle, Send, User } from 'lucide-react';

interface Message {
  id: number;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const AIStylist = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hello! I'm your AI Style Assistant. How can I help you with your outfit today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      content: input.trim(),
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setInput('');
    simulateResponse(input);
  };
  
  const simulateResponse = (userInput: string) => {
    setIsTyping(true);
    
    // Mock responses based on input keywords
    let response = '';
    const normalizedInput = userInput.toLowerCase();
    
    setTimeout(() => {
      if (normalizedInput.includes('party') || normalizedInput.includes('event')) {
        response = "For a party, I'd recommend something that makes you feel confident! Based on your color analysis, a deep burgundy dress or a navy blazer with gold accents would look stunning on you. Complement with minimal accessories to let your outfit shine.";
      } else if (normalizedInput.includes('work') || normalizedInput.includes('office')) {
        response = "For professional settings, try a tailored blazer in navy or charcoal with a white or cream shirt. Add a touch of color with accessories that match your seasonal palette - perhaps a scarf or tie in forest green or deep burgundy.";
      } else if (normalizedInput.includes('casual') || normalizedInput.includes('weekend')) {
        response = "For casual outings, I recommend pairing dark wash jeans with a soft sweater in one of your complementary colors like olive green or terracotta. Layer with a neutral jacket and add white sneakers for a comfortable yet polished look.";
      } else if (normalizedInput.includes('date') || normalizedInput.includes('dinner')) {
        response = "For a date night, consider a combination of elegance and comfort. A well-fitted black top paired with your best jeans and boots creates a timeless look. Add a statement accessory in a color from your palette, like a gold necklace or rust-colored scarf.";
      } else {
        response = "Based on your color analysis and style preferences, I'd recommend outfits featuring warm earth tones like olive green, rust, and gold. These colors complement your skin tone beautifully. Would you like more specific suggestions for a particular occasion?";
      }
      
      const aiMessage: Message = {
        id: messages.length + 2,
        content: response,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };
  
  return (
    <Layout>
      <PageContainer>
        <h1 className="text-3xl font-bold mb-2">AI Stylist Assistant</h1>
        <p className="text-muted-foreground mb-8">
          Get personalized outfit suggestions for any occasion. Just ask!
        </p>
        
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 h-[70vh] flex flex-col">
            <CardContent className="flex-grow overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex max-w-[80%] md:max-w-[70%] ${
                        message.isUser ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      <div className={`flex-shrink-0 ${message.isUser ? 'ml-3' : 'mr-3'}`}>
                        {message.isUser ? (
                          <Avatar>
                            <User className="h-5 w-5" />
                          </Avatar>
                        ) : (
                          <Avatar className="bg-accent text-white">
                            <MessageCircle className="h-5 w-5" />
                          </Avatar>
                        )}
                      </div>
                      <div
                        className={`rounded-xl px-4 py-3 text-sm ${
                          message.isUser
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex max-w-[80%] md:max-w-[70%] flex-row">
                      <div className="flex-shrink-0 mr-3">
                        <Avatar className="bg-accent text-white">
                          <MessageCircle className="h-5 w-5" />
                        </Avatar>
                      </div>
                      <div className="rounded-xl px-4 py-3 text-sm bg-muted">
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
            </CardContent>
            <div className="border-t p-4">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask about outfit suggestions..."
                  className="flex-grow"
                />
                <Button type="submit" className="shrink-0">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
              <div className="mt-2 text-xs text-muted-foreground">
                Try asking: "What should I wear to a party?" or "Help me with a casual weekend outfit"
              </div>
            </div>
          </Card>
        </div>
      </PageContainer>
    </Layout>
  );
};

export default AIStylist;
