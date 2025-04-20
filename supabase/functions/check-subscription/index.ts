
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
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

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Find the customer in Stripe
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      // No customer found, user is on free plan
      return new Response(
        JSON.stringify({ 
          subscribed: false,
          subscription_tier: null,
          subscription_end: null
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const customerId = customers.data[0].id;

    // Check for active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      expand: ["data.default_payment_method"],
    });

    if (subscriptions.data.length === 0) {
      // No active subscription, user is on free plan
      return new Response(
        JSON.stringify({ 
          subscribed: false,
          subscription_tier: null,
          subscription_end: null
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get subscription details
    const subscription = subscriptions.data[0];
    const priceId = subscription.items.data[0].price.id;
    
    // Get price details to determine the plan tier
    const price = await stripe.prices.retrieve(priceId);
    
    // Determine if annual or monthly based on the price interval
    const isAnnual = price.recurring?.interval === "year";
    
    return new Response(
      JSON.stringify({
        subscribed: true,
        subscription_tier: isAnnual ? "Premium Annual" : "Premium",
        subscription_end: new Date(subscription.current_period_end * 1000).toISOString(),
        customer_id: customerId
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
