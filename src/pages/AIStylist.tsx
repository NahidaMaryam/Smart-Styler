
import React, { useState, useRef, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import PageContainer from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { MessageCircle, Send, User, Upload, Image as ImageIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { toast } from "@/hooks/use-toast";

interface Message {
  id: number;
  content: string;
  isUser: boolean;
  timestamp: Date;
  image?: string;
  generatedImage?: string;
}

const AIStylist = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hello! I'm your AI Style Assistant. How can I help you with your outfit today? You can also upload an image of your outfit for me to rate it!",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showGeneratedImage, setShowGeneratedImage] = useState(false);
  const [currentGeneratedImage, setCurrentGeneratedImage] = useState<string | null>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
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
        simulateOutfitRating(imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
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
    setSelectedImage(null);
    simulateResponse(input);
  };

  // Simulate AI rating for outfit image
  const simulateOutfitRating = (imageUrl: string) => {
    setIsTyping(true);
    
    setTimeout(() => {
      // Generate a mock outfit rating response with real image assets
      const ratingResponses = [
        {
          text: "This outfit looks great! I love how you've paired these colors. The fit is excellent and the style suits you well. I'd rate it 9/10. Would you like to see a similar outfit recommendation?",
          generatedImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=720"
        },
        {
          text: "Nice outfit choice! The combination works well, though I might suggest adding an accessory to enhance it. Overall, it's a solid 7/10. Would you like to see a similar outfit with my suggested improvements?",
          generatedImage: "https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=720"
        },
        {
          text: "Interesting outfit! The color palette is cohesive, but the proportions could be improved. I'd rate it 6/10. I can suggest a similar style with better balance if you'd like?",
          generatedImage: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=720"
        },
        {
          text: "Excellent outfit composition! The textures and colors complement each other perfectly. This is definitely a 10/10. Would you like to see other outfit ideas in this style?",
          generatedImage: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=720"
        }
      ];
      
      const randomRating = ratingResponses[Math.floor(Math.random() * ratingResponses.length)];
      
      const aiMessage: Message = {
        id: messages.length + 2,
        content: randomRating.text,
        isUser: false,
        timestamp: new Date(),
        generatedImage: randomRating.generatedImage
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, Math.random() * 1000 + 2000);
  };

  // Advanced response generation with more variety
  const simulateResponse = (userInput: string) => {
    setIsTyping(true);
    
    const normalizedInput = userInput.toLowerCase();
    setTimeout(() => {
      let response = '';
      let generatedImage = null;
      
      // Create an object mapping keywords to arrays of possible responses
      const responseOptions = {
        party: [
          {
            text: "For a party, I'd recommend a statement piece that shows your personality! A deep burgundy dress or jumpsuit would look amazing, paired with minimal gold accessories to let your outfit shine.",
            image: "/placeholder.svg"
          },
          {
            text: "Party outfits should be fun! Try an emerald green top with dark jeans and heels. Add some sparkle with metallic accessories, but remember - one statement piece is enough.",
            image: "/placeholder.svg"
          },
          {
            text: "For your next party, consider a black midi dress with an interesting neckline or back detail. It's versatile enough to work with bold jewelry or a colorful clutch depending on the venue.",
            image: "/placeholder.svg"
          }
        ],
        work: [
          {
            text: "For professional settings, create a capsule wardrobe with navy, charcoal, and cream as your base. Add interest with texture and subtle patterns rather than bright colors.",
            image: "/placeholder.svg"
          },
          {
            text: "Work outfits should balance comfort and style. Try tailored pants in a neutral tone with structured tops in your seasonal color palette. Navy, olive, or burgundy blazers are timeless investments.",
            image: "/placeholder.svg"
          },
          {
            text: "For the office, consider high-quality basics that mix and match - like tailored trousers with silk blouses. Add personality with interesting but subtle accessories like a unique watch or elegant scarf.",
            image: "/placeholder.svg"
          }
        ],
        casual: [
          {
            text: "For casual weekends, elevated basics are key. Try straight-leg jeans with a well-fitted tee and an overshirt or cardigan. Finish with white sneakers or ankle boots depending on the season.",
            image: "/placeholder.svg"
          },
          {
            text: "Casual doesn't mean sloppy! Try olive chinos with a heathered henley and a quality leather belt. The right fit transforms simple pieces into a put-together look.",
            image: "/placeholder.svg"
          },
          {
            text: "For weekend outfits, consider layering different textures - like a soft cotton tee under a textured cardigan with well-fitted jeans. Thoughtful layers add interest to casual looks.",
            image: "/placeholder.svg"
          }
        ],
        date: [
          {
            text: "For date night, wear something that makes you feel confident! A well-fitted top in your most flattering color with your best jeans creates a timeless look. Add a special accessory that might become a conversation starter.",
            image: "/placeholder.svg"
          },
          {
            text: "Date outfits should balance elegance and comfort. Consider dark jeans with a silky top and a structured jacket you can remove if the venue is warm. Comfortable but stylish shoes ensure you can focus on the conversation!",
            image: "/placeholder.svg"
          },
          {
            text: "For a romantic evening, try monochromatic dressing with different textures - like a cashmere sweater with wool trousers in similar tones. This creates a sophisticated look without seeming like you're trying too hard.",
            image: "/placeholder.svg"
          }
        ],
        spring: [
          {
            text: "For spring, incorporate lighter fabrics and colors like sage green, lavender, or butter yellow. Layer with lightweight cardigans or denim jackets for changing temperatures.",
            image: "/placeholder.svg"
          },
          {
            text: "Spring is perfect for introducing florals and pastels. Try a floral blouse with neutral bottoms, or keep the outfit simple and add color with accessories.",
            image: "/placeholder.svg"
          },
          {
            text: "For spring transitions, focus on adaptable layers - like a trench coat over a light sweater with straight-leg jeans. Ankle boots work until it's warm enough for loafers or sandals.",
            image: "/placeholder.svg"
          }
        ],
        summer: [
          {
            text: "Summer style should prioritize breathable fabrics like linen, cotton, and lightweight denim. Stick to a cohesive color palette so pieces mix easily for vacations.",
            image: "/placeholder.svg"
          },
          {
            text: "For hot weather, loose-fitting linen pants or a midi skirt paired with a crisp cotton top creates an elegant silhouette while keeping you cool.",
            image: "/placeholder.svg"
          },
          {
            text: "Summer outfits benefit from natural materials - try a linen shirt dress with leather sandals, or cotton shorts with a structured top to balance the casual bottom.",
            image: "/placeholder.svg"
          }
        ],
        autumn: [
          {
            text: "Autumn calls for rich, warm tones like rust, olive, and burgundy. Try combining different textures like a silk blouse under a chunky cardigan with corduroy pants.",
            image: "/placeholder.svg"
          },
          {
            text: "Fall fashion thrives on layering - start with a fitted base layer, add a button-up or lightweight sweater, and top with a jacket or coat. This creates visual interest and practical warmth.",
            image: "/placeholder.svg"
          },
          {
            text: "For autumn, incorporate earth tones with textured fabrics. A camel sweater with dark jeans and ankle boots creates a classic fall silhouette that never goes out of style.",
            image: "/placeholder.svg"
          }
        ],
        winter: [
          {
            text: "Winter style can still be interesting with thoughtful layering! Start with thermal basics, add sweaters and cardigans, then finish with a statement coat in a color that brightens gray days.",
            image: "/placeholder.svg"
          },
          {
            text: "In cold weather, invest in quality knitwear in your best colors. A collection of well-made sweaters can be paired with jeans or wool trousers for months of stylish outfits.",
            image: "/placeholder.svg"
          },
          {
            text: "For winter, focus on interesting outerwear since that's what people see most. A colorful wool coat or a textured jacket can elevate simple outfits underneath.",
            image: "/placeholder.svg"
          }
        ],
        interview: [
          {
            text: "For interviews, it's best to appear polished but not distracting. A well-tailored blazer in navy or charcoal with matching trousers or a skirt projects competence and attention to detail.",
            image: "/placeholder.svg"
          },
          {
            text: "Interview outfits should be slightly more formal than the company's everyday dress code. Research their culture, then elevate it a notch with quality fabrics and impeccable fit.",
            image: "/placeholder.svg"
          },
          {
            text: "For professional interviews, stick to a limited color palette of navy, gray, white, and black with perhaps one accent color. This creates a cohesive look that keeps the focus on your qualifications.",
            image: "/placeholder.svg"
          }
        ],
        wedding: [
          {
            text: "For weddings, consider the venue and time of day. A garden afternoon wedding calls for lighter colors and fabrics, while evening formal events warrant darker tones and more structured garments.",
            image: "/placeholder.svg"
          },
          {
            text: "Wedding guest attire should be festive without upstaging the couple. A midi dress in a jewel tone or a well-tailored suit with an interesting tie or pocket square works for most ceremonies.",
            image: "/placeholder.svg"
          },
          {
            text: "For wedding celebrations, pay attention to the dress code. When in doubt, a knee-length dress in a non-white color or dark suit with appropriate accessories will work for most semi-formal occasions.",
            image: "/placeholder.svg"
          }
        ]
      };
      
      // Check for specific scenario keywords first
      let foundKeyword = false;
      for (const [keyword, responses] of Object.entries(responseOptions)) {
        if (normalizedInput.includes(keyword)) {
          // Pick a random response from the options
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];
          response = randomResponse.text;
          // Replace placeholder with actual images
          generatedImage = getOutfitImageForCategory(keyword);
          foundKeyword = true;
          break;
        }
      }
      
      // If no keyword was matched, give a general response
      if (!foundKeyword) {
        const generalResponses = [
          {
            text: "Based on color analysis, I'd recommend focusing on warm earth tones like olive green, rust, and gold for your wardrobe. These complement most skin tones beautifully. Could you tell me about a specific occasion you're shopping for?",
          },
          {
            text: "Your style profile suggests you prefer timeless pieces over trends. I'd recommend investing in quality basics in neutral colors, then adding personality with accessories. What type of outfit are you planning?",
          },
          {
            text: "Looking at your preferences, I think you'd benefit from a capsule wardrobe approach - focusing on versatile pieces that mix and match easily. Would you like suggestions for specific items that would work well together?",
          },
          {
            text: "I notice you haven't specified an occasion. For everyday style, I recommend the 'rule of three' - combining at least three pieces (like top, bottom, and layer or accessory) to create a complete look. What kind of outfits do you typically wear?",
          }
        ];
        const randomResponse = generalResponses[Math.floor(Math.random() * generalResponses.length)];
        response = randomResponse.text;
        generatedImage = getOutfitImageForCategory('casual');
      }
      
      const aiMessage: Message = {
        id: messages.length + 2,
        content: response,
        isUser: false,
        timestamp: new Date(),
        generatedImage: generatedImage
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, Math.random() * 1000 + 1500);
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

  const handleViewGeneratedImage = (imageUrl: string) => {
    setCurrentGeneratedImage(imageUrl);
    setShowGeneratedImage(true);
  };
  
  return (
    <Layout>
      <PageContainer>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 gradient-text">AI Stylist Assistant</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get personalized outfit suggestions for any occasion, season, or style preference. Just ask or upload an image of your outfit!
            </p>
          </div>
          
          <Card className="border-2 h-[70vh] flex flex-col shadow-lg">
            <CardContent className="flex-grow overflow-y-auto p-4 pt-6">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
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
                          <Avatar className="bg-accent text-white border-2 border-accent/20">
                            <MessageCircle className="h-5 w-5" />
                          </Avatar>
                        )}
                      </div>
                      <div
                        className={`rounded-xl px-4 py-3 text-sm ${
                          message.isUser
                            ? 'bg-primary text-primary-foreground'
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
                              onClick={() => handleViewGeneratedImage(message.generatedImage!)}
                            >
                              <ImageIcon className="h-4 w-4" />
                              View suggested outfit
                            </Button>
                          </div>
                        )}
                        
                        <div className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                    </div>
                  </div>
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
            </CardContent>
            <div className="border-t p-4 bg-background/80 backdrop-blur-sm">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleUploadClick}
                  className="shrink-0 shadow-sm"
                >
                  <Upload className="w-4 h-4" />
                </Button>
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask about outfit suggestions..."
                  className="flex-grow shadow-sm"
                />
                <Button type="submit" className="shrink-0 shadow-sm">
                  <Send className="w-4 h-4" />
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
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
                        setInput(suggestion);
                      }}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
          
          <Dialog open={showGeneratedImage} onOpenChange={setShowGeneratedImage}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Suggested Outfit</DialogTitle>
                <DialogDescription>
                  Here's an outfit suggestion based on our conversation.
                </DialogDescription>
              </DialogHeader>
              {currentGeneratedImage && (
                <div className="flex justify-center p-4">
                  <img 
                    src={currentGeneratedImage} 
                    alt="Generated outfit suggestion" 
                    className="rounded-lg max-h-[60vh] w-auto object-contain"
                  />
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </PageContainer>
    </Layout>
  );
};

export default AIStylist;
