
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Create Supabase client with the service role key to bypass RLS
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    // Get the user from the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      console.error("Authentication error:", userError);
      throw new Error("Unauthorized or user not found");
    }
    
    const user = userData.user;
    console.log("User authenticated:", user.id);
    
    // Parse request body
    let requestBody = {};
    try {
      if (req.method === "POST") {
        requestBody = await req.json();
      }
    } catch (e) {
      // If parsing fails, use an empty object
      console.log("No request body or invalid JSON");
    }
    
    const action = requestBody.action || null;
    
    // Get user's subscription info from the database
    const { data: subscriptionData, error: subError } = await supabaseClient
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1);
    
    // If there's an error or no subscription found, return not subscribed
    if (subError) {
      console.log("Database query error:", subError);
    }
    
    const hasActiveSubscription = subscriptionData && subscriptionData.length > 0;
    
    // If action is cancel, handle cancellation logic
    if (action === 'cancel' && hasActiveSubscription) {
      const subscription = subscriptionData[0];
      
      // Update the subscription status to cancelled
      const { error: updateError } = await supabaseClient
        .from("subscriptions")
        .update({
          status: "cancelled",
          updated_at: new Date().toISOString()
        })
        .eq("id", subscription.id);
      
      if (updateError) {
        throw new Error(`Failed to cancel subscription: ${updateError.message}`);
      }
      
      // Update the user's profile
      const { error: profileError } = await supabaseClient
        .from("profiles")
        .update({
          subscription_status: "cancelled",
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id);
      
      if (profileError) {
        console.error("Error updating profile:", profileError);
      }
      
      return new Response(JSON.stringify({
        success: true,
        message: "Subscription cancelled successfully"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      });
    }
    
    // Return subscription status
    if (hasActiveSubscription) {
      const subscription = subscriptionData[0];
      return new Response(JSON.stringify({
        subscribed: true,
        subscription_tier: subscription.plan === "styler_plus_annual" ? "Premium Annual" : "Premium",
        subscription_end: subscription.valid_until
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      });
    } else {
      // Check if there's a subscription in profiles table
      const { data: profileData } = await supabaseClient
        .from("profiles")
        .select("subscription_status, subscription_tier, subscription_end")
        .eq("id", user.id)
        .single();
      
      if (profileData && profileData.subscription_status === "active") {
        return new Response(JSON.stringify({
          subscribed: true,
          subscription_tier: profileData.subscription_tier,
          subscription_end: profileData.subscription_end
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200
        });
      }
      
      return new Response(JSON.stringify({
        subscribed: false
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      });
    }
  } catch (error) {
    console.error("Check subscription error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500
    });
  }
});
