-- Correção CRÍTICA de Segurança: Function Search Path
-- Corrigir todas as funções para usar search_path seguro

-- 1. Atualizar função de cleanup com search_path seguro
CREATE OR REPLACE FUNCTION public.cleanup_old_analytics_data()
RETURNS void AS $$
BEGIN
  -- Manter apenas dados dos últimos 90 dias
  DELETE FROM public.quiz_events 
  WHERE timestamp < now() - INTERVAL '90 days';
  
  DELETE FROM public.quiz_sessions 
  WHERE started_at < now() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Atualizar função de cleanup de métricas com search_path seguro
CREATE OR REPLACE FUNCTION public.cleanup_old_metrics()
RETURNS void AS $$
BEGIN
  -- Manter métricas dos últimos 30 dias
  DELETE FROM public.real_time_metrics 
  WHERE recorded_at < now() - INTERVAL '30 days';
  
  -- Manter resultados de otimização dos últimos 90 dias
  DELETE FROM public.optimization_results 
  WHERE created_at < now() - INTERVAL '90 days';
  
  -- Manter padrões comportamentais dos últimos 60 dias
  DELETE FROM public.user_behavior_patterns 
  WHERE created_at < now() - INTERVAL '60 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. Atualizar todas as outras funções com search_path seguro
CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.update_quiz_session_activity()
RETURNS trigger AS $$
BEGIN
  UPDATE public.quiz_sessions 
  SET last_activity = now()
  WHERE id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;