-- =============================================================================
-- ESQUEMA COMPLETO PARA SISTEMA DE QUIZ COM SUPABASE
-- Editor de Quiz Quest Challenge Verse
-- =============================================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- 1. TABELA DE PERFIS (Extensão do auth.users)
-- =============================================================================

CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 2. TABELA DE QUIZZES
-- =============================================================================

CREATE TABLE quizzes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category TEXT DEFAULT 'general',
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  time_limit INTEGER, -- em segundos
  is_public BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  is_template BOOLEAN DEFAULT false,
  thumbnail_url TEXT,
  tags TEXT[] DEFAULT '{}',
  
  -- Configurações do quiz
  settings JSONB DEFAULT '{
    "allowRetake": true,
    "showResults": true,
    "shuffleQuestions": false,
    "showProgressBar": true,
    "passingScore": 70
  }'::jsonb,
  
  -- Estatísticas
  view_count INTEGER DEFAULT 0,
  completion_count INTEGER DEFAULT 0,
  
  -- Metadados
  version INTEGER DEFAULT 1,
  slug TEXT UNIQUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 3. TABELA DE PERGUNTAS
-- =============================================================================

CREATE TABLE questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  
  -- Conteúdo da pergunta
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN (
    'multiple_choice', 
    'multiple_answer', 
    'true_false', 
    'text', 
    'ordering', 
    'matching',
    'scale',
    'dropdown'
  )),
  
  -- Opções e respostas
  options JSONB DEFAULT '[]'::jsonb,
  correct_answers JSONB NOT NULL,
  
  -- Configurações
  points INTEGER DEFAULT 1,
  time_limit INTEGER, -- tempo limite específico da pergunta
  required BOOLEAN DEFAULT true,
  explanation TEXT,
  hint TEXT,
  
  -- Mídia
  media_url TEXT,
  media_type TEXT CHECK (media_type IN ('image', 'video', 'audio')),
  
  -- Ordem e metadados
  order_index INTEGER NOT NULL,
  tags TEXT[] DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 4. TABELA DE TENTATIVAS DE QUIZ
-- =============================================================================

CREATE TABLE quiz_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Dados da tentativa
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  score NUMERIC(5,2),
  max_score NUMERIC(5,2),
  percentage_score NUMERIC(5,2),
  time_taken INTEGER, -- em segundos
  
  -- Status
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  passed BOOLEAN,
  
  -- Metadados
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  user_agent TEXT,
  ip_address INET
);

-- =============================================================================
-- 5. TABELA DE RESPOSTAS INDIVIDUAIS
-- =============================================================================

CREATE TABLE question_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  attempt_id UUID REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  
  -- Resposta
  answer_data JSONB NOT NULL,
  is_correct BOOLEAN,
  points_earned NUMERIC(5,2) DEFAULT 0,
  time_taken INTEGER, -- tempo para responder esta pergunta
  
  -- Metadados
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 6. TABELA DE TEMPLATES DE QUIZ
-- =============================================================================

CREATE TABLE quiz_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  template_data JSONB NOT NULL,
  thumbnail_url TEXT,
  is_official BOOLEAN DEFAULT false,
  creator_id UUID REFERENCES profiles(id),
  
  -- Estatísticas
  usage_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 7. TABELA DE CATEGORIAS
-- =============================================================================

CREATE TABLE quiz_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
  icon TEXT,
  parent_id UUID REFERENCES quiz_categories(id),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 8. TABELA DE TAGS
-- =============================================================================

CREATE TABLE quiz_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#6B7280',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 9. TABELA DE ANALYTICS
-- =============================================================================

CREATE TABLE quiz_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  
  -- Métricas
  event_type TEXT NOT NULL CHECK (event_type IN (
    'view', 'start', 'complete', 'abandon', 'question_answered'
  )),
  
  -- Dados do evento
  user_id UUID REFERENCES profiles(id),
  session_id TEXT,
  question_id UUID REFERENCES questions(id),
  
  -- Contexto
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  
  -- Dados adicionais
  event_data JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- 10. TABELA DE COMENTÁRIOS E FEEDBACK
-- =============================================================================

