-- =============================================================================
-- SCHEMA DO BANCO DE DADOS SUPABASE
-- Sistema de Quiz Quest Challenge Verse
-- =============================================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- TABELA DE PERFIS (extensão de auth.users)
-- =============================================================================

CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para perfis
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);

-- RLS para perfis
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas para perfis
CREATE POLICY "Usuários podem ver todos os perfis públicos"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seu próprio perfil"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =============================================================================
-- TABELA DE QUIZZES
-- =============================================================================

CREATE TABLE quizzes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  author_id UUID REFERENCES profiles(id) NOT NULL,
  category TEXT NOT NULL DEFAULT 'geral',
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  time_limit INTEGER, -- em segundos
  is_public BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  is_template BOOLEAN DEFAULT false,
  thumbnail_url TEXT,
  tags TEXT[] DEFAULT '{}',
  settings JSONB DEFAULT '{
    "allowRetake": true,
    "showResults": true,
    "shuffleQuestions": false,
    "showProgressBar": true,
    "passingScore": 60
  }'::jsonb,
  view_count INTEGER DEFAULT 0,
  completion_count INTEGER DEFAULT 0,
  version INTEGER DEFAULT 1,
  slug TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para quizzes
CREATE INDEX idx_quizzes_author_id ON quizzes(author_id);
CREATE INDEX idx_quizzes_category ON quizzes(category);
CREATE INDEX idx_quizzes_is_published ON quizzes(is_published);
CREATE INDEX idx_quizzes_is_public ON quizzes(is_public);
CREATE INDEX idx_quizzes_tags ON quizzes USING GIN(tags);
CREATE INDEX idx_quizzes_created_at ON quizzes(created_at);
CREATE INDEX idx_quizzes_updated_at ON quizzes(updated_at);

-- RLS para quizzes
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

-- Políticas para quizzes
CREATE POLICY "Autores podem ver seus próprios quizzes"
  ON quizzes FOR SELECT
  USING (auth.uid() = author_id);

CREATE POLICY "Todos podem ver quizzes públicos"
  ON quizzes FOR SELECT
  USING (is_public = true);

CREATE POLICY "Autores podem criar quizzes"
  ON quizzes FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Autores podem atualizar seus próprios quizzes"
  ON quizzes FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Autores podem deletar seus próprios quizzes"
  ON quizzes FOR DELETE
  USING (auth.uid() = author_id);

-- =============================================================================
-- TABELA DE PERGUNTAS
-- =============================================================================

CREATE TABLE questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN (
    'multiple_choice', 'multiple_answer', 'true_false', 
    'text', 'ordering', 'matching', 'scale', 'dropdown'
  )),
  options JSONB DEFAULT '[]'::jsonb,
  correct_answers JSONB NOT NULL,
  points INTEGER DEFAULT 1,
  time_limit INTEGER, -- em segundos
  required BOOLEAN DEFAULT true,
  explanation TEXT,
  hint TEXT,
  media_url TEXT,
  media_type TEXT CHECK (media_type IN ('image', 'video', 'audio')),
  order_index INTEGER NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para perguntas
CREATE INDEX idx_questions_quiz_id ON questions(quiz_id);
CREATE INDEX idx_questions_order_index ON questions(quiz_id, order_index);
CREATE INDEX idx_questions_question_type ON questions(question_type);

-- RLS para perguntas
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Políticas para perguntas
CREATE POLICY "Autores podem ver perguntas de seus quizzes"
  ON questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM quizzes 
      WHERE quizzes.id = questions.quiz_id 
      AND quizzes.author_id = auth.uid()
    )
  );

CREATE POLICY "Todos podem ver perguntas de quizzes públicos"
  ON questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM quizzes 
      WHERE quizzes.id = questions.quiz_id 
      AND quizzes.is_public = true
    )
  );

CREATE POLICY "Autores podem inserir perguntas em seus quizzes"
  ON questions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quizzes 
      WHERE quizzes.id = questions.quiz_id 
      AND quizzes.author_id = auth.uid()
    )
  );

CREATE POLICY "Autores podem atualizar perguntas de seus quizzes"
  ON questions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM quizzes 
      WHERE quizzes.id = questions.quiz_id 
      AND quizzes.author_id = auth.uid()
    )
  );

CREATE POLICY "Autores podem deletar perguntas de seus quizzes"
  ON questions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM quizzes 
      WHERE quizzes.id = questions.quiz_id 
      AND quizzes.author_id = auth.uid()
    )
  );

-- =============================================================================
-- TABELA DE TENTATIVAS DE QUIZ
-- =============================================================================

CREATE TABLE quiz_attempts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id),
  participant_email TEXT,
  participant_name TEXT,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  score NUMERIC,
  total_points INTEGER,
  time_taken INTEGER, -- em segundos
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Índices para tentativas
CREATE INDEX idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_status ON quiz_attempts(status);
CREATE INDEX idx_quiz_attempts_completed_at ON quiz_attempts(completed_at);

