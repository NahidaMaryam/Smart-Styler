
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export interface ColorAnalysisResult {
  skinTone: string;
  undertone: string;
  season: string;
  colorsToWear: string[];
  colorsToAvoid: string[];
}

interface ResultsDisplayProps {
  results: ColorAnalysisResult;
}

const ResultsDisplay = ({ results }: ResultsDisplayProps) => {
  const { toast } = useToast();

  const handleSaveResults = () => {
    toast({
      title: "Results Saved",
      description: "Your color analysis results have been saved to your profile.",
    });
  };

  const renderColorBox = (color: string) => {
    const colorMap: Record<string, string> = {
      "Olive Green": "#556B2F",
      "Terracotta": "#E2725B",
      "Rust": "#B7410E",
      "Gold": "#D4AF37",
      "Mustard": "#E1AD01",
      "Bright Blue": "#0096FF",
      "Fuchsia": "#FF00FF",
      "Neon Colors": "#39FF14",
      "Pure White": "#FFFFFF"
    };
    
    return (
      <div className="flex flex-col items-center">
        <div 
          className="w-12 h-12 rounded-md border"
          style={{ backgroundColor: colorMap[color] || color }}
        ></div>
        <span className="text-xs mt-1">{color}</span>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Your Color Analysis Results</CardTitle>
          <CardDescription>
            Based on your photo, we've analyzed your skin tone and determined your seasonal color palette.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-secondary rounded-lg p-4 text-center">
              <h3 className="font-medium text-sm mb-2">Skin Tone</h3>
              <p className="text-xl font-semibold">{results.skinTone}</p>
            </div>
            <div className="bg-secondary rounded-lg p-4 text-center">
              <h3 className="font-medium text-sm mb-2">Undertone</h3>
              <p className="text-xl font-semibold">{results.undertone}</p>
            </div>
            <div className="bg-secondary rounded-lg p-4 text-center">
              <h3 className="font-medium text-sm mb-2">Season</h3>
              <p className="text-xl font-semibold">{results.season}</p>
            </div>
          </div>
          
          <div className="mt-8 space-y-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">Colors That Complement You</h3>
              <div className="flex flex-wrap gap-4">
                {results.colorsToWear.map((color, index) => (
                  <div key={`wear-${index}`}>
                    {renderColorBox(color)}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Colors To Avoid</h3>
              <div className="flex flex-wrap gap-4">
                {results.colorsToAvoid.map((color, index) => (
                  <div key={`avoid-${index}`}>
                    {renderColorBox(color)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="gap-2" onClick={handleSaveResults}>
            <Save className="w-4 h-4" />
            Save Results
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResultsDisplay;
