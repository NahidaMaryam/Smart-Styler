
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get user from auth header
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      throw new Error("Unauthorized or user not found");
    }
    
    const user = userData.user;

    // Get the profile data
    const { data: profileData, error: profileError } = await supabaseClient
      .from("profiles")
      .select("subscription_status, subscription_tier, subscription_end")
      .eq("id", user.id)
      .single();
    
    if (profileError) {
      console.error("Error fetching profile:", profileError);
      // No subscription info found
      return new Response(
        JSON.stringify({ 
          subscribed: false,
          subscription_tier: null,
          subscription_end: null
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // If no subscription or invalid/expired subscription
    if (!profileData.subscription_status || 
        profileData.subscription_status !== "active" || 
        (profileData.subscription_end && new Date(profileData.subscription_end) < new Date())) {
      
      // If subscription is expired, update status
      if (profileData.subscription_status === "active" && 
          profileData.subscription_end && 
          new Date(profileData.subscription_end) < new Date()) {
        
        await supabaseClient
          .from("profiles")
          .update({
            subscription_status: "expired"
          })
          .eq("id", user.id);
          
        // Also update subscriptions table if it exists
        const { data: subData } = await supabaseClient
          .from("subscriptions")
          .select("id")
          .eq("user_id", user.id)
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(1);
          
        if (subData && subData.length > 0) {
          await supabaseClient
            .from("subscriptions")
            .update({
              status: "expired",
              updated_at: new Date().toISOString()
            })
            .eq("id", subData[0].id);
        }
      }
      
      return new Response(
        JSON.stringify({ 
          subscribed: false,
          subscription_tier: null,
          subscription_end: null
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Active subscription found
    return new Response(
      JSON.stringify({
        subscribed: true,
        subscription_tier: profileData.subscription_tier || "Premium",
        subscription_end: profileData.subscription_end,
        user_id: user.id
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Check subscription error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});
