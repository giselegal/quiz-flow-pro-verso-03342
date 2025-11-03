-- Corrigir funções existentes para adicionar search_path seguro
-- (conforme warning do linter)

-- 1. Corrigir update_quiz_updated_at
CREATE OR REPLACE FUNCTION public.update_quiz_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 2. Corrigir update_updated_at_column  
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 3. Corrigir duplicate_quiz_template
CREATE OR REPLACE FUNCTION public.duplicate_quiz_template(
  template_slug text,
  new_name text,
  new_funnel_id text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  template_content JSONB;
  new_draft_id UUID;
BEGIN
  -- Buscar template
  SELECT content INTO template_content
  FROM public.quiz_production
  WHERE slug = template_slug AND is_template = true
  LIMIT 1;

  IF template_content IS NULL THEN
    RAISE EXCEPTION 'Template não encontrado: %', template_slug;
  END IF;

  -- Criar novo draft
  INSERT INTO public.quiz_drafts (user_id, funnel_id, name, slug, content, status)
  VALUES (
    auth.uid(),
    new_funnel_id,
    new_name,
    new_funnel_id,
    template_content,
    'draft'
  )
  RETURNING id INTO new_draft_id;

  RETURN new_draft_id;
END;
$function$;

-- 4. Corrigir publish_quiz_draft
CREATE OR REPLACE FUNCTION public.publish_quiz_draft(draft_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  draft_record RECORD;
  new_version INTEGER;
  production_id UUID;
BEGIN
  -- Buscar draft
  SELECT * INTO draft_record
  FROM public.quiz_drafts
  WHERE id = draft_id AND user_id = auth.uid();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Draft não encontrado ou não pertence ao usuário';
  END IF;

  -- Calcular próxima versão
  SELECT COALESCE(MAX(version), 0) + 1 INTO new_version
  FROM public.quiz_production
  WHERE funnel_id = draft_record.funnel_id;

  -- Criar registro em produção
  INSERT INTO public.quiz_production (
    user_id, draft_id, funnel_id, name, slug, version, content, metadata, status
  )
  VALUES (
    draft_record.user_id,
    draft_id,
    draft_record.funnel_id,
    draft_record.name,
    draft_record.slug,
    new_version,
    draft_record.content,
    draft_record.metadata,
    'published'
  )
  RETURNING id INTO production_id;

  RETURN production_id;
END;
$function$;