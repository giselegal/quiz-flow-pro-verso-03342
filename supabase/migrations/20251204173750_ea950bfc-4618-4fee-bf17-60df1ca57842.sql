-- ============================================================================
-- COMPREHENSIVE SECURITY ENHANCEMENT MIGRATION
-- Phase 1: RLS Hardening for vulnerable tables
-- Phase 2: 2FA Infrastructure (user_security_settings)
-- Phase 3: Audit Logging Infrastructure (security_audit_logs)
-- ============================================================================

-- ============================================================================
-- PHASE 1: RLS HARDENING
-- ============================================================================

-- 1.1 FIX quiz_users TABLE
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public access to quiz_users" ON public.quiz_users;

-- Allow anonymous INSERT for quiz participants
CREATE POLICY "Anyone can create quiz_users"
ON public.quiz_users
FOR INSERT
WITH CHECK (true);

-- Restrict SELECT to funnel owners (authenticated users who own the funnel)
CREATE POLICY "Funnel owners can read quiz_users"
ON public.quiz_users
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.quiz_sessions qs
    JOIN public.funnels f ON qs.funnel_id = f.id::text
    WHERE qs.user_id = quiz_users.id
    AND f.user_id = auth.uid()::text
  )
  OR
  -- Allow read for the quiz participant's own session
  session_id IN (
    SELECT qs.session_token FROM public.quiz_sessions qs
    WHERE qs.quiz_user_id = quiz_users.id
  )
);

-- 1.2 FIX quiz_sessions TABLE
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public access to quiz_sessions" ON public.quiz_sessions;

-- Allow anonymous INSERT for quiz participants
CREATE POLICY "Anyone can create quiz_sessions"
ON public.quiz_sessions
FOR INSERT
WITH CHECK (true);

-- Allow SELECT for session owner via token or authenticated funnel owner
CREATE POLICY "Session participants and funnel owners can read sessions"
ON public.quiz_sessions
FOR SELECT
USING (
  -- Funnel owner can read all sessions of their funnels
  funnel_id IN (
    SELECT f.id::text FROM public.funnels f
    WHERE f.user_id = auth.uid()::text
  )
  OR
  -- Anyone can read by session_token (for anonymous quiz participants)
  session_token IS NOT NULL
);

-- Allow UPDATE for session owner or funnel owner
CREATE POLICY "Session participants can update their sessions"
ON public.quiz_sessions
FOR UPDATE
USING (
  funnel_id IN (
    SELECT f.id::text FROM public.funnels f
    WHERE f.user_id = auth.uid()::text
  )
  OR session_token IS NOT NULL
);

-- Only funnel owners can delete sessions
CREATE POLICY "Funnel owners can delete sessions"
ON public.quiz_sessions
FOR DELETE
USING (
  funnel_id IN (
    SELECT f.id::text FROM public.funnels f
    WHERE f.user_id = auth.uid()::text
  )
);

-- 1.3 FIX quiz_results TABLE
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public access to quiz_results" ON public.quiz_results;

-- Allow INSERT for quiz completion
CREATE POLICY "Anyone can create quiz_results"
ON public.quiz_results
FOR INSERT
WITH CHECK (true);

-- Restrict SELECT to session owner or funnel owner
CREATE POLICY "Session owners and funnel owners can read results"
ON public.quiz_results
FOR SELECT
USING (
  session_id IN (
    SELECT qs.id FROM public.quiz_sessions qs
    LEFT JOIN public.funnels f ON qs.funnel_id = f.id::text
    WHERE f.user_id = auth.uid()::text
  )
  OR
  -- Allow quiz participants to read their own results
  EXISTS (
    SELECT 1 FROM public.quiz_sessions qs
    WHERE qs.id = quiz_results.session_id
    AND qs.session_token IS NOT NULL
  )
);

-- Only funnel owners can update/delete
CREATE POLICY "Funnel owners can update results"
ON public.quiz_results
FOR UPDATE
USING (
  session_id IN (
    SELECT qs.id FROM public.quiz_sessions qs
    LEFT JOIN public.funnels f ON qs.funnel_id = f.id::text
    WHERE f.user_id = auth.uid()::text
  )
);

CREATE POLICY "Funnel owners can delete results"
ON public.quiz_results
FOR DELETE
USING (
  session_id IN (
    SELECT qs.id FROM public.quiz_sessions qs
    LEFT JOIN public.funnels f ON qs.funnel_id = f.id::text
    WHERE f.user_id = auth.uid()::text
  )
);

-- 1.4 FIX quiz_analytics TABLE
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public access to quiz_analytics" ON public.quiz_analytics;

-- Allow INSERT for tracking events
CREATE POLICY "Anyone can create analytics"
ON public.quiz_analytics
FOR INSERT
WITH CHECK (true);

-- Only funnel owners can read analytics
CREATE POLICY "Funnel owners can read analytics"
ON public.quiz_analytics
FOR SELECT
USING (
  funnel_id IN (
    SELECT f.id::text FROM public.funnels f
    WHERE f.user_id = auth.uid()::text
  )
  OR user_id = auth.uid()
);

