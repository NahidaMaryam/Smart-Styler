
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import PageContainer from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaintBucket, MessageSquare, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

const History = () => {
  const [showMore, setShowMore] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState("all");
  
  // Sample history data (in a real app would come from database)
  const colorAnalysisHistory = [
    {
      id: "ca1",
      date: "April 4, 2025",
      results: {
        skinTone: "Medium",
        undertone: "Warm",
        season: "Autumn"
      }
    },
    {
      id: "ca2",
      date: "March 15, 2025",
      results: {
        skinTone: "Medium",
        undertone: "Neutral",
        season: "Summer"
      }
    }
  ];
  
  const stylistHistory = [
    {
      id: "sh1",
      date: "April 8, 2025",
      query: "What should I wear to a business meeting?",
      response: "For a business meeting, I recommend a navy blue blazer with neutral trousers or skirt. Pair with a light-colored blouse or shirt underneath. Finish with modest accessories and polished shoes that complement your outfit. This classic combination projects professionalism while honoring your warm color palette."
    },
    {
      id: "sh2",
      date: "April 3, 2025",
      query: "Outfit for weekend brunch",
      response: "For a weekend brunch, I suggest casual elegance with comfort. Try dark wash jeans paired with a soft rust-colored top that complements your autumn color palette. Layer with a beige cardigan or light jacket for changeable weather. Complete with comfortable yet stylish footwear like loafers or ankle boots, and add simple gold accessories for a polished touch."
    },
    {
      id: "sh3",
      date: "March 28, 2025",
      query: "Date night outfit suggestion",
      response: "For date night, consider an outfit that makes you feel confident and comfortable. Given your autumn color palette, I'd suggest a deep burgundy or forest green dress that flatters your skin tone. If you prefer separates, try black jeans with an elegant gold or warm amber top. Complete with simple accessories and footwear that you can comfortably wear throughout the evening."
    }
  ];
  
  // Toggle show more/less for long text
  const toggleShowMore = (id: string) => {
    setShowMore(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Filter history items based on active tab
  const filteredHistory = activeTab === "all" 
    ? [...colorAnalysisHistory, ...stylistHistory]
    : activeTab === "color" 
      ? colorAnalysisHistory 
      : stylistHistory;
  
  // Determine icon and color based on history item type
  const getHistoryItemIcon = (id: string) => {
    if (id.startsWith("ca")) {
      return <PaintBucket className="w-5 h-5 text-accent" />;
    }
    return <MessageSquare className="w-5 h-5 text-primary" />;
  };
  
  return (
    <Layout>
      <PageContainer>
        <h1 className="text-3xl font-bold mb-2">Your History</h1>
        <p className="text-muted-foreground mb-8">
          Review your past color analyses and stylist consultations.
        </p>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList>
            <TabsTrigger value="all">All Activity</TabsTrigger>
            <TabsTrigger value="color">Color Analysis</TabsTrigger>
            <TabsTrigger value="stylist">AI Stylist</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="animate-fade-in space-y-4">
            {filteredHistory.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="mx-auto bg-muted w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="w-8 h-8 text-muted-foreground opacity-70" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No history yet</h3>
                  <p className="text-muted-foreground mb-6">
                    You haven't used this feature yet. Try it out to see your history here.
                  </p>
                  {activeTab === "color" && (
                    <Button asChild>
                      <Link to="/color-analysis">Try Color Analysis</Link>
                    </Button>
                  )}
                  {activeTab === "stylist" && (
                    <Button asChild>
                      <Link to="/ai-stylist">Ask AI Stylist</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              filteredHistory.map((item) => (
                <Card key={item.id} className="animate-fade-in">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="flex items-center">
                      {getHistoryItemIcon(item.id)}
                      <CardTitle className="ml-2 text-lg">
                        {'query' in item ? item.query : 'Color Analysis'}
                      </CardTitle>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-1" />
                      {item.date}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {'results' in item ? (
                      <div className="grid grid-cols-3 gap-4 mt-2">
                        <div className="bg-secondary rounded-lg p-3 text-center">
                          <div className="font-medium text-xs mb-1">Skin Tone</div>
                          <div className="text-base">{item.results.skinTone}</div>
                        </div>
                        <div className="bg-secondary rounded-lg p-3 text-center">
                          <div className="font-medium text-xs mb-1">Undertone</div>
                          <div className="text-base">{item.results.undertone}</div>
                        </div>
                        <div className="bg-secondary rounded-lg p-3 text-center">
                          <div className="font-medium text-xs mb-1">Season</div>
                          <div className="text-base">{item.results.season}</div>
                        </div>
                        <div className="col-span-3 mt-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link to="/color-analysis">View Full Analysis</Link>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2">
                        <div className={`${showMore[item.id] ? '' : 'line-clamp-3'}`}>
                          {item.response}
                        </div>
                        {item.response.length > 150 && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => toggleShowMore(item.id)}
                            className="mt-2 h-8"
                          >
                            {showMore[item.id] ? (
                              <>
                                <ChevronUp className="w-4 h-4 mr-1" />
                                Show Less
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-4 h-4 mr-1" />
                                Show More
                              </>
                            )}
                          </Button>
                        )}
                        <div className="mt-3">
                          <Button variant="outline" size="sm" asChild>
                            <Link to="/ai-stylist">Ask Again</Link>
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </PageContainer>
    </Layout>
  );
};

export default History;
