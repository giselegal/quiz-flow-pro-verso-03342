-- Fix search_path security issue
ALTER ROLE postgres SET search_path = public;
ALTER ROLE authenticator SET search_path = public;
ALTER ROLE anon SET search_path = public;
ALTER ROLE authenticated SET search_path = public;
ALTER ROLE service_role SET search_path = public;

-- Create funnels table with proper RLS
CREATE TABLE IF NOT EXISTS public.funnels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.funnels ENABLE ROW LEVEL SECURITY;

-- Create policies for funnels
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

-- Create funnel_pages table
CREATE TABLE IF NOT EXISTS public.funnel_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  funnel_id UUID NOT NULL REFERENCES public.funnels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  page_order INTEGER NOT NULL DEFAULT 1,
  page_type TEXT NOT NULL DEFAULT 'quiz',
  content JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on funnel_pages
ALTER TABLE public.funnel_pages ENABLE ROW LEVEL SECURITY;

-- Create policies for funnel_pages
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

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_funnels_updated_at
  BEFORE UPDATE ON public.funnels
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_funnel_pages_updated_at
  BEFORE UPDATE ON public.funnel_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();