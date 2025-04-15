
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Upload } from 'lucide-react';

interface ChatInputProps {
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onUploadClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  input, 
  onInputChange, 
  onSubmit, 
  onUploadClick, 
  fileInputRef, 
  onImageUpload 
}) => {
  return (
    <div className="border-t p-4 bg-background/80 backdrop-blur-sm">
      <form onSubmit={onSubmit} className="flex gap-2">
        <Button 
          type="button" 
          variant="outline"
          onClick={onUploadClick}
          className="shrink-0 shadow-sm"
        >
          <Upload className="w-4 h-4" />
        </Button>
        <Input
          value={input}
          onChange={onInputChange}
          placeholder="Ask about outfit suggestions..."
          className="flex-grow shadow-sm"
        />
        <Button type="submit" className="shrink-0 shadow-sm">
          <Send className="w-4 h-4" />
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={onImageUpload}
          accept="image/*"
          className="hidden"
        />
      </form>
      <div className="mt-3 text-xs text-muted-foreground px-1">
        <p>Try asking:</p>
        <div className="flex flex-wrap gap-2 mt-1">
          {["Party outfit", "Work attire", "Casual weekend", "Date night", "Winter style", "Summer look"].map((suggestion) => (
            <Button 
              key={suggestion} 
              variant="outline" 
              size="sm" 
              className="text-xs py-0 h-auto"
              onClick={() => {
                onInputChange({ target: { value: suggestion } } as React.ChangeEvent<HTMLInputElement>);
              }}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
