
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// RazorPay API endpoints
const RAZORPAY_API = "https://api.razorpay.com/v1/";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Create Supabase client using the service role key for admin operations
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    console.log("Create checkout function called");
    
    // Retrieve authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      console.error("Authentication error:", userError);
      throw new Error("User not authenticated");
    }
    
    const user = userData.user;
    if (!user?.email) {
      throw new Error("User email not available");
    }
    
    console.log("User authenticated:", user.id);

    // Get the requested plan from request body
    let reqBody;
    try {
      reqBody = await req.json();
    } catch (e) {
      throw new Error("Invalid request body");
    }
    
    const { planId } = reqBody;
    if (!planId) {
      throw new Error("Plan ID is required");
    }
    
    console.log("Plan selected:", planId);

    // Set amount based on the plan
    let amount;
    let currency = "INR";
    
    switch (planId) {
      case "styler_plus":
        amount = 4900; // ₹49.00 (in paise)
        break;
      case "styler_plus_annual":
        amount = 54900; // ₹549.00 (in paise)
        break;
      default:
        throw new Error("Invalid plan selected");
    }
    
    console.log("Amount set:", amount, currency);

    // Check if we have RazorPay credentials
    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    
    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new Error("RazorPay API credentials not configured");
    }
    
    // Create RazorPay order
    const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    console.log("Creating RazorPay order");
    
    const orderResponse = await fetch(`${RAZORPAY_API}orders`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: amount,
        currency: currency,
        receipt: `receipt_${user.id}_${Date.now()}`,
        notes: {
          user_id: user.id,
          plan: planId,
          email: user.email
        }
      })
    });

    const orderData = await orderResponse.json();
    
    if (!orderResponse.ok) {
      console.error("RazorPay error:", orderData);
      throw new Error(`RazorPay error: ${orderData.error?.description || JSON.stringify(orderData)}`);
    }
    
    console.log("RazorPay order created:", orderData.id);

    // After creating the order, store the subscription info in your Supabase table
    const { error: subscriptionError } = await supabaseClient
      .from("subscriptions")
      .insert({
        user_id: user.id,
        order_id: orderData.id,
        plan: planId,
        status: "pending",
        amount: amount / 100, // Convert paise to rupees for storage
        currency: currency
      });

    if (subscriptionError) {
      console.error("Error storing subscription:", subscriptionError);
    }
    
    console.log("Subscription record created in database");

    return new Response(JSON.stringify({ 
      order_id: orderData.id,
      amount: amount,
      currency: currency,
      email: user.email,
      key_id: razorpayKeyId  // Send the key ID to the frontend
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Checkout session error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
