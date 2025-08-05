
import { useState, useEffect } from 'react';

export const useBackgroundImage = (backgroundImages: string[]) => {
  const [backgroundImage, setBackgroundImage] = useState("");

  useEffect(() => {
    // Select a random background image when the component mounts
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    setBackgroundImage(backgroundImages[randomIndex]);
  }, []);

  return backgroundImage;
};

export default useBackgroundImage;
