
import { useState, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Message {
  id: number;
  content: string;
  isUser: boolean;
  timestamp: Date;
  image?: string;
  generatedImage?: string;
}

interface UseAIStylistChatProps {
  initialMessages?: Message[];
}

export const useAIStylistChat = ({ initialMessages = [] }: UseAIStylistChatProps = {}) => {
  const [messages, setMessages] = useState<Message[]>(
    initialMessages.length > 0 ? initialMessages : [
      {
        id: 1,
        content: "Hello! I'm your AI Style Assistant. How can I help you with your outfit today? You can also upload an image of your outfit for me to rate it!",
        isUser: false,
        timestamp: new Date()
      }
    ]
  );
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Image too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive"
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageDataUrl = event.target?.result as string;
        setSelectedImage(imageDataUrl);
        
        // Add user message with image
        const userMessage: Message = {
          id: messages.length + 1,
          content: "How's this outfit?",
          isUser: true,
          timestamp: new Date(),
          image: imageDataUrl
        };
        
        setMessages([...messages, userMessage]);
        processImageWithGemini(imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      content: input.trim(),
      isUser: true,
      timestamp: new Date()
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setSelectedImage(null);
    
    await sendToGemini(input.trim(), updatedMessages);
  };

  // Process image with Gemini
  const processImageWithGemini = async (imageUrl: string) => {
    setIsTyping(true);
    
    try {
      // Create a message specifically for image analysis
      const imagePrompt = "Please analyze this outfit and provide feedback. Consider style, color coordination, fit, and occasion appropriateness. Also suggest how it could be improved or accessorized.";
      
      // Only send recent context to avoid token limits
      const recentMessages = messages.slice(-5);
      
      const result = await sendToGemini(imagePrompt, [
        ...recentMessages,
        {
          id: messages.length + 1,
          content: `[Image uploaded] ${imagePrompt}`,
          isUser: true,
          timestamp: new Date()
        }
      ]);
      
      // Find a suitable outfit image from our collection to recommend
      if (result) {
        const categories = ["party", "work", "casual", "date", "spring", "summer", "autumn", "winter"];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const generatedImage = getOutfitImageForCategory(randomCategory);
        
        // Update the AI response to include an image suggestion
        const aiMessage = messages[messages.length - 1];
        aiMessage.generatedImage = generatedImage;
        setMessages([...messages]);
      }
      
    } catch (error) {
      console.error("Error processing image:", error);
      const errorMessage: Message = {
        id: messages.length + 1,
        content: "Sorry, I had trouble analyzing that image. Could you try uploading it again or describe your outfit in text?",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Send message to Gemini
  const sendToGemini = async (userInput: string, messageHistory: Message[]) => {
    setIsTyping(true);
    
    try {
      // Call our Supabase Edge Function that uses Gemini
      const { data, error } = await supabase.functions.invoke('gemini-stylist', {
        body: {
          message: userInput,
          messageHistory: messageHistory.slice(-10) // Limit context to avoid token limits
        }
      });
      
      if (error) {
        throw new Error(`Error calling Gemini: ${error.message}`);
      }
      
      // Process the response
      const aiResponse = data?.response || "I'm having trouble connecting right now. Please try again.";
      
      // Check if we should suggest an outfit image
      const shouldSuggestOutfit = checkForOutfitSuggestion(userInput);
      
      // Determine if we should include a generated image
      let generatedImage = null;
      if (shouldSuggestOutfit) {
        // Use keywords in the user's message to find a relevant outfit image
        const outfitTypes = ["party", "work", "casual", "date", "spring", "summer", "autumn", "winter"];
        const matchedType = outfitTypes.find(type => userInput.toLowerCase().includes(type));
        generatedImage = getOutfitImageForCategory(matchedType || "casual");
      }
      
      // Add AI message with response
      const aiMessage: Message = {
        id: messageHistory.length + 1,
        content: aiResponse,
        isUser: false,
        timestamp: new Date(),
        generatedImage: generatedImage
      };
      
      setMessages(prev => [...prev, aiMessage]);
      return true;
      
    } catch (error) {
      console.error("Error with Gemini:", error);
      const errorMessage: Message = {
        id: messageHistory.length + 1,
        content: "I'm having trouble connecting to my styling database right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      return false;
      
    } finally {
      setIsTyping(false);
    }
  };

  // Check if we should suggest an outfit based on user message
  const checkForOutfitSuggestion = (userInput: string) => {
    const suggestionKeywords = [
      "outfit", "wear", "dress", "clothes", "fashion", 
      "party", "work", "date", "casual", "formal",
      "recommend", "suggestion", "recommend", "advice"
    ];
    
    return suggestionKeywords.some(keyword => 
      userInput.toLowerCase().includes(keyword)
    );
  };

  // Helper function to get real image URLs for outfit categories
  const getOutfitImageForCategory = (category: string) => {
    const imageMap: Record<string, string[]> = {
      party: [
        "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=720",
        "https://images.unsplash.com/photo-1623880840102-7df0a9f3545b?q=80&w=720"
      ],
      work: [
        "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=720",
        "https://images.unsplash.com/photo-1603205319065-6ffcd6c454cc?q=80&w=720"
      ],
      casual: [
        "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?q=80&w=720",
        "https://images.unsplash.com/photo-1551489186-cf8726f514f5?q=80&w=720"
      ],
      date: [
        "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=720",
        "https://images.unsplash.com/photo-1618721405821-80ebc4b63d26?q=80&w=720"
      ],
      spring: [
        "https://images.unsplash.com/photo-1618554754947-e01d5ce3c549?q=80&w=720",
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=720"
      ],
      summer: [
        "https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?q=80&w=720",
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=720"
      ],
      autumn: [
        "https://images.unsplash.com/photo-1525450824786-227cbef70703?q=80&w=720",
        "https://images.unsplash.com/photo-1513373319125-8da287b204a4?q=80&w=720"
      ],
      winter: [
        "https://images.unsplash.com/photo-1580651315530-69c8e0026377?q=80&w=720",
        "https://images.unsplash.com/photo-1610970881699-44a5587cabec?q=80&w=720"
      ],
      interview: [
        "https://images.unsplash.com/photo-1603205319065-6ffcd6c454cc?q=80&w=720",
        "https://images.unsplash.com/photo-1536766820879-059fec98ec0a?q=80&w=720"
      ],
      wedding: [
        "https://images.unsplash.com/photo-1494578379344-d6c710782a3d?q=80&w=720",
        "https://images.unsplash.com/photo-1579453437873-b765a26aba9a?q=80&w=720"
      ]
    };
    
    const defaultImages = [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=720",
      "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=720"
    ];
    
    const categoryImages = imageMap[category.toLowerCase()] || defaultImages;
    return categoryImages[Math.floor(Math.random() * categoryImages.length)];
  };

  return {
    messages,
    input,
    isTyping,
    fileInputRef,
    selectedImage,
    handleInputChange,
    handleImageUpload,
    handleUploadClick,
    handleSubmit,
    getOutfitImageForCategory
  };
};
