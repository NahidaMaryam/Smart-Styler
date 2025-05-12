
-- Function to check if a table exists
CREATE OR REPLACE FUNCTION public.check_table_exists(table_name text)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
  table_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public'
      AND table_name = $1
  ) INTO table_exists;
  
  RETURN table_exists;
END;
$$;

-- Function to create subscriptions table if it doesn't exist
CREATE OR REPLACE FUNCTION public.create_subscriptions_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    order_id TEXT NOT NULL UNIQUE,
    payment_id TEXT,
    plan TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    amount NUMERIC NOT NULL,
    currency TEXT NOT NULL,
    valid_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  
  -- Enable RLS
  ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
  
  -- Create policies
  -- Allow users to view their own subscriptions
  CREATE POLICY IF NOT EXISTS "Users can view their own subscriptions" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);
    
  -- Allow service role to insert and update
  CREATE POLICY IF NOT EXISTS "Service role can insert subscriptions" ON public.subscriptions
    FOR INSERT TO service_role USING (true);
    
  CREATE POLICY IF NOT EXISTS "Service role can update subscriptions" ON public.subscriptions
    FOR UPDATE TO service_role USING (true);
END;
$$;