CREATE TABLE quiz_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  
  -- Feedback
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_public BOOLEAN DEFAULT true,
  
  -- Moderação
  is_approved BOOLEAN DEFAULT true,
  moderated_by UUID REFERENCES profiles(id),
  moderated_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- ÍNDICES PARA PERFORMANCE
-- =============================================================================

-- Índices para quizzes
CREATE INDEX idx_quizzes_author_id ON quizzes(author_id);
CREATE INDEX idx_quizzes_category ON quizzes(category);
CREATE INDEX idx_quizzes_published ON quizzes(is_published) WHERE is_published = true;
CREATE INDEX idx_quizzes_public ON quizzes(is_public) WHERE is_public = true;
CREATE INDEX idx_quizzes_slug ON quizzes(slug) WHERE slug IS NOT NULL;

-- Índices para perguntas
CREATE INDEX idx_questions_quiz_id ON questions(quiz_id);
CREATE INDEX idx_questions_order ON questions(quiz_id, order_index);
CREATE INDEX idx_questions_type ON questions(question_type);

-- Índices para tentativas
CREATE INDEX idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_status ON quiz_attempts(status);
CREATE INDEX idx_quiz_attempts_completed ON quiz_attempts(completed_at) WHERE completed_at IS NOT NULL;

-- Índices para respostas
CREATE INDEX idx_question_responses_attempt_id ON question_responses(attempt_id);
CREATE INDEX idx_question_responses_question_id ON question_responses(question_id);

-- Índices para analytics
CREATE INDEX idx_quiz_analytics_quiz_id ON quiz_analytics(quiz_id);
CREATE INDEX idx_quiz_analytics_event_type ON quiz_analytics(event_type);
CREATE INDEX idx_quiz_analytics_created_at ON quiz_analytics(created_at);
CREATE INDEX idx_quiz_analytics_user_id ON quiz_analytics(user_id) WHERE user_id IS NOT NULL;

-- =============================================================================
-- ÍNDICES PARA COMPONENTES REUTILIZÁVEIS
-- =============================================================================

-- Índices para component_types
CREATE INDEX idx_component_types_category ON component_types(category);
CREATE INDEX idx_component_types_system ON component_types(is_system) WHERE is_system = true;

-- Índices para component_instances  
CREATE INDEX idx_component_instances_quiz_id ON component_instances(quiz_id);
CREATE INDEX idx_component_instances_quiz_step ON component_instances(quiz_id, step_number);
CREATE INDEX idx_component_instances_type ON component_instances(component_type_key);
CREATE INDEX idx_component_instances_active ON component_instances(is_active) WHERE is_active = true;
CREATE INDEX idx_component_instances_order ON component_instances(quiz_id, step_number, order_index);

-- Índices para component_presets
CREATE INDEX idx_component_presets_type ON component_presets(component_type_key);
CREATE INDEX idx_component_presets_official ON component_presets(is_official) WHERE is_official = true;
CREATE INDEX idx_component_presets_creator ON component_presets(created_by);
CREATE INDEX idx_component_presets_usage ON component_presets(usage_count DESC);

-- 🎯 ÍNDICES PARA COMPONENTES REUTILIZÁVEIS
-- Índices para component_types
CREATE INDEX idx_component_types_category ON component_types(category);
CREATE INDEX idx_component_types_system ON component_types(is_system);

-- Índices para component_instances
CREATE INDEX idx_component_instances_quiz_id ON component_instances(quiz_id);
CREATE INDEX idx_component_instances_type ON component_instances(component_type_key);
CREATE INDEX idx_component_instances_step ON component_instances(quiz_id, step_number);
CREATE INDEX idx_component_instances_order ON component_instances(quiz_id, step_number, order_index);
CREATE INDEX idx_component_instances_instance_key ON component_instances(quiz_id, instance_key);
CREATE INDEX idx_component_instances_active ON component_instances(is_active) WHERE is_active = true;

-- Índices para component_presets
CREATE INDEX idx_component_presets_type ON component_presets(component_type_key);
CREATE INDEX idx_component_presets_category ON component_presets(category);
CREATE INDEX idx_component_presets_official ON component_presets(is_official) WHERE is_official = true;
CREATE INDEX idx_component_presets_creator ON component_presets(created_by);

