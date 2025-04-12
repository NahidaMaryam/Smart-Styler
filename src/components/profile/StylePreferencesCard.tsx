
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Save } from 'lucide-react';

interface StylePreferences {
  favoriteColors: string[];
  preferredStyles: string[];
  favoriteItems: string[];
}

interface StylePreferencesCardProps {
  stylePreferences: StylePreferences;
}

const StylePreferencesCard: React.FC<StylePreferencesCardProps> = ({ stylePreferences }) => {
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
          <div className="flex flex-wrap gap-2">
            {stylePreferences.favoriteColors.map((color, index) => (
              <div key={index} className="px-3 py-1 rounded-full bg-secondary">
                {color}
              </div>
            ))}
            <Button variant="outline" size="sm" className="rounded-full">
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Preferred Styles</h3>
          <div className="flex flex-wrap gap-2">
            {stylePreferences.preferredStyles.map((style, index) => (
              <div key={index} className="px-3 py-1 rounded-full bg-secondary">
                {style}
              </div>
            ))}
            <Button variant="outline" size="sm" className="rounded-full">
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Favorite Clothing Items</h3>
          <div className="flex flex-wrap gap-2">
            {stylePreferences.favoriteItems.map((item, index) => (
              <div key={index} className="px-3 py-1 rounded-full bg-secondary">
                {item}
              </div>
            ))}
            <Button variant="outline" size="sm" className="rounded-full">
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Save Preferences
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StylePreferencesCard;
