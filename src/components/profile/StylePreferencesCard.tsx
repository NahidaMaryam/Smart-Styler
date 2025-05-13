
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Save, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { UserData } from '@/hooks/useUserData';

interface StylePreference {
  id: string;
  name: string;
  enabled: boolean;
}

interface StylePreferencesCardProps {
  stylePreferences: StylePreference[];
  updateUserData?: (data: Partial<UserData>) => void;
}

const StylePreferencesCard: React.FC<StylePreferencesCardProps> = ({ stylePreferences, updateUserData }) => {
  const [newColor, setNewColor] = useState('');
  const [newStyle, setNewStyle] = useState('');
  const [newItem, setNewItem] = useState('');
  const { toast } = useToast();
  
  const [localPreferences, setLocalPreferences] = useState<StylePreference[]>([...stylePreferences]);
  
  const addPreference = (name: string) => {
    if (!name.trim()) return;
    
    const newPreference: StylePreference = {
      id: `new-${Date.now()}`,
      name: name.trim(),
      enabled: true
    };
    
    setLocalPreferences(prev => [...prev, newPreference]);
    
    // Reset input field
    if (name === newColor) setNewColor('');
    else if (name === newStyle) setNewStyle('');
    else setNewItem('');
  };
  
  const removePreference = (id: string) => {
    setLocalPreferences(prev => prev.filter(pref => pref.id !== id));
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
  
  // Filter preferences by category (based on id prefix we can assume)
  const colorPreferences = localPreferences.filter(p => p.id.startsWith('color-') || p.name.toLowerCase().includes('color'));
  const styleTypePreferences = localPreferences.filter(p => p.id.startsWith('style-') || (!p.id.startsWith('color-') && !p.id.startsWith('item-')));
  const itemPreferences = localPreferences.filter(p => p.id.startsWith('item-') || p.name.toLowerCase().includes('shirt') || p.name.toLowerCase().includes('pant') || p.name.toLowerCase().includes('dress'));
  
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
            {colorPreferences.map((color) => (
              <div key={color.id} className="px-3 py-1 rounded-full bg-secondary flex items-center">
                {color.name}
                <button 
                  onClick={() => removePreference(color.id)} 
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
              onClick={() => addPreference(newColor)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Preferred Styles</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {styleTypePreferences.map((style) => (
              <div key={style.id} className="px-3 py-1 rounded-full bg-secondary flex items-center">
                {style.name}
                <button 
                  onClick={() => removePreference(style.id)}
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
              onClick={() => addPreference(newStyle)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Favorite Clothing Items</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {itemPreferences.map((item) => (
              <div key={item.id} className="px-3 py-1 rounded-full bg-secondary flex items-center">
                {item.name}
                <button 
                  onClick={() => removePreference(item.id)}
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
              onClick={() => addPreference(newItem)}
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