-- =============================================================================
-- TRIGGERS PARA CAMPOS UPDATED_AT
-- =============================================================================

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para tabelas com updated_at
CREATE TRIGGER set_timestamp_profiles
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_quizzes
  BEFORE UPDATE ON quizzes
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_quiz_templates
  BEFORE UPDATE ON quiz_templates
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

-- Triggers para componentes
CREATE TRIGGER set_timestamp_component_types
  BEFORE UPDATE ON component_types
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_component_instances
  BEFORE UPDATE ON component_instances
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

-- 🎯 TRIGGERS PARA COMPONENTES REUTILIZÁVEIS
CREATE TRIGGER set_timestamp_component_types
  BEFORE UPDATE ON component_types
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_component_instances
  BEFORE UPDATE ON component_instances
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

-- =============================================================================
-- FUNÇÕES UTILITÁRIAS
-- =============================================================================

-- Função para gerar slug único
CREATE OR REPLACE FUNCTION generate_quiz_slug(quiz_title TEXT, quiz_id UUID)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Criar slug base
  base_slug := lower(regexp_replace(quiz_title, '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);
  
  -- Verificar se slug já existe
  final_slug := base_slug;
  
  WHILE EXISTS (SELECT 1 FROM quizzes WHERE slug = final_slug AND id != quiz_id) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Trigger para gerar slug automaticamente
CREATE OR REPLACE FUNCTION auto_generate_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_quiz_slug(NEW.title, NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_generate_slug
  BEFORE INSERT OR UPDATE ON quizzes
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_slug();

-- =============================================================================
-- POLÍTICAS DE SEGURANÇA (RLS)
-- =============================================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE component_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE component_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE component_presets ENABLE ROW LEVEL SECURITY;

-- 🎯 RLS para tabelas de componentes
ALTER TABLE component_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE component_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE component_presets ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Usuários podem ver todos os perfis públicos"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Políticas para quizzes
CREATE POLICY "Qualquer um pode ver quizzes públicos"
  ON quizzes FOR SELECT
  USING (is_public = true OR author_id = auth.uid());

CREATE POLICY "Usuários autenticados podem criar quizzes"
  ON quizzes FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Autores podem atualizar seus quizzes"
  ON quizzes FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Autores podem deletar seus quizzes"
  ON quizzes FOR DELETE
  USING (auth.uid() = author_id);

-- Políticas para questions
CREATE POLICY "Usuários podem ver perguntas de quizzes acessíveis"
  ON questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM quizzes 
      WHERE quizzes.id = questions.quiz_id 
      AND (quizzes.is_public = true OR quizzes.author_id = auth.uid())
    )
  );

CREATE POLICY "Autores podem gerenciar perguntas de seus quizzes"
  ON questions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM quizzes 
      WHERE quizzes.id = questions.quiz_id 
      AND quizzes.author_id = auth.uid()
    )
  );

-- Políticas para quiz_attempts
CREATE POLICY "Usuários podem ver suas próprias tentativas"
  ON quiz_attempts FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Usuários autenticados podem criar tentativas"
  ON quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas tentativas em progresso"
  ON quiz_attempts FOR UPDATE
  USING (user_id = auth.uid() AND status = 'in_progress');

-- Políticas para question_responses
CREATE POLICY "Usuários podem ver respostas de suas tentativas"
  ON question_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM quiz_attempts 
      WHERE quiz_attempts.id = question_responses.attempt_id 
      AND quiz_attempts.user_id = auth.uid()
    )
  );

CREATE POLICY "Usuários podem criar respostas para suas tentativas"
  ON question_responses FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quiz_attempts 
      WHERE quiz_attempts.id = question_responses.attempt_id 
      AND quiz_attempts.user_id = auth.uid()
    )
  );

-- Políticas para templates (todos podem ver templates oficiais)
CREATE POLICY "Qualquer um pode ver templates oficiais"
  ON quiz_templates FOR SELECT
  USING (is_official = true OR creator_id = auth.uid());

CREATE POLICY "Usuários autenticados podem criar templates"
  ON quiz_templates FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

-- Políticas para categorias e tags (leitura pública)
CREATE POLICY "Qualquer um pode ver categorias"
  ON quiz_categories FOR SELECT
  USING (true);

