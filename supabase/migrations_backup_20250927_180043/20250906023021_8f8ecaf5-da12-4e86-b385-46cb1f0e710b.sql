-- Implementar restrições RLS ULTRA-RESTRITIVAS para eliminar warnings de segurança
-- Todas as políticas agora exigem auth.uid() IS NOT NULL além de auth.role() = 'authenticated'

-- 1. Corrigir component_instances
DROP POLICY IF EXISTS "Authenticated users can view their component instances" ON public.component_instances;
DROP POLICY IF EXISTS "Authenticated users can update their component instances" ON public.component_instances;
DROP POLICY IF EXISTS "Authenticated users can delete their component instances" ON public.component_instances;

CREATE POLICY "Strictly authenticated users can view their component instances" 
ON public.component_instances FOR SELECT 
USING (auth.role() = 'authenticated' AND auth.uid() IS NOT NULL AND created_by = auth.uid());

CREATE POLICY "Strictly authenticated users can update their component instances" 
ON public.component_instances FOR UPDATE 
USING (auth.role() = 'authenticated' AND auth.uid() IS NOT NULL AND created_by = auth.uid())
WITH CHECK (auth.role() = 'authenticated' AND auth.uid() IS NOT NULL AND created_by = auth.uid());

CREATE POLICY "Strictly authenticated users can delete their component instances" 
ON public.component_instances FOR DELETE 
USING (auth.role() = 'authenticated' AND auth.uid() IS NOT NULL AND created_by = auth.uid());

-- 2. Corrigir component_types
DROP POLICY IF EXISTS "Authenticated users can view component types" ON public.component_types;
DROP POLICY IF EXISTS "Authenticated creators can modify component types" ON public.component_types;

CREATE POLICY "Strictly authenticated users can view component types" 
ON public.component_types FOR SELECT 
USING (auth.role() = 'authenticated' AND auth.uid() IS NOT NULL);

CREATE POLICY "Strictly authenticated creators can modify component types" 
ON public.component_types FOR ALL 
USING (auth.role() = 'authenticated' AND auth.uid() IS NOT NULL AND created_by = auth.uid())
WITH CHECK (auth.role() = 'authenticated' AND auth.uid() IS NOT NULL AND created_by = auth.uid());

-- 3. Corrigir funnel_pages
DROP POLICY IF EXISTS "Usuários autenticados podem ler páginas de seus funnels" ON public.funnel_pages;
DROP POLICY IF EXISTS "Usuários autenticados podem atualizar páginas em seus funnels" ON public.funnel_pages;
DROP POLICY IF EXISTS "Usuários autenticados podem deletar páginas em seus funnels" ON public.funnel_pages;
DROP POLICY IF EXISTS "Usuários autenticados podem criar páginas em seus funnels" ON public.funnel_pages;

CREATE POLICY "Strictly authenticated users can read their funnel pages" 
ON public.funnel_pages FOR SELECT 
USING (
  auth.role() = 'authenticated' AND 
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM funnels f 
    WHERE f.id = funnel_pages.funnel_id 
    AND f.user_id = auth.uid()::text
  )
);

CREATE POLICY "Strictly authenticated users can modify their funnel pages" 
ON public.funnel_pages FOR ALL 
USING (
  auth.role() = 'authenticated' AND 
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM funnels f 
    WHERE f.id = funnel_pages.funnel_id 
    AND f.user_id = auth.uid()::text
  )
)
WITH CHECK (
  auth.role() = 'authenticated' AND 
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM funnels f 
    WHERE f.id = funnel_pages.funnel_id 
    AND f.user_id = auth.uid()::text
  )
);

-- 4. Corrigir funnels
DROP POLICY IF EXISTS "Authenticated users can read their own funnels" ON public.funnels;
DROP POLICY IF EXISTS "Authenticated users can update their own funnels" ON public.funnels;
DROP POLICY IF EXISTS "Authenticated users can delete their own funnels" ON public.funnels;
DROP POLICY IF EXISTS "Authenticated users can create funnels" ON public.funnels;

CREATE POLICY "Strictly authenticated users can manage their own funnels" 
ON public.funnels FOR ALL 
USING (auth.role() = 'authenticated' AND auth.uid() IS NOT NULL AND auth.uid()::text = user_id)
WITH CHECK (auth.role() = 'authenticated' AND auth.uid() IS NOT NULL AND auth.uid()::text = user_id);

-- 5. Corrigir profiles
DROP POLICY IF EXISTS "Authenticated users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can insert their own profile" ON public.profiles;

CREATE POLICY "Strictly authenticated users can manage their own profile" 
ON public.profiles FOR ALL 
USING (auth.role() = 'authenticated' AND auth.uid() IS NOT NULL AND auth.uid() = id)
WITH CHECK (auth.role() = 'authenticated' AND auth.uid() IS NOT NULL AND auth.uid() = id);