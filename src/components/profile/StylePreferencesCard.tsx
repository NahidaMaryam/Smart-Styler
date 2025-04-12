
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Save, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { UserData } from '@/hooks/useUserData';

interface StylePreferences {
  favoriteColors: string[];
  preferredStyles: string[];
  favoriteItems: string[];
}

interface StylePreferencesCardProps {
  stylePreferences: StylePreferences;
  updateUserData?: (data: Partial<UserData>) => void;
}

const StylePreferencesCard: React.FC<StylePreferencesCardProps> = ({ stylePreferences, updateUserData }) => {
  const [newColor, setNewColor] = useState('');
  const [newStyle, setNewStyle] = useState('');
  const [newItem, setNewItem] = useState('');
  const { toast } = useToast();
  
  const [localPreferences, setLocalPreferences] = useState<StylePreferences>({
    favoriteColors: [...stylePreferences.favoriteColors],
    preferredStyles: [...stylePreferences.preferredStyles],
    favoriteItems: [...stylePreferences.favoriteItems]
  });
  
  const addItem = (category: keyof StylePreferences, value: string) => {
    if (!value.trim()) return;
    
    setLocalPreferences(prev => ({
      ...prev,
      [category]: [...prev[category], value.trim()]
    }));
    
    // Reset input field
    if (category === 'favoriteColors') setNewColor('');
    else if (category === 'preferredStyles') setNewStyle('');
    else setNewItem('');
  };
  
  const removeItem = (category: keyof StylePreferences, index: number) => {
    setLocalPreferences(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index)
    }));
  };
  
  const handleSave = () => {
    if (updateUserData) {
      updateUserData({ stylePreferences: localPreferences });
      
      toast({
        title: "Preferences Saved",
        description: "Your style preferences have been updated successfully."
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Style Preferences</CardTitle>
        <CardDescription>
          Customize your style preferences to get better recommendations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-4">Favorite Colors</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {localPreferences.favoriteColors.map((color, index) => (
              <div key={index} className="px-3 py-1 rounded-full bg-secondary flex items-center">
                {color}
                <button 
                  onClick={() => removeItem('favoriteColors', index)} 
                  className="ml-2 text-muted-foreground hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input 
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              placeholder="Add a color"
              className="max-w-[200px]"
            />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => addItem('favoriteColors', newColor)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Preferred Styles</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {localPreferences.preferredStyles.map((style, index) => (
              <div key={index} className="px-3 py-1 rounded-full bg-secondary flex items-center">
                {style}
                <button 
                  onClick={() => removeItem('preferredStyles', index)}
                  className="ml-2 text-muted-foreground hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input 
              value={newStyle}
              onChange={(e) => setNewStyle(e.target.value)}
              placeholder="Add a style"
              className="max-w-[200px]"
            />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => addItem('preferredStyles', newStyle)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Favorite Clothing Items</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {localPreferences.favoriteItems.map((item, index) => (
              <div key={index} className="px-3 py-1 rounded-full bg-secondary flex items-center">
                {item}
                <button 
                  onClick={() => removeItem('favoriteItems', index)}
                  className="ml-2 text-muted-foreground hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input 
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Add an item"
              className="max-w-[200px]"
            />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => addItem('favoriteItems', newItem)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Preferences
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StylePreferencesCard;