CREATE POLICY "Qualquer um pode ver tags"
  ON quiz_tags FOR SELECT
  USING (true);

-- Políticas para analytics
CREATE POLICY "Proprietários podem ver analytics de seus quizzes"
  ON quiz_analytics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM quizzes 
      WHERE quizzes.id = quiz_analytics.quiz_id 
      AND quizzes.author_id = auth.uid()
    )
  );

CREATE POLICY "Sistema pode inserir analytics"
  ON quiz_analytics FOR INSERT
  WITH CHECK (true);

-- Políticas para feedback
CREATE POLICY "Qualquer um pode ver feedback público"
  ON quiz_feedback FOR SELECT
  USING (is_public = true AND is_approved = true);

CREATE POLICY "Usuários autenticados podem criar feedback"
  ON quiz_feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- POLÍTICAS PARA COMPONENTES REUTILIZÁVEIS
-- =============================================================================

-- Políticas para component_types (todos podem ver, apenas admins criam)
CREATE POLICY "Qualquer um pode ver tipos de componentes"
  ON component_types FOR SELECT
  USING (true);

CREATE POLICY "Apenas sistema pode gerenciar tipos de componentes"
  ON component_types FOR ALL
  USING (is_system = true);

-- Políticas para component_instances
CREATE POLICY "Usuários podem ver instâncias de seus quizzes"
  ON component_instances FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM quizzes 
      WHERE quizzes.id = component_instances.quiz_id 
      AND (quizzes.is_public = true OR quizzes.author_id = auth.uid())
    )
  );

CREATE POLICY "Autores podem gerenciar instâncias de seus quizzes"
  ON component_instances FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM quizzes 
      WHERE quizzes.id = component_instances.quiz_id 
      AND quizzes.author_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quizzes 
      WHERE quizzes.id = component_instances.quiz_id 
      AND quizzes.author_id = auth.uid()
    )
  );

-- Políticas para component_presets
CREATE POLICY "Qualquer um pode ver presets oficiais"
  ON component_presets FOR SELECT
  USING (is_official = true OR created_by = auth.uid());

CREATE POLICY "Usuários autenticados podem criar presets"
  ON component_presets FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Criadores podem atualizar seus presets"
  ON component_presets FOR UPDATE
  USING (created_by = auth.uid());

-- =============================================================================
-- 🎯 POLÍTICAS PARA COMPONENTES REUTILIZÁVEIS
-- =============================================================================

-- Políticas para component_types (tipos de componentes)
CREATE POLICY "Qualquer um pode ver tipos de componentes"
  ON component_types FOR SELECT
  USING (true);

CREATE POLICY "Apenas admins podem gerenciar tipos de componentes do sistema"
  ON component_types FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Políticas para component_instances (instâncias de componentes)
CREATE POLICY "Usuários podem ver instâncias de componentes de quizzes acessíveis"
  ON component_instances FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM quizzes 
      WHERE quizzes.id = component_instances.quiz_id 
      AND (quizzes.is_public = true OR quizzes.author_id = auth.uid())
    )
  );

CREATE POLICY "Autores podem gerenciar instâncias de componentes de seus quizzes"
  ON component_instances FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM quizzes 
      WHERE quizzes.id = component_instances.quiz_id 
      AND quizzes.author_id = auth.uid()
    )
  );

-- Políticas para component_presets (presets de componentes)
CREATE POLICY "Qualquer um pode ver presets oficiais"
  ON component_presets FOR SELECT
  USING (is_official = true OR created_by = auth.uid());

CREATE POLICY "Usuários autenticados podem criar presets"
  ON component_presets FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Criadores podem atualizar seus presets"
  ON component_presets FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Criadores podem deletar seus presets"
  ON component_presets FOR DELETE
  USING (auth.uid() = created_by);

-- =============================================================================
-- 11. SISTEMA DE COMPONENTES REUTILIZÁVEIS
-- =============================================================================

