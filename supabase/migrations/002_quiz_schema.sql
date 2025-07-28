-- ====================================
-- QUIZ QUEST CHALLENGE - DATABASE SCHEMA
-- ====================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================
-- 1. TABELA DE PERFIS (extensão de auth.users)
-- ====================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================
-- 2. TABELA DE QUIZZES
-- ====================================
CREATE TABLE quizzes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  category TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  time_limit INTEGER, -- em segundos
  is_public BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================
-- 3. TABELA DE QUESTÕES
-- ====================================
CREATE TABLE questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN (
    'multiple_choice', 
    'multiple_answer', 
    'true_false', 
    'text', 
    'ordering', 
    'matching'
  )),
  options JSONB DEFAULT '[]',
  correct_answers JSONB NOT NULL,
  points INTEGER DEFAULT 1,
  explanation TEXT,
  media_url TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================
-- 4. TABELA DE TENTATIVAS DE QUIZ
-- ====================================
CREATE TABLE quiz_attempts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE SET NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  answers JSONB NOT NULL,
  score NUMERIC(5,2),
  time_taken INTEGER, -- em segundos
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================
-- 5. ÍNDICES PARA PERFORMANCE
-- ====================================

-- Índices para quizzes
CREATE INDEX idx_quizzes_author_id ON quizzes(author_id);
CREATE INDEX idx_quizzes_category ON quizzes(category);
CREATE INDEX idx_quizzes_difficulty ON quizzes(difficulty);
CREATE INDEX idx_quizzes_is_public ON quizzes(is_public);
CREATE INDEX idx_quizzes_is_published ON quizzes(is_published);
CREATE INDEX idx_quizzes_created_at ON quizzes(created_at);

-- Índices para questions
CREATE INDEX idx_questions_quiz_id ON questions(quiz_id);
CREATE INDEX idx_questions_order_index ON questions(quiz_id, order_index);
CREATE INDEX idx_questions_type ON questions(question_type);

-- Índices para quiz_attempts
CREATE INDEX idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_completed_at ON quiz_attempts(completed_at);

-- ====================================
-- 6. TRIGGERS PARA UPDATED_AT
-- ====================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualização automática
CREATE TRIGGER set_timestamp_profiles
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_quizzes
  BEFORE UPDATE ON quizzes
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

-- ====================================
-- 7. FUNÇÃO PARA CRIAR PERFIL AUTOMATICAMENTE
-- ====================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil quando usuário se registra
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================
-- 8. ROW LEVEL SECURITY (RLS)
-- ====================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- ====================================
-- 9. POLÍTICAS DE SEGURANÇA
-- ====================================

-- Políticas para profiles
CREATE POLICY "Usuários podem ler todos os perfis públicos"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Políticas para quizzes
CREATE POLICY "Qualquer um pode ler quizzes públicos"
  ON quizzes FOR SELECT
  USING (is_public = true OR auth.uid() = author_id);

CREATE POLICY "Usuários autenticados podem criar quizzes"
  ON quizzes FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Autores podem atualizar seus próprios quizzes"
  ON quizzes FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Autores podem deletar seus próprios quizzes"
  ON quizzes FOR DELETE
  USING (auth.uid() = author_id);

-- Políticas para questions
CREATE POLICY "Usuários podem ler questões de quizzes acessíveis"
  ON questions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM quizzes 
    WHERE quizzes.id = questions.quiz_id 
    AND (quizzes.is_public = true OR quizzes.author_id = auth.uid())
  ));

CREATE POLICY "Autores podem gerenciar questões de seus quizzes"
  ON questions FOR ALL
  USING (EXISTS (
    SELECT 1 FROM quizzes 
    WHERE quizzes.id = questions.quiz_id 
    AND quizzes.author_id = auth.uid()
  ));

-- Políticas para quiz_attempts
CREATE POLICY "Usuários podem ler suas próprias tentativas"
  ON quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar tentativas em quizzes públicos"
  ON quiz_attempts FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM quizzes 
      WHERE quizzes.id = quiz_attempts.quiz_id 
      AND quizzes.is_public = true
    )
  );

CREATE POLICY "Autores podem ver tentativas de seus quizzes"
  ON quiz_attempts FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM quizzes 
    WHERE quizzes.id = quiz_attempts.quiz_id 
    AND quizzes.author_id = auth.uid()
  ));

-- ====================================
-- 10. FUNÇÕES ÚTEIS
-- ====================================

-- Função para calcular estatísticas de um quiz
CREATE OR REPLACE FUNCTION get_quiz_stats(quiz_uuid UUID)
RETURNS JSON AS $$
DECLARE
  stats JSON;
BEGIN
  SELECT json_build_object(
    'total_attempts', COUNT(*),
    'average_score', ROUND(AVG(score), 2),
    'completion_rate', 
      CASE 
        WHEN COUNT(*) > 0 THEN ROUND((COUNT(CASE WHEN score IS NOT NULL THEN 1 END)::DECIMAL / COUNT(*)) * 100, 2)
        ELSE 0 
      END,
    'average_time', ROUND(AVG(time_taken), 0)
  ) INTO stats
  FROM quiz_attempts
  WHERE quiz_id = quiz_uuid;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================
-- FIM DO SCHEMA
-- ====================================
