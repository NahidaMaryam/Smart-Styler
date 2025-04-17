
import { useState, useEffect } from 'react';

// Weather data types
export interface WeatherData {
  condition: string; // e.g., 'Clear', 'Rain', 'Clouds', etc.
  temperature: number; // in Celsius
  humidity: number;
  windSpeed: number;
  location: string;
  icon: string; // weather icon code
}

// Default location if geolocation fails
const DEFAULT_LOCATION = { lat: 40.7128, lon: -74.0060 }; // New York

export const useWeatherData = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async (latitude: number, longitude: number) => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Using OpenWeatherMap's free API
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=886705b4c1182eb1c69f28eb8c520e20`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        
        const data = await response.json();
        
        const weather: WeatherData = {
          condition: data.weather[0].main,
          temperature: Math.round(data.main.temp),
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          location: data.name,
          icon: data.weather[0].icon,
        };
        
        setWeatherData(weather);
        // Cache weather data with timestamp
        localStorage.setItem('weatherData', JSON.stringify({
          data: weather,
          timestamp: Date.now()
        }));
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError('Unable to fetch weather data. Please try again later.');
        
        // Try to use cached data if available
        const cachedData = localStorage.getItem('weatherData');
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          // Use cached data if it's less than 1 hour old
          if (Date.now() - timestamp < 3600000) {
            setWeatherData(data);
            setError(null);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    // Try to get user's location
    const getLocationAndFetchWeather = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            fetchWeatherData(position.coords.latitude, position.coords.longitude);
          },
          () => {
            // If geolocation fails, use default location
            fetchWeatherData(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon);
          }
        );
      } else {
        // Geolocation not supported, use default location
        fetchWeatherData(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon);
      }
    };
    
    getLocationAndFetchWeather();
    
    // Refresh weather data every hour
    const intervalId = setInterval(getLocationAndFetchWeather, 3600000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  return { weatherData, isLoading, error };
};
