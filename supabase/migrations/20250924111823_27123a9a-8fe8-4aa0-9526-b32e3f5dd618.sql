-- Fase 5.1: Security Hardening - Correção de RLS Policies
-- Corrigindo políticas que permitem acesso anônimo desnecessário

-- 1. Corrigir search_path das funções existentes
ALTER FUNCTION public.cleanup_old_analytics_data() SET search_path = 'public';
ALTER FUNCTION public.cleanup_old_metrics() SET search_path = 'public';
ALTER FUNCTION public.calculate_goal_progress() SET search_path = 'public';
ALTER FUNCTION public.handle_new_user() SET search_path = 'public';
ALTER FUNCTION public.update_quiz_session_activity() SET search_path = 'public';

-- 2. Remover políticas permissivas e implementar controle de acesso mais restritivo
-- Para admin_goals - apenas authenticated users
DROP POLICY IF EXISTS "Users can manage their own goals" ON public.admin_goals;
CREATE POLICY "Authenticated users can manage their own goals" ON public.admin_goals
FOR ALL USING (auth.role() = 'authenticated' AND auth.uid() = user_id)
WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Para ai_optimization_recommendations - apenas authenticated users
DROP POLICY IF EXISTS "Users can view their own AI recommendations" ON public.ai_optimization_recommendations;
DROP POLICY IF EXISTS "Users can update their own AI recommendations" ON public.ai_optimization_recommendations;
DROP POLICY IF EXISTS "Users can insert their own AI recommendations" ON public.ai_optimization_recommendations;

CREATE POLICY "Authenticated users can view their own AI recommendations" ON public.ai_optimization_recommendations
FOR SELECT USING (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own AI recommendations" ON public.ai_optimization_recommendations
FOR UPDATE USING (auth.role() = 'authenticated' AND auth.uid() = user_id)
WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert their own AI recommendations" ON public.ai_optimization_recommendations
FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Para optimization_results - apenas authenticated users
DROP POLICY IF EXISTS "Users can view their own optimization results" ON public.optimization_results;
DROP POLICY IF EXISTS "Users can insert their own optimization results" ON public.optimization_results;

CREATE POLICY "Authenticated users can view their own optimization results" ON public.optimization_results
FOR SELECT USING (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert their own optimization results" ON public.optimization_results
FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Para real_time_metrics - apenas authenticated users
DROP POLICY IF EXISTS "Users can view their own metrics" ON public.real_time_metrics;
DROP POLICY IF EXISTS "Users can insert their own metrics" ON public.real_time_metrics;

CREATE POLICY "Authenticated users can view their own metrics" ON public.real_time_metrics
FOR SELECT USING (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert their own metrics" ON public.real_time_metrics
FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Para user_behavior_patterns - apenas authenticated users
DROP POLICY IF EXISTS "Users can view their own behavior patterns" ON public.user_behavior_patterns;
DROP POLICY IF EXISTS "Users can insert their own behavior patterns" ON public.user_behavior_patterns;
DROP POLICY IF EXISTS "Users can update their own behavior patterns" ON public.user_behavior_patterns;

CREATE POLICY "Authenticated users can view their own behavior patterns" ON public.user_behavior_patterns
FOR SELECT USING (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert their own behavior patterns" ON public.user_behavior_patterns
FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own behavior patterns" ON public.user_behavior_patterns
FOR UPDATE USING (auth.role() = 'authenticated' AND auth.uid() = user_id)
WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- 3. Criar tabela para logs de segurança e auditoria
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,
  severity text CHECK (severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  created_at timestamp with time zone DEFAULT now()
);

-- RLS para security_audit_logs
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only system can insert security logs" ON public.security_audit_logs
FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Authenticated users can view their own audit logs" ON public.security_audit_logs
FOR SELECT USING (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- 4. Criar tabela para monitoramento de performance em tempo real
CREATE TABLE IF NOT EXISTS public.system_health_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name text NOT NULL,
  metric_name text NOT NULL,
  metric_value numeric NOT NULL,
  metric_unit text DEFAULT 'ms',
  status text CHECK (status IN ('healthy', 'warning', 'critical')) DEFAULT 'healthy',
  metadata jsonb DEFAULT '{}',
  recorded_at timestamp with time zone DEFAULT now()
);

-- RLS para system_health_metrics
ALTER TABLE public.system_health_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only system can manage health metrics" ON public.system_health_metrics
FOR ALL USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 5. Função para log de eventos de segurança
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_event_type text,
  p_event_data jsonb DEFAULT '{}',
  p_severity text DEFAULT 'medium'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  log_id uuid;
BEGIN
  INSERT INTO public.security_audit_logs (
    user_id,
    event_type,
    event_data,
    ip_address,
    user_agent,
    severity
  ) VALUES (
    auth.uid(),
    p_event_type,
    p_event_data,
    inet_client_addr(),
    current_setting('request.headers')::json->>'user-agent',
    p_severity
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

-- 6. Função para registrar métricas de sistema
CREATE OR REPLACE FUNCTION public.record_system_metric(
  p_service_name text,
  p_metric_name text,
  p_metric_value numeric,
  p_metric_unit text DEFAULT 'ms',
  p_status text DEFAULT 'healthy',
  p_metadata jsonb DEFAULT '{}'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  metric_id uuid;
BEGIN
  INSERT INTO public.system_health_metrics (
    service_name,
    metric_name,
    metric_value,
    metric_unit,
    status,
    metadata
  ) VALUES (
    p_service_name,
    p_metric_name,
    p_metric_value,
    p_metric_unit,
    p_status,
    p_metadata
  ) RETURNING id INTO metric_id;
  
  RETURN metric_id;
END;
$$;

-- 7. Triggers para auditoria automática
CREATE OR REPLACE FUNCTION public.audit_funnel_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.log_security_event(
    'funnel_' || lower(TG_OP),
    jsonb_build_object(
      'funnel_id', COALESCE(NEW.id, OLD.id),
      'table_name', TG_TABLE_NAME,
      'operation', TG_OP
    ),
    'low'
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Aplicar triggers de auditoria
CREATE TRIGGER audit_funnels_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.funnels
  FOR EACH ROW EXECUTE FUNCTION public.audit_funnel_changes();

CREATE TRIGGER audit_funnel_pages_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.funnel_pages
  FOR EACH ROW EXECUTE FUNCTION public.audit_funnel_changes();