-- RLS para tentativas
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Políticas para tentativas
CREATE POLICY "Usuários podem ver suas próprias tentativas"
  ON quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Autores podem ver tentativas de seus quizzes"
  ON quiz_attempts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM quizzes 
      WHERE quizzes.id = quiz_attempts.quiz_id 
      AND quizzes.author_id = auth.uid()
    )
  );

CREATE POLICY "Todos podem inserir tentativas"
  ON quiz_attempts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Usuários podem atualizar suas próprias tentativas"
  ON quiz_attempts FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);

-- =============================================================================
-- TABELA DE RESPOSTAS DE PERGUNTAS
-- =============================================================================

CREATE TABLE question_responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  attempt_id UUID REFERENCES quiz_attempts(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE NOT NULL,
  answer JSONB NOT NULL,
  is_correct BOOLEAN,
  points_earned INTEGER DEFAULT 0,
  time_spent INTEGER, -- em segundos
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para respostas
CREATE INDEX idx_question_responses_attempt_id ON question_responses(attempt_id);
CREATE INDEX idx_question_responses_question_id ON question_responses(question_id);
CREATE UNIQUE INDEX idx_question_responses_unique ON question_responses(attempt_id, question_id);

-- RLS para respostas
ALTER TABLE question_responses ENABLE ROW LEVEL SECURITY;

-- Políticas para respostas
CREATE POLICY "Usuários podem ver suas próprias respostas"
  ON question_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM quiz_attempts 
      WHERE quiz_attempts.id = question_responses.attempt_id 
      AND quiz_attempts.user_id = auth.uid()
    )
  );

CREATE POLICY "Autores podem ver respostas de seus quizzes"
  ON question_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM quiz_attempts qa
      JOIN quizzes q ON q.id = qa.quiz_id
      WHERE qa.id = question_responses.attempt_id 
      AND q.author_id = auth.uid()
    )
  );

CREATE POLICY "Todos podem inserir respostas"
  ON question_responses FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Usuários podem atualizar suas próprias respostas"
  ON question_responses FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM quiz_attempts 
      WHERE quiz_attempts.id = question_responses.attempt_id 
      AND (quiz_attempts.user_id = auth.uid() OR quiz_attempts.user_id IS NULL)
    )
  );

-- =============================================================================
-- TABELA DE TEMPLATES DE QUIZ
-- =============================================================================

CREATE TABLE quiz_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  template_data JSONB NOT NULL,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id),
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para templates
CREATE INDEX idx_quiz_templates_category ON quiz_templates(category);
CREATE INDEX idx_quiz_templates_is_public ON quiz_templates(is_public);
CREATE INDEX idx_quiz_templates_created_by ON quiz_templates(created_by);

-- RLS para templates
ALTER TABLE quiz_templates ENABLE ROW LEVEL SECURITY;

-- Políticas para templates
CREATE POLICY "Todos podem ver templates públicos"
  ON quiz_templates FOR SELECT
  USING (is_public = true);

CREATE POLICY "Criadores podem ver seus próprios templates"
  ON quiz_templates FOR SELECT
  USING (created_by = auth.uid());

-- =============================================================================
-- TABELA DE CATEGORIAS DE QUIZ
-- =============================================================================

CREATE TABLE quiz_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir categorias padrão
INSERT INTO quiz_categories (name, description, icon, color) VALUES
('geral', 'Conhecimentos gerais', '🧠', '#3B82F6'),
('educacao', 'Educação e ensino', '📚', '#10B981'),
('entretenimento', 'Entretenimento e diversão', '🎭', '#8B5CF6'),
('business', 'Negócios e carreira', '💼', '#EF4444'),
('tecnologia', 'Tecnologia e inovação', '💻', '#06B6D4'),
('saude', 'Saúde e bem-estar', '❤️', '#EC4899'),
('esportes', 'Esportes e fitness', '⚽', '#F59E0B'),
('historia', 'História e cultura', '🏛️', '#6366F1'),
('ciencia', 'Ciência e natureza', '🔬', '#14B8A6'),
('arte', 'Arte e criatividade', '🎨', '#F97316');

-- RLS para categorias (apenas leitura)
ALTER TABLE quiz_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ver categorias ativas"
  ON quiz_categories FOR SELECT
  USING (is_active = true);

-- =============================================================================
-- TABELA DE TAGS DE QUIZ
-- =============================================================================

CREATE TABLE quiz_tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para tags (apenas leitura)
ALTER TABLE quiz_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos podem ver tags"
  ON quiz_tags FOR SELECT
  USING (true);

-- =============================================================================
-- TABELA DE ANALYTICS DE QUIZ
-- =============================================================================