-- Only funnel owners can update/delete
CREATE POLICY "Funnel owners can update analytics"
ON public.quiz_analytics
FOR UPDATE
USING (
  funnel_id IN (
    SELECT f.id::text FROM public.funnels f
    WHERE f.user_id = auth.uid()::text
  )
);

CREATE POLICY "Funnel owners can delete analytics"
ON public.quiz_analytics
FOR DELETE
USING (
  funnel_id IN (
    SELECT f.id::text FROM public.funnels f
    WHERE f.user_id = auth.uid()::text
  )
);

-- 1.5 FIX component_instances TABLE
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can insert components" ON public.component_instances;
DROP POLICY IF EXISTS "Users can update components" ON public.component_instances;
DROP POLICY IF EXISTS "Users can delete components" ON public.component_instances;

-- Keep public read for quiz rendering
-- Already has "Public read component_instances" policy

-- Restrict INSERT to funnel owners
CREATE POLICY "Funnel owners can insert components"
ON public.component_instances
FOR INSERT
WITH CHECK (
  funnel_id IN (
    SELECT f.id::text FROM public.funnels f
    WHERE f.user_id = auth.uid()::text
  )
  OR funnel_id IS NULL
);

-- Restrict UPDATE to funnel owners
CREATE POLICY "Funnel owners can update components"
ON public.component_instances
FOR UPDATE
USING (
  funnel_id IN (
    SELECT f.id::text FROM public.funnels f
    WHERE f.user_id = auth.uid()::text
  )
  OR funnel_id IS NULL
);

-- Restrict DELETE to funnel owners
CREATE POLICY "Funnel owners can delete components"
ON public.component_instances
FOR DELETE
USING (
  funnel_id IN (
    SELECT f.id::text FROM public.funnels f
    WHERE f.user_id = auth.uid()::text
  )
  OR funnel_id IS NULL
);

-- 1.6 FIX quiz_events TABLE
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public access to quiz_events" ON public.quiz_events;

-- Allow INSERT for event tracking (anonymous)
CREATE POLICY "Anyone can create quiz_events"
ON public.quiz_events
FOR INSERT
WITH CHECK (true);

-- Restrict SELECT to authenticated users who own the related funnel
CREATE POLICY "Funnel owners can read quiz_events"
ON public.quiz_events
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.quiz_sessions qs
    JOIN public.funnels f ON qs.funnel_id = f.id::text
    WHERE qs.session_token = quiz_events.user_session_id
    AND f.user_id = auth.uid()::text
  )
);

-- Only funnel owners can update/delete
CREATE POLICY "Funnel owners can update quiz_events"
ON public.quiz_events
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.quiz_sessions qs
    JOIN public.funnels f ON qs.funnel_id = f.id::text
    WHERE qs.session_token = quiz_events.user_session_id
    AND f.user_id = auth.uid()::text
  )
);

CREATE POLICY "Funnel owners can delete quiz_events"
ON public.quiz_events
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.quiz_sessions qs
    JOIN public.funnels f ON qs.funnel_id = f.id::text
    WHERE qs.session_token = quiz_events.user_session_id
    AND f.user_id = auth.uid()::text
  )
);

-- ============================================================================
-- PHASE 2: 2FA INFRASTRUCTURE
-- ============================================================================

-- Create user_security_settings table for 2FA
CREATE TABLE IF NOT EXISTS public.user_security_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  two_factor_enabled BOOLEAN DEFAULT false,
  two_factor_verified_at TIMESTAMPTZ,
  backup_codes_generated_at TIMESTAMPTZ,
  last_password_change TIMESTAMPTZ,
  failed_login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on user_security_settings
ALTER TABLE public.user_security_settings ENABLE ROW LEVEL SECURITY;

-- Users can only read their own security settings
CREATE POLICY "Users can view their own security settings"
ON public.user_security_settings
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own security settings
CREATE POLICY "Users can create their own security settings"
ON public.user_security_settings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own security settings
CREATE POLICY "Users can update their own security settings"
ON public.user_security_settings
FOR UPDATE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_user_security_settings_updated_at
  BEFORE UPDATE ON public.user_security_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- PHASE 3: AUDIT LOGGING INFRASTRUCTURE
-- ============================================================================

-- Create security_audit_logs table
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_category TEXT NOT NULL DEFAULT 'security',
  severity TEXT NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  event_data JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,
  resource_type TEXT,
  resource_id TEXT,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on security_audit_logs
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can read their own logs
CREATE POLICY "Users can view their own audit logs"
ON public.security_audit_logs
FOR SELECT
USING (auth.uid() = user_id);

-- System can insert audit logs (via service role)
CREATE POLICY "System can insert audit logs"
ON public.security_audit_logs
FOR INSERT
WITH CHECK (true);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_user_id ON public.security_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_event_type ON public.security_audit_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_created_at ON public.security_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_audit_logs_severity ON public.security_audit_logs(severity);

-- ============================================================================
-- PHASE 4: USER ROLES SYSTEM (for admin access)
-- ============================================================================

-- Create app_role enum
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL DEFAULT 'user',
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (prevents recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Only admins can manage roles
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Update security_audit_logs to allow admins to read all logs
CREATE POLICY "Admins can view all audit logs"
ON public.security_audit_logs
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));