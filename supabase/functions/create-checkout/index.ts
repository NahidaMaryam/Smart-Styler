
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

  // Create Supabase client using the anon key for user authentication
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    // Retrieve authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");

    // Get the requested plan from request body
    const { planId } = await req.json();
    if (!planId) throw new Error("Plan ID is required");

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

    // Create RazorPay order
    const auth = btoa(`${Deno.env.get("RAZORPAY_KEY_ID")}:${Deno.env.get("RAZORPAY_KEY_SECRET")}`);
    
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
      throw new Error(`RazorPay error: ${orderData.error?.description || "Failed to create order"}`);
    }

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

    return new Response(JSON.stringify({ 
      order_id: orderData.id,
      amount: amount,
      currency: currency,
      email: user.email
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Checkout session error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