CREATE TABLE quiz_analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'view', 'start', 'complete', 'abandon', 'share'
  )),
  user_id UUID REFERENCES profiles(id),
  session_id TEXT,
  user_agent TEXT,
  ip_address INET,
  country TEXT,
  city TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para analytics
CREATE INDEX idx_quiz_analytics_quiz_id ON quiz_analytics(quiz_id);
CREATE INDEX idx_quiz_analytics_event_type ON quiz_analytics(event_type);
CREATE INDEX idx_quiz_analytics_created_at ON quiz_analytics(created_at);
CREATE INDEX idx_quiz_analytics_user_id ON quiz_analytics(user_id);

-- RLS para analytics
ALTER TABLE quiz_analytics ENABLE ROW LEVEL SECURITY;

-- Políticas para analytics
CREATE POLICY "Autores podem ver analytics de seus quizzes"
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

-- =============================================================================
-- STORAGE BUCKETS
-- =============================================================================

-- Bucket para imagens de quiz
INSERT INTO storage.buckets (id, name, public) VALUES 
('quiz-images', 'quiz-images', true);

-- Bucket para vídeos de quiz
INSERT INTO storage.buckets (id, name, public) VALUES 
('quiz-videos', 'quiz-videos', true);

-- Bucket para áudios de quiz
INSERT INTO storage.buckets (id, name, public) VALUES 
('quiz-audio', 'quiz-audio', true);

-- Bucket para avatars de perfil
INSERT INTO storage.buckets (id, name, public) VALUES 
('profile-avatars', 'profile-avatars', true);

-- Bucket para templates
INSERT INTO storage.buckets (id, name, public) VALUES 
('templates', 'templates', true);

-- =============================================================================
-- POLÍTICAS DE STORAGE
-- =============================================================================

-- Políticas para quiz-images
CREATE POLICY "Todos podem ver imagens de quiz"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'quiz-images');

CREATE POLICY "Usuários autenticados podem fazer upload de imagens"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'quiz-images' AND auth.role() = 'authenticated');

CREATE POLICY "Usuários podem deletar suas próprias imagens"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'quiz-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Políticas para profile-avatars
CREATE POLICY "Todos podem ver avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-avatars');

CREATE POLICY "Usuários podem fazer upload de seus avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'profile-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Usuários podem deletar seus próprios avatars"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'profile-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- =============================================================================
-- FUNÇÕES E TRIGGERS
-- =============================================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quizzes_updated_at
    BEFORE UPDATE ON quizzes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quiz_templates_updated_at
    BEFORE UPDATE ON quiz_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil quando usuário se registra
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para incrementar view_count
CREATE OR REPLACE FUNCTION increment_quiz_views(quiz_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE quizzes 
  SET view_count = view_count + 1 
  WHERE id = quiz_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para incrementar completion_count
CREATE OR REPLACE FUNCTION increment_quiz_completions(quiz_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE quizzes 
  SET completion_count = completion_count + 1 
  WHERE id = quiz_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- VIEWS ÚTEIS
-- =============================================================================

-- View para estatísticas de quiz
CREATE VIEW quiz_stats AS
SELECT 
  q.id,
  q.title,
  q.author_id,
  q.view_count,
  q.completion_count,
  COUNT(qa.id) as total_attempts,
  COUNT(qa.id) FILTER (WHERE qa.status = 'completed') as completed_attempts,
  AVG(qa.score) FILTER (WHERE qa.status = 'completed') as average_score,
  AVG(qa.time_taken) FILTER (WHERE qa.status = 'completed') as average_time
FROM quizzes q
LEFT JOIN quiz_attempts qa ON q.id = qa.quiz_id
GROUP BY q.id, q.title, q.author_id, q.view_count, q.completion_count;

-- View para ranking de usuários
CREATE VIEW user_rankings AS
SELECT 
  p.id,
  p.full_name,
  p.email,
  COUNT(q.id) as total_quizzes,
  SUM(q.view_count) as total_views,
  SUM(q.completion_count) as total_completions
FROM profiles p
LEFT JOIN quizzes q ON p.id = q.author_id
WHERE q.is_published = true
GROUP BY p.id, p.full_name, p.email
ORDER BY total_views DESC;

-- =============================================================================
-- COMENTÁRIOS FINAIS
-- =============================================================================

COMMENT ON TABLE profiles IS 'Perfis de usuários estendidos da tabela auth.users';
COMMENT ON TABLE quizzes IS 'Tabela principal de quizzes';
COMMENT ON TABLE questions IS 'Perguntas dos quizzes com suporte a vários tipos';
COMMENT ON TABLE quiz_attempts IS 'Tentativas de resolução de quiz pelos usuários';
COMMENT ON TABLE question_responses IS 'Respostas individuais das perguntas';
COMMENT ON TABLE quiz_analytics IS 'Analytics e métricas dos quizzes';
