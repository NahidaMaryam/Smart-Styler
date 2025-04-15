
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, messageHistory } = await req.json();

    // Format message history for Gemini API
    const formattedHistory = messageHistory.map((msg: any) => ({
      role: msg.isUser ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    // Add system message at the beginning
    const geminiMessages = [
      {
        role: "model",
        parts: [{ 
          text: `You are an AI Style Assistant specializing in fashion advice, outfit recommendations, and style guidance.
          You can help users with outfit suggestions for various occasions (work, parties, dates, etc.), 
          seasonal style tips, color coordination, and outfit feedback.
          When users upload images, provide thoughtful feedback on their outfits.
          Be friendly, positive, and helpful. Provide specific, actionable style advice.
          Always consider context like occasion, weather, and personal preferences.
          Keep responses concise and friendly.` 
        }]
      },
      ...formattedHistory,
      {
        role: "user",
        parts: [{ text: message }]
      }
    ];

    // Call Gemini API
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": geminiApiKey || "",
      },
      body: JSON.stringify({
        contents: geminiMessages,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    const data = await response.json();
    
    // Extract the response text from Gemini
    let responseText = "";
    try {
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        responseText = data.candidates[0].content.parts[0].text;
      } else if (data.promptFeedback && data.promptFeedback.blockReason) {
        responseText = `Sorry, I couldn't process that request: ${data.promptFeedback.blockReason}`;
      } else {
        console.log("Unexpected Gemini response structure:", JSON.stringify(data));
        responseText = "Sorry, I encountered an issue processing your request.";
      }
    } catch (error) {
      console.error("Error parsing Gemini response:", error);
      responseText = "Sorry, I encountered an issue understanding the response.";
    }

    return new Response(JSON.stringify({ response: responseText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in gemini-stylist function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
