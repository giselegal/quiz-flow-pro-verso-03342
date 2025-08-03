-- Fix search_path security issue first
ALTER ROLE postgres SET search_path = public;
ALTER ROLE authenticator SET search_path = public;
ALTER ROLE anon SET search_path = public;
ALTER ROLE authenticated SET search_path = public;
ALTER ROLE service_role SET search_path = public;

-- Check if tables exist and fix user_id typing
DO $$ 
BEGIN
  -- Update funnels table user_id type if needed
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'funnels' AND column_name = 'user_id' AND data_type = 'text') THEN
    ALTER TABLE public.funnels ALTER COLUMN user_id TYPE UUID USING user_id::UUID;
  END IF;
  
  -- Update funnel_pages table user_id type if needed  
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'funnel_pages' AND column_name = 'user_id' AND data_type = 'text') THEN
    ALTER TABLE public.funnel_pages ALTER COLUMN user_id TYPE UUID USING user_id::UUID;
  END IF;
END $$;

-- Recreate policies with correct UUID typing
DROP POLICY IF EXISTS "Users can view their own funnels" ON public.funnels;
DROP POLICY IF EXISTS "Users can create their own funnels" ON public.funnels;
DROP POLICY IF EXISTS "Users can update their own funnels" ON public.funnels;
DROP POLICY IF EXISTS "Users can delete their own funnels" ON public.funnels;

DROP POLICY IF EXISTS "Users can view their own funnel pages" ON public.funnel_pages;
DROP POLICY IF EXISTS "Users can create their own funnel pages" ON public.funnel_pages;
DROP POLICY IF EXISTS "Users can update their own funnel pages" ON public.funnel_pages;
DROP POLICY IF EXISTS "Users can delete their own funnel pages" ON public.funnel_pages;

-- Create correct policies for funnels
CREATE POLICY "Users can view their own funnels" 
ON public.funnels 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own funnels" 
ON public.funnels 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own funnels" 
ON public.funnels 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own funnels" 
ON public.funnels 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create correct policies for funnel_pages
CREATE POLICY "Users can view their own funnel pages" 
ON public.funnel_pages 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own funnel pages" 
ON public.funnel_pages 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own funnel pages" 
ON public.funnel_pages 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own funnel pages" 
ON public.funnel_pages 
FOR DELETE 
USING (auth.uid() = user_id);