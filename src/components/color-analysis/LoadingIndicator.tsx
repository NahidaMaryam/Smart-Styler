
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const LoadingIndicator = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <Card className="animate-pulse">
        <CardHeader>
          <CardTitle>Analyzing your image...</CardTitle>
          <CardDescription>
            Our AI is processing your photo to detect your skin tone and color palette.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="h-8 w-8 rounded-full border-4 border-accent border-t-transparent animate-spin"></div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoadingIndicator;
