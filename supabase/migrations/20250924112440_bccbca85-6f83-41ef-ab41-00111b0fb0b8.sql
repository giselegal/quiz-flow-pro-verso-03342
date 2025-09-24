-- Continuação Fase 5.2: Tabelas para Rate Limiting e Backup System

-- Tabela para controle de rate limiting
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL, -- IP, user_id, ou API key
  endpoint text NOT NULL,   -- Nome do endpoint
  current integer NOT NULL DEFAULT 0,
  limit_value integer NOT NULL, -- Renomeado de 'limit' para evitar palavra reservada
  window_seconds integer NOT NULL,
  reset_time integer NOT NULL,
  last_request integer NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(identifier, endpoint)
);

-- RLS para rate_limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only system can manage rate limits" ON public.rate_limits
FOR ALL USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Tabela para jobs de backup
CREATE TABLE IF NOT EXISTS public.backup_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text CHECK (type IN ('full', 'incremental', 'selective', 'critical')) NOT NULL,
  status text CHECK (status IN ('pending', 'running', 'completed', 'failed')) DEFAULT 'pending',
  tables text[] NOT NULL DEFAULT '{}',
  user_id uuid REFERENCES auth.users(id),
  description text,
  size_bytes bigint DEFAULT 0,
  error_message text,
  backup_data jsonb, -- Em produção seria uma URL de storage
  created_at timestamp with time zone DEFAULT now(),
  started_at timestamp with time zone,
  completed_at timestamp with time zone
);

-- RLS para backup_jobs
ALTER TABLE public.backup_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage all backup jobs" ON public.backup_jobs
FOR ALL USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Users can view their own backup jobs" ON public.backup_jobs
FOR SELECT USING (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Tabela para configurações de segurança do usuário
CREATE TABLE IF NOT EXISTS public.user_security_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL UNIQUE,
  two_factor_enabled boolean DEFAULT false,
  two_factor_secret text,
  backup_notifications boolean DEFAULT true,
  security_alerts boolean DEFAULT true,
  session_timeout integer DEFAULT 3600, -- em segundos
  allowed_ips inet[], -- IPs permitidos (opcional)
  security_questions jsonb DEFAULT '[]',
  last_password_change timestamp with time zone DEFAULT now(),
  login_attempts integer DEFAULT 0,
  locked_until timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- RLS para user_security_settings
ALTER TABLE public.user_security_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own security settings" ON public.user_security_settings
FOR ALL USING (auth.role() = 'authenticated' AND auth.uid() = user_id)
WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Tabela para sessões ativas (controle de segurança)
CREATE TABLE IF NOT EXISTS public.active_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  session_token text NOT NULL UNIQUE,
  ip_address inet,
  user_agent text,
  location_data jsonb,
  is_active boolean DEFAULT true,
  last_activity timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- RLS para active_sessions
ALTER TABLE public.active_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own active sessions" ON public.active_sessions
FOR SELECT USING (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "System can manage active sessions" ON public.active_sessions
FOR ALL USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Indexes para performance
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier_endpoint ON public.rate_limits(identifier, endpoint);
CREATE INDEX IF NOT EXISTS idx_rate_limits_reset_time ON public.rate_limits(reset_time);
CREATE INDEX IF NOT EXISTS idx_backup_jobs_status ON public.backup_jobs(status);
CREATE INDEX IF NOT EXISTS idx_backup_jobs_user_id ON public.backup_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_backup_jobs_created_at ON public.backup_jobs(created_at);
CREATE INDEX IF NOT EXISTS idx_active_sessions_user_id ON public.active_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_active_sessions_expires_at ON public.active_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_active_sessions_is_active ON public.active_sessions(is_active);

-- Função para limpeza automática de rate limits expirados
CREATE OR REPLACE FUNCTION public.cleanup_expired_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.rate_limits 
  WHERE reset_time < EXTRACT(EPOCH FROM now());
END;
$$;

-- Função para limpeza de sessões expiradas
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.active_sessions 
  SET is_active = false 
  WHERE expires_at < now() AND is_active = true;
  
  -- Remover sessões muito antigas
  DELETE FROM public.active_sessions 
  WHERE expires_at < now() - INTERVAL '30 days';
END;
$$;

-- Função para bloquear usuário após tentativas de login
CREATE OR REPLACE FUNCTION public.handle_failed_login_attempt(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_attempts integer;
BEGIN
  -- Incrementar tentativas de login
  UPDATE public.user_security_settings 
  SET login_attempts = login_attempts + 1,
      updated_at = now()
  WHERE user_id = p_user_id
  RETURNING login_attempts INTO current_attempts;
  
  -- Se não existe configuração, criar
  IF NOT FOUND THEN
    INSERT INTO public.user_security_settings (user_id, login_attempts)
    VALUES (p_user_id, 1);
    current_attempts := 1;
  END IF;
  
  -- Bloquear após 5 tentativas
  IF current_attempts >= 5 THEN
    UPDATE public.user_security_settings 
    SET locked_until = now() + INTERVAL '30 minutes'
    WHERE user_id = p_user_id;
    
    -- Log do bloqueio
    PERFORM public.log_security_event(
      'user_account_locked',
      jsonb_build_object(
        'user_id', p_user_id,
        'login_attempts', current_attempts,
        'locked_until', now() + INTERVAL '30 minutes'
      ),
      'high'
    );
  END IF;
END;
$$;

-- Função para reset de tentativas após login bem-sucedido
CREATE OR REPLACE FUNCTION public.reset_login_attempts(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.user_security_settings 
  SET login_attempts = 0,
      locked_until = NULL,
      updated_at = now()
  WHERE user_id = p_user_id;
END;
$$;

-- Triggers para updated_at
CREATE TRIGGER update_rate_limits_updated_at
  BEFORE UPDATE ON public.rate_limits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_security_settings_updated_at
  BEFORE UPDATE ON public.user_security_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();