-- Tabela de tipos de componentes (padrão do sistema)
CREATE TABLE component_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type_key TEXT NOT NULL UNIQUE, -- ex: 'quiz-header', 'question-title', 'options-grid'
  display_name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'layout', 'question', 'navigation', 'media', 'form'
  icon TEXT,
  is_system BOOLEAN DEFAULT true, -- componente do sistema ou customizado
  default_properties JSONB DEFAULT '{}'::jsonb,
  validation_schema JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de instâncias de componentes (usados em etapas específicas)
CREATE TABLE component_instances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  instance_key TEXT NOT NULL, -- ID semântico reutilizável gerado automaticamente
  component_type_key TEXT NOT NULL REFERENCES component_types(type_key),
  
  -- Contexto de uso
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 1,
  
  -- Propriedades específicas desta instância
  properties JSONB NOT NULL DEFAULT '{}'::jsonb,
  custom_styling JSONB DEFAULT '{}'::jsonb,
  
  -- Controle de estado
  is_active BOOLEAN DEFAULT true,
  is_locked BOOLEAN DEFAULT false, -- impede edição
  
  -- Metadados
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Garantir unicidade de instance_key por quiz
  UNIQUE(quiz_id, instance_key)
);

-- Tabela de presets de componentes (templates predefinidos)
CREATE TABLE component_presets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  component_type_key TEXT NOT NULL REFERENCES component_types(type_key),
  preset_name TEXT NOT NULL,
  description TEXT,
  
  -- Dados do preset
  preset_properties JSONB NOT NULL,
  thumbnail_url TEXT,
  
  -- Classificação
  category TEXT DEFAULT 'general',
  tags TEXT[] DEFAULT '{}',
  is_official BOOLEAN DEFAULT false,
  
  -- Estatísticas
  usage_count INTEGER DEFAULT 0,
  
  -- Metadados
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(component_type_key, preset_name)
);

-- =============================================================================
-- 12. FUNÇÕES PARA GERAÇÃO AUTOMÁTICA DE IDs SEMÂNTICOS
-- =============================================================================

-- Função para gerar instance_key semântico automaticamente
CREATE OR REPLACE FUNCTION generate_instance_key(
  p_component_type_key TEXT,
  p_quiz_id UUID,
  p_step_number INTEGER
)
RETURNS TEXT AS $$
DECLARE
  base_key TEXT;
  final_key TEXT;
  counter INTEGER := 1;
BEGIN
  -- Criar chave base baseada no tipo do componente
  base_key := p_component_type_key;
  final_key := base_key;
  
  -- Se já existe, adicionar sufixo numérico
  WHILE EXISTS (
    SELECT 1 FROM component_instances 
    WHERE quiz_id = p_quiz_id 
    AND instance_key = final_key
  ) LOOP
    counter := counter + 1;
    final_key := base_key || '-' || counter;
  END LOOP;
  
  RETURN final_key;
END;
$$ LANGUAGE plpgsql;

