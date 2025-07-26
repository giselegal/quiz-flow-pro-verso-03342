-- ✅ FASE 1 - CORREÇÕES DE SEGURANÇA CRÍTICAS
-- Corrigir políticas RLS para permitir apenas usuários autenticados

-- Atualizar políticas da tabela funnels para authenticated users apenas
DROP POLICY IF EXISTS "Usuários podem ler seus próprios funnels" ON public.funnels;
CREATE POLICY "Usuários autenticados podem ler seus próprios funnels" 
ON public.funnels 
FOR SELECT 
USING (auth.uid() = user_id AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios funnels" ON public.funnels;
CREATE POLICY "Usuários autenticados podem atualizar seus próprios funnels" 
ON public.funnels 
FOR UPDATE 
USING (auth.uid() = user_id AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Usuários podem deletar seus próprios funnels" ON public.funnels;
CREATE POLICY "Usuários autenticados podem deletar seus próprios funnels" 
ON public.funnels 
FOR DELETE 
USING (auth.uid() = user_id AND auth.role() = 'authenticated');

-- Adicionar política de INSERT para usuários autenticados
CREATE POLICY "Usuários autenticados podem criar funnels" 
ON public.funnels 
FOR INSERT 
WITH CHECK (auth.uid() = user_id AND auth.role() = 'authenticated');

-- Atualizar políticas da tabela funnel_pages para authenticated users apenas
DROP POLICY IF EXISTS "Usuários podem ler páginas de seus funnels" ON public.funnel_pages;
CREATE POLICY "Usuários autenticados podem ler páginas de seus funnels" 
ON public.funnel_pages 
FOR SELECT 
USING (
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM public.funnels 
    WHERE funnels.id = funnel_pages.funnel_id 
    AND funnels.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Usuários podem atualizar páginas em seus funnels" ON public.funnel_pages;
CREATE POLICY "Usuários autenticados podem atualizar páginas em seus funnels" 
ON public.funnel_pages 
FOR UPDATE 
USING (
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM public.funnels 
    WHERE funnels.id = funnel_pages.funnel_id 
    AND funnels.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Usuários podem deletar páginas em seus funnels" ON public.funnel_pages;
CREATE POLICY "Usuários autenticados podem deletar páginas em seus funnels" 
ON public.funnel_pages 
FOR DELETE 
USING (
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM public.funnels 
    WHERE funnels.id = funnel_pages.funnel_id 
    AND funnels.user_id = auth.uid()
  )
);

-- Adicionar política de INSERT para páginas
CREATE POLICY "Usuários autenticados podem criar páginas em seus funnels" 
ON public.funnel_pages 
FOR INSERT 
WITH CHECK (
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM public.funnels 
    WHERE funnels.id = funnel_pages.funnel_id 
    AND funnels.user_id = auth.uid()
  )
);