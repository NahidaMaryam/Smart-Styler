
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

  // Create Supabase client - use service role key for admin operations
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
    const { planId } = await req.json();
    if (!planId) {
      throw new Error("Plan ID is required");
    }
    
    console.log("Plan selected:", planId);

    // Normalize plan ID - handle different formats from frontend
    let normalizedPlanId = planId.toLowerCase()
      .replace(/ /g, '_')  // Replace spaces with underscores
      .replace(/\+/g, '_plus'); // Replace + with _plus
    
    // Set amount based on the normalized plan ID
    let amount;
    let currency = "INR";
    
    if (normalizedPlanId === "styler_plus" || normalizedPlanId === "styler+".toLowerCase().replace("+", "_plus")) {
      amount = 4900; // ₹49.00 (in paise)
    } else if (normalizedPlanId === "styler_plus_annual" || normalizedPlanId === "styler+_annual" || normalizedPlanId === "styler+ annual".toLowerCase().replace(" ", "_").replace("+", "_plus")) {
      amount = 54900; // ₹549.00 (in paise)
    } else {
      console.error("Invalid plan ID received:", planId, "normalized to:", normalizedPlanId);
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
    const authHeader64 = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    console.log("Creating RazorPay order with credentials");
    
    const orderResponse = await fetch(`${RAZORPAY_API}orders`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${authHeader64}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: amount,
        currency: currency,
        receipt: `receipt_${user.id}_${Date.now()}`,
        notes: {
          user_id: user.id,
          plan: normalizedPlanId,
          email: user.email
        }
      })
    });

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json();
      console.error("RazorPay API Error:", errorData);
      throw new Error(`RazorPay error: ${errorData?.error?.description || "Unknown error from payment provider"}`);
    }
    
    const orderData = await orderResponse.json();
    console.log("RazorPay order created:", orderData.id);

    // Ensure the subscriptions table exists in Supabase
    try {
      // First, test if the table exists by trying to select from it
      const { error: testError } = await supabaseClient
        .from("subscriptions")
        .select("id")
        .limit(1);

      if (testError) {
        console.log("Creating subscriptions table...");
        // Create the table if it doesn't exist yet
        const { error: createError } = await supabaseClient.rpc('create_subscriptions_table');
        if (createError) {
          console.error("Failed to create subscriptions table:", createError);
        } else {
          console.log("Subscriptions table created successfully");
        }
      } else {
        console.log("Subscriptions table already exists");
      }
    } catch (dbError) {
      console.error("Database error:", dbError);
      // Continue execution anyway
    }

    // After creating the order, store the subscription info in Supabase
    const { error: subscriptionError } = await supabaseClient
      .from("subscriptions")
      .insert({
        user_id: user.id,
        order_id: orderData.id,
        plan: normalizedPlanId,
        status: "pending",
        amount: amount / 100, // Convert paise to rupees for storage
        currency: currency
      });

    if (subscriptionError) {
      console.error("Error storing subscription:", subscriptionError);
    } else {
      console.log("Subscription record created in database");
    }

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
