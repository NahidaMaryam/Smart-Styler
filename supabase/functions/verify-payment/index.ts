
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { createHmac } from "https://deno.land/std@0.190.0/crypto/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Create Supabase client
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    // Get user from auth header
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      throw new Error("Unauthorized or user not found");
    }
    
    const user = userData.user;

    // Get payment details from request body
    const { payment_id, order_id, signature } = await req.json();
    
    if (!payment_id || !order_id || !signature) {
      throw new Error("Missing payment verification parameters");
    }

    // Verify the signature
    const secret = Deno.env.get("RAZORPAY_KEY_SECRET") || "";
    const generatedSignature = createHmac("sha256", secret)
      .update(order_id + "|" + payment_id)
      .digest("hex");
    
    if (generatedSignature !== signature) {
      throw new Error("Invalid payment signature");
    }

    // Get the subscription details from the database
    const { data: subscriptionData, error: fetchError } = await supabaseClient
      .from("subscriptions")
      .select("*")
      .eq("order_id", order_id)
      .eq("user_id", user.id)
      .single();
    
    if (fetchError || !subscriptionData) {
      throw new Error("Subscription not found");
    }

    // Update the subscription status
    const { error: updateError } = await supabaseClient
      .from("subscriptions")
      .update({
        status: "active",
        payment_id: payment_id,
        updated_at: new Date().toISOString(),
        valid_until: calculateValidUntil(subscriptionData.plan)
      })
      .eq("id", subscriptionData.id);
    
    if (updateError) {
      throw new Error(`Error updating subscription: ${updateError.message}`);
    }

    // Also update the user's profile with subscription info
    const { error: profileError } = await supabaseClient
      .from("profiles")
      .update({
        subscription_tier: subscriptionData.plan === "styler_plus_annual" ? "Premium Annual" : "Premium",
        subscription_status: "active",
        subscription_start: new Date().toISOString(),
        subscription_end: calculateValidUntil(subscriptionData.plan)
      })
      .eq("id", user.id);
    
    if (profileError) {
      console.error("Error updating profile:", profileError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Payment verified successfully"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Payment verification error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});

// Helper function to calculate subscription end date
function calculateValidUntil(plan: string): string {
  const now = new Date();
  if (plan === "styler_plus_annual") {
    // Add 1 year
    now.setFullYear(now.getFullYear() + 1);
  } else {
    // Add 30 days for monthly plan
    now.setDate(now.getDate() + 30);
  }
  return now.toISOString();
}
