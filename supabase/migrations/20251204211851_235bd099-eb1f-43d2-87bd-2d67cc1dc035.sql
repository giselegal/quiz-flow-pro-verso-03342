-- Create table for reusable block templates
CREATE TABLE public.block_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  block_type TEXT NOT NULL,
  block_config JSONB NOT NULL DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.block_library ENABLE ROW LEVEL SECURITY;

-- Users can view their own blocks and public blocks
CREATE POLICY "Users can view own and public blocks"
ON public.block_library
FOR SELECT
USING (user_id = auth.uid() OR is_public = true);

-- Users can insert their own blocks
CREATE POLICY "Users can insert own blocks"
ON public.block_library
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update their own blocks
CREATE POLICY "Users can update own blocks"
ON public.block_library
FOR UPDATE
USING (user_id = auth.uid());

-- Users can delete their own blocks
CREATE POLICY "Users can delete own blocks"
ON public.block_library
FOR DELETE
USING (user_id = auth.uid());

-- Create updated_at trigger
CREATE TRIGGER update_block_library_updated_at
BEFORE UPDATE ON public.block_library
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();