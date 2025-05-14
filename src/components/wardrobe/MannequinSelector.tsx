
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, UserRound } from 'lucide-react';

interface MannequinSelectorProps {
  onSelect: (type: string, bodyType: string) => void;
  selected: { type: string; bodyType: string };
}

const MannequinSelector: React.FC<MannequinSelectorProps> = ({ onSelect, selected }) => {
  const [gender, setGender] = useState<string>(selected.type || 'female');
  
  const handleGenderChange = (value: string) => {
    setGender(value);
    onSelect(value, selected.bodyType);
  };
  
  const handleBodyTypeSelect = (bodyType: string) => {
    onSelect(gender, bodyType);
  };

  // Function to get mannequin placeholder URL if image fails to load
  const getPlaceholder = (type: string, size: string) => {
    const bgColor = type === 'female' ? 'f9e0e9' : 'e2e8f0';
    return `https://placehold.co/120x240/${bgColor}/1e293b?text=${type.charAt(0).toUpperCase() + type.slice(1)}+${size}`;
  };
  
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <Tabs value={gender} onValueChange={handleGenderChange} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="female">
              <User className="w-4 h-4 mr-2" />
              Women
            </TabsTrigger>
            <TabsTrigger value="male">
              <UserRound className="w-4 h-4 mr-2" />
              Men
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="female" className="space-y-4">
            <RadioGroup 
              defaultValue={selected.bodyType} 
              className="grid grid-cols-3 gap-4"
              onValueChange={handleBodyTypeSelect}
            >
              {['small', 'medium', 'large'].map((size) => (
                <div key={size} className="flex flex-col items-center">
                  <div className="flex items-end mb-2">
                    <RadioGroupItem value={size} id={`female-${size}`} className="sr-only" />
                    <Label 
                      htmlFor={`female-${size}`}
                      className={`cursor-pointer w-full ${selected.type === 'female' && selected.bodyType === size ? 'ring-2 ring-primary' : ''}`}
                    >
                      <div className="flex flex-col items-center">
                        <div className="relative mb-2">
                          <AspectRatio ratio={1/2} className="bg-muted rounded-md overflow-hidden w-full max-w-[120px]">
                            <img 
                              src={`/images/mannequin-female-${size}.png`} 
                              alt={`Female ${size} body type`}
                              className="object-cover w-full h-full"
                              onError={(e) => {
                                // Fallback to placeholder if image fails to load
                                (e.target as HTMLImageElement).src = getPlaceholder('female', size);
                              }}
                            />
                          </AspectRatio>
                        </div>
                        <span className="text-xs font-medium capitalize">{size}</span>
                      </div>
                    </Label>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </TabsContent>
          
          <TabsContent value="male" className="space-y-4">
            <RadioGroup 
              defaultValue={selected.bodyType}
              className="grid grid-cols-3 gap-4"
              onValueChange={handleBodyTypeSelect}
            >
              {['small', 'medium', 'large'].map((size) => (
                <div key={size} className="flex flex-col items-center">
                  <div className="flex items-end mb-2">
                    <RadioGroupItem value={size} id={`male-${size}`} className="sr-only" />
                    <Label 
                      htmlFor={`male-${size}`}
                      className={`cursor-pointer w-full ${selected.type === 'male' && selected.bodyType === size ? 'ring-2 ring-primary' : ''}`}
                    >
                      <div className="flex flex-col items-center">
                        <div className="relative mb-2">
                          <AspectRatio ratio={1/2} className="bg-muted rounded-md overflow-hidden w-full max-w-[120px]">
                            <img 
                              src={`/images/mannequin-male-${size}.png`} 
                              alt={`Male ${size} body type`}
                              className="object-cover w-full h-full"
                              onError={(e) => {
                                // Fallback to placeholder if image fails to load
                                (e.target as HTMLImageElement).src = getPlaceholder('male', size);
                              }}
                            />
                          </AspectRatio>
                        </div>
                        <span className="text-xs font-medium capitalize">{size}</span>
                      </div>
                    </Label>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MannequinSelector;