-- Trigger para gerar instance_key automaticamente
CREATE OR REPLACE FUNCTION auto_generate_instance_key()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.instance_key IS NULL OR NEW.instance_key = '' THEN
    NEW.instance_key := generate_instance_key(
      NEW.component_type_key,
      NEW.quiz_id,
      NEW.step_number
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_generate_instance_key
  BEFORE INSERT ON component_instances
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_instance_key();

-- =============================================================================
-- 13. VIEWS PARA COMPONENTES REUTILIZÁVEIS
-- =============================================================================

-- View para componentes por etapa
CREATE OR REPLACE VIEW step_components AS
SELECT 
  ci.id,
  ci.instance_key,
  ci.quiz_id,
  ci.step_number,
  ci.order_index,
  ct.type_key as component_type,
  ct.display_name,
  ct.category,
  ci.properties,
  ci.custom_styling,
  ci.is_active,
  ci.created_at,
  ci.updated_at
FROM component_instances ci
JOIN component_types ct ON ci.component_type_key = ct.type_key
ORDER BY ci.step_number, ci.order_index;

-- View para estatísticas de uso de componentes
CREATE OR REPLACE VIEW component_usage_stats AS
SELECT 
  ct.type_key,
  ct.display_name,
  ct.category,
  COUNT(ci.id) as total_instances,
  COUNT(DISTINCT ci.quiz_id) as unique_quizzes,
  COUNT(DISTINCT ci.step_number) as unique_steps
FROM component_types ct
LEFT JOIN component_instances ci ON ct.type_key = ci.component_type_key
GROUP BY ct.type_key, ct.display_name, ct.category;

-- =============================================================================
-- DADOS INICIAIS
-- =============================================================================

-- Inserir tipos de componentes padrão do sistema
INSERT INTO component_types (type_key, display_name, description, category, icon, default_properties) VALUES
  -- LAYOUT E ESTRUTURA
  ('quiz-header', 'Cabeçalho do Quiz', 'Cabeçalho com logo, progresso e navegação', 'layout', 'layout-header', 
   '{"logoUrl": "", "logoWidth": 96, "logoHeight": 96, "showProgress": true, "showBackButton": true}'::jsonb),
  
  -- QUESTÕES E CONTEÚDO
  ('question-title', 'Título da Questão', 'Título principal da questão', 'question', 'type', 
   '{"content": "Título da questão", "level": "h2", "fontSize": "text-2xl", "fontWeight": "font-bold", "textAlign": "text-center"}'::jsonb),
   
  ('question-counter', 'Contador de Questão', 'Indicador de progresso das questões', 'question', 'hash', 
   '{"content": "Questão 1 de 10", "fontSize": "text-sm", "textAlign": "text-center", "color": "#6B7280"}'::jsonb),
   
  ('question-image', 'Imagem da Questão', 'Imagem ilustrativa para a questão', 'media', 'image', 
   '{"src": "", "alt": "Imagem da questão", "width": "auto", "height": "auto", "borderRadius": "rounded-lg"}'::jsonb),
   
  ('options-grid', 'Grid de Opções', 'Grade de opções para seleção', 'question', 'grid-3x3', 
   '{"columns": 2, "showImages": true, "allowMultiple": false, "options": []}'::jsonb),
   
  -- COMPONENTES ESPECIAIS
  ('hero-image', 'Imagem Principal', 'Imagem principal/hero da etapa', 'media', 'image', 
   '{"src": "", "alt": "Imagem principal", "size": "large", "position": "center"}'::jsonb),
   
  ('hero-subtitle', 'Subtítulo Hero', 'Subtítulo da seção hero', 'content', 'text', 
   '{"content": "Subtítulo", "fontSize": "text-xl", "color": "#6B7280"}'::jsonb),
   
  ('hero-description', 'Descrição Hero', 'Descrição da seção hero', 'content', 'align-left', 
   '{"content": "Descrição detalhada", "fontSize": "text-base", "textAlign": "text-center"}'::jsonb),
   
  ('cta-button', 'Botão de Ação', 'Botão call-to-action', 'navigation', 'cursor-pointer', 
   '{"text": "Continuar", "variant": "primary", "size": "lg", "fullWidth": false}'::jsonb),
   
  -- TRANSIÇÕES E PROCESSAMENTO
  ('transition-title', 'Título de Transição', 'Título para etapas de transição', 'content', 'arrow-right', 
   '{"content": "Processando...", "fontSize": "text-3xl", "fontWeight": "font-bold"}'::jsonb),
   
  ('processing-title', 'Título de Processamento', 'Título para tela de processamento', 'content', 'cog', 
   '{"content": "Analisando suas respostas...", "fontSize": "text-2xl", "showSpinner": true}'::jsonb),
   
  -- RESULTADOS E OFERTAS
  ('result-title', 'Título do Resultado', 'Título da tela de resultado', 'content', 'star', 
   '{"content": "Seu Resultado", "fontSize": "text-3xl", "fontWeight": "font-bold"}'::jsonb),
   
  ('result-description', 'Descrição do Resultado', 'Descrição detalhada do resultado', 'content', 'document-text', 
   '{"content": "Descrição do resultado", "fontSize": "text-lg"}'::jsonb),
   
  ('transformation-gallery', 'Galeria de Transformações', 'Galeria de antes/depois', 'media', 'photograph', 
   '{"items": [], "autoplay": true, "showControls": true}'::jsonb),
   
  ('lead-form', 'Formulário de Captura', 'Formulário para captura de leads', 'form', 'mail', 
   '{"fields": ["name", "email"], "submitText": "Enviar", "required": true}'::jsonb),
   
  ('offer-title', 'Título da Oferta', 'Título da oferta comercial', 'content', 'gift', 
   '{"content": "Oferta Especial", "fontSize": "text-3xl", "highlight": true}'::jsonb),
   
  ('offer-description', 'Descrição da Oferta', 'Descrição da oferta comercial', 'content', 'document', 
   '{"content": "Descrição da oferta", "fontSize": "text-lg"}'::jsonb),
   
  ('offer-cta', 'CTA da Oferta', 'Call-to-action da oferta', 'navigation', 'shopping-cart', 
   '{"text": "Comprar Agora", "variant": "primary", "size": "xl", "urgency": true}'::jsonb)
ON CONFLICT (type_key) DO NOTHING;

-- Inserir categorias padrão
INSERT INTO quiz_categories (name, description, color, icon) VALUES
  ('Educação', 'Quizzes educacionais e de aprendizado', '#10B981', 'graduation-cap'),
  ('Entretenimento', 'Quizzes divertidos e de entretenimento', '#F59E0B', 'smile'),
  ('Negócios', 'Quizzes relacionados a negócios e carreira', '#3B82F6', 'briefcase'),
  ('Saúde', 'Quizzes sobre saúde e bem-estar', '#EF4444', 'heart'),
  ('Tecnologia', 'Quizzes sobre tecnologia e inovação', '#8B5CF6', 'cpu'),
  ('Personalidade', 'Testes de personalidade e autoconhecimento', '#EC4899', 'user')
ON CONFLICT (name) DO NOTHING;

-- Inserir tags padrão
INSERT INTO quiz_tags (name, color) VALUES
  ('iniciante', '#10B981'),
  ('avançado', '#EF4444'),
  ('rápido', '#F59E0B'),
  ('detalhado', '#3B82F6'),
  ('interativo', '#8B5CF6'),
  ('educativo', '#10B981')
ON CONFLICT (name) DO NOTHING;

-- =============================================================================
-- VIEWS ÚTEIS
-- =============================================================================

-- View para estatísticas de quiz
CREATE OR REPLACE VIEW quiz_stats AS
SELECT 
  q.id,
  q.title,
  q.author_id,
  COUNT(DISTINCT qa.id) as total_attempts,
  COUNT(DISTINCT CASE WHEN qa.status = 'completed' THEN qa.id END) as completed_attempts,
  ROUND(AVG(CASE WHEN qa.status = 'completed' THEN qa.score END), 2) as avg_score,
  COUNT(DISTINCT qf.id) as feedback_count,
  ROUND(AVG(qf.rating), 2) as avg_rating
FROM quizzes q
LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id
LEFT JOIN quiz_feedback qf ON q.id = qf.quiz_id AND qf.is_approved = true
GROUP BY q.id, q.title, q.author_id;

-- View para leaderboard
CREATE OR REPLACE VIEW quiz_leaderboard AS
SELECT 
  qa.quiz_id,
  p.full_name,
  p.avatar_url,
  qa.score,
  qa.time_taken,
  qa.completed_at,
  RANK() OVER (PARTITION BY qa.quiz_id ORDER BY qa.score DESC, qa.time_taken ASC) as rank
FROM quiz_attempts qa
JOIN profiles p ON qa.user_id = p.id
WHERE qa.status = 'completed';

COMMENT ON TABLE profiles IS 'Perfis dos usuários - extensão da tabela auth.users';
COMMENT ON TABLE quizzes IS 'Quizzes principais do sistema';
COMMENT ON TABLE questions IS 'Perguntas dos quizzes';
COMMENT ON TABLE quiz_attempts IS 'Tentativas de resolução de quizzes';
COMMENT ON TABLE question_responses IS 'Respostas individuais às perguntas';
COMMENT ON TABLE quiz_templates IS 'Templates de quizzes reutilizáveis';
COMMENT ON TABLE quiz_categories IS 'Categorias para organização dos quizzes';
COMMENT ON TABLE quiz_tags IS 'Tags para classificação dos quizzes';
COMMENT ON TABLE quiz_analytics IS 'Dados de analytics e tracking';
COMMENT ON TABLE quiz_feedback IS 'Comentários e avaliações dos quizzes';
