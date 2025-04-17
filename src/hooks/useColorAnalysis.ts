
import { useState, useEffect } from 'react';
import { ColorAnalysisResult } from '@/components/color-analysis/ResultsDisplay';

export const useColorAnalysis = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<ColorAnalysisResult | null>(null);
  
  // Clean up any resources when component unmounts
  useEffect(() => {
    return () => {
      // This is where any cleanup would go
    };
  }, []);

  const handleImageUpload = (imageDataUrl: string) => {
    setImage(imageDataUrl);
    simulateAnalysis();
  };

  const handleImageRemove = () => {
    setImage(null);
    setResults(null);
  };

  const simulateAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      
      setResults({
        skinTone: "Medium",
        undertone: "Warm",
        season: "Autumn",
        colorsToWear: ["Olive Green", "Terracotta", "Rust", "Gold", "Mustard"],
        colorsToAvoid: ["Bright Blue", "Fuchsia", "Neon Colors", "Pure White"]
      });
    }, 3000);
  };

  return {
    image,
    analyzing,
    results,
    handleImageUpload,
    handleImageRemove
  };
};
