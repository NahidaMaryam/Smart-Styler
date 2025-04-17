
import React from 'react';
import { useWeatherData } from '@/services/weatherService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, CloudDrizzle, CloudRain, CloudSnow, Sun, Wind, CloudLightning, Loader2 } from 'lucide-react';

interface WeatherStylingTip {
  tip: string;
  accessory?: string;
  colors?: string[];
  fabrics?: string[];
}

const WeatherStyleTips: React.FC = () => {
  const { weatherData, isLoading, error } = useWeatherData();
  
  if (isLoading) {
    return (
      <Card className="animate-pulse-soft">
        <CardHeader className="flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
          <CardTitle className="mt-2">Fetching weather data...</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="h-5 w-3/4 bg-muted rounded-md mb-3"></div>
          <div className="h-5 w-2/3 bg-muted rounded-md mb-3"></div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Alert>
        <AlertTitle>Could not fetch weather data</AlertTitle>
        <AlertDescription>
          We'll show you general styling tips instead. Try refreshing the page later.
        </AlertDescription>
      </Alert>
    );
  }
  
  if (!weatherData) {
    return null;
  }

  // Get styling tips based on weather condition
  const getStylingTips = (): WeatherStylingTip[] => {
    const { condition, temperature } = weatherData;
    const lowTemp = temperature < 10;
    const highTemp = temperature > 25;

    // Different styling tips based on weather conditions
    switch(condition.toLowerCase()) {
      case 'clear':
        return highTemp ? [
          { tip: "Opt for lightweight, breathable fabrics", fabrics: ["Cotton", "Linen", "Rayon"] },
          { tip: "Consider a wide-brimmed hat for sun protection", accessory: "Hat" },
          { tip: "Light colors reflect sunlight and keep you cooler", colors: ["White", "Pastels", "Light blue"] }
        ] : lowTemp ? [
          { tip: "Layer with light jackets for clear but cool days", fabrics: ["Cotton-blend", "Light wool"] },
          { tip: "Sunglasses are still essential on clear, cold days", accessory: "Sunglasses" }
        ] : [
          { tip: "Perfect weather for showcasing your favorite outfits without heavy layers" },
          { tip: "Consider wearing vibrant colors to match the bright day", colors: ["Yellow", "Blue", "Green"] }
        ];
        
      case 'clouds':
        return [
          { tip: "Add a light layer for potentially changing conditions", fabrics: ["Cotton blend", "Light knits"] },
          { tip: "Overcast days are perfect for bold colors that pop against gray skies", colors: ["Burgundy", "Mustard", "Emerald"] }
        ];
        
      case 'rain':
      case 'drizzle':
        return [
          { tip: "Choose water-resistant fabrics and shoes", fabrics: ["Treated cotton", "Nylon", "Polyester"] },
          { tip: "Style with a fashionable raincoat or trench", colors: ["Navy", "Olive", "Beige"] },
          { tip: "Consider ankle boots to keep feet dry", accessory: "Boots" }
        ];
        
      case 'thunderstorm':
        return [
          { tip: "Waterproof outerwear is essential", fabrics: ["Gore-Tex", "Treated fabrics"] },
          { tip: "Avoid metal accessories during lightning", accessory: "Avoid metallic jewelry" },
          { tip: "Choose shoes with good grip for wet conditions", accessory: "Non-slip shoes" }
        ];
        
      case 'snow':
        return [
          { tip: "Layer insulating fabrics to trap warmth", fabrics: ["Wool", "Fleece", "Down"] },
          { tip: "Waterproof boots are essential for snow days", accessory: "Waterproof boots" },
          { tip: "Add a bright scarf or hat for a pop of color in white surroundings", colors: ["Red", "Cobalt blue", "Emerald"] }
        ];
        
      case 'mist':
      case 'fog':
        return [
          { tip: "Wear bright or reflective elements for visibility", colors: ["Bright yellow", "Orange", "Red"] },
          { tip: "Layer with pieces that can be removed if the fog lifts", fabrics: ["Cotton", "Light wool"] }
        ];
        
      case 'wind':
        return [
          { tip: "Choose fitted silhouettes that won't catch the wind" },
          { tip: "Secure hairstyles and accessorize with a stylish hat", accessory: "Hair-securing accessories" },
          { tip: "Opt for heavier fabrics that won't billow", fabrics: ["Denim", "Twill", "Heavyweight cotton"] }
        ];
        
      default:
        // General styling tips
        return [
          { tip: "Dress in layers for adaptable comfort throughout the day" },
          { tip: "Choose versatile pieces that can transition between settings" },
          { tip: "Accessorize to elevate simple outfits", accessory: "Statement jewelry or scarf" }
        ];
    }
  };

  const getWeatherIcon = () => {
    const { condition } = weatherData;
    switch(condition.toLowerCase()) {
      case 'clear': return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'clouds': return <Cloud className="h-8 w-8 text-gray-400" />;
      case 'rain': return <CloudRain className="h-8 w-8 text-blue-400" />;
      case 'drizzle': return <CloudDrizzle className="h-8 w-8 text-blue-300" />;
      case 'snow': return <CloudSnow className="h-8 w-8 text-blue-100" />;
      case 'thunderstorm': return <CloudLightning className="h-8 w-8 text-purple-500" />;
      case 'wind': return <Wind className="h-8 w-8 text-gray-500" />;
      default: return <Cloud className="h-8 w-8 text-gray-400" />;
    }
  };

  const tips = getStylingTips();

  return (
    <Card className="animate-fade-in mt-6" style={{animationDelay: '0.3s'}}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Weather-Based Style Tips</CardTitle>
          <CardDescription>
            {weatherData.location} • {weatherData.temperature}°C • {weatherData.condition}
          </CardDescription>
        </div>
        <div>
          {getWeatherIcon()}
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-start">
              <span className="inline-block h-6 w-6 mr-2 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm">
                {index + 1}
              </span>
              <div>
                <span className="block">{tip.tip}</span>
                {tip.fabrics && (
                  <span className="text-sm text-muted-foreground mt-1 block">
                    Suggested fabrics: {tip.fabrics.join(", ")}
                  </span>
                )}
                {tip.colors && (
                  <span className="text-sm text-muted-foreground block">
                    Recommended colors: {tip.colors.join(", ")}
                  </span>
                )}
                {tip.accessory && (
                  <span className="text-sm text-muted-foreground block">
                    Accessory tip: {tip.accessory}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default WeatherStyleTips;
