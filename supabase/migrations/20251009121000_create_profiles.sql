-- CREATE PROFILES TABLE + RLS (idempotente)
-- Data: 2025-10-09

BEGIN;

-- Criar tabela profiles (se não existir)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY,
  email text,
  full_name text,
  avatar_url text,
  role text CHECK (role IN ('user','admin','moderator')) DEFAULT 'user',
  plan text CHECK (plan IN ('free','pro','enterprise')) DEFAULT 'free',
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Remover políticas genéricas (se existirem com esses nomes)
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_owner_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_owner_update" ON public.profiles;
DROP POLICY IF EXISTS "profiles_owner_insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles_owner_delete" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_select" ON public.profiles;

-- Políticas por dono
CREATE POLICY "profiles_owner_select"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "profiles_owner_update"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "profiles_owner_insert"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- Opcional: admins podem ler tudo (assumindo que você tenha atribuição de role em JWT/claims)
-- Você pode trocar por uma função que verifica um claim personalizado.
-- Exemplo simples: permitir SELECT global para authenticated (remova se não quiser)
-- CREATE POLICY "profiles_admin_select"
--   ON public.profiles FOR SELECT
--   TO authenticated
--   USING (true);

COMMIT;
