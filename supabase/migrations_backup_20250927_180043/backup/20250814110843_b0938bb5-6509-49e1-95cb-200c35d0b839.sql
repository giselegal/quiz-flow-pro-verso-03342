-- SECURITY FIX: Restrict quiz_users SELECT access to funnel owners only
-- This fixes the critical vulnerability where customer email addresses and personal data were publicly accessible

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Users can view their own quiz data" ON public.quiz_users;

-- Create new restrictive policy that only allows funnel owners to view their quiz users
CREATE POLICY "Funnel owners can view their quiz users"
ON public.quiz_users
FOR SELECT
USING (
  EXISTS (
    SELECT 1 
    FROM public.quiz_sessions qs
    JOIN public.funnels f ON f.id = qs.funnel_id
    WHERE qs.id::text = quiz_users.session_id
    AND f.user_id = auth.uid()::text
    AND auth.role() = 'authenticated'::text
  )
);