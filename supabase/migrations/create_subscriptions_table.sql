
-- Create a table for storing subscription information
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  order_id TEXT NOT NULL,
  payment_id TEXT,
  plan TEXT NOT NULL,
  status TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  UNIQUE(order_id)
);

-- Add subscription related fields to the profiles table if they don't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS subscription_status TEXT,
ADD COLUMN IF NOT EXISTS subscription_tier TEXT,
ADD COLUMN IF NOT EXISTS subscription_start TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS subscription_end TIMESTAMP WITH TIME ZONE;

-- Enable Row Level Security
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for subscriptions
CREATE POLICY "Users can view own subscriptions" 
ON public.subscriptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Only authenticated users can create subscriptions" 
ON public.subscriptions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Functions need the ability to update subscriptions
CREATE POLICY "Functions can update subscriptions" 
ON public.subscriptions 
FOR UPDATE 
USING (true);
