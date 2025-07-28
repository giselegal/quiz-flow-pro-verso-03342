-- =============================================================================
-- CONFIGURAÇÃO AVANÇADA DE RLS E POLÍTICAS DE SEGURANÇA
-- Sistema Quiz Quest Challenge Verse
-- =============================================================================

-- =============================================================================
-- FUNÇÕES DE SEGURANÇA AUXILIARES
-- =============================================================================

-- Função para verificar se usuário é admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar se usuário é moderador ou admin
CREATE OR REPLACE FUNCTION is_moderator_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'moderator')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar se usuário tem plano premium
CREATE OR REPLACE FUNCTION has_premium_plan()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND plan IN ('pro', 'enterprise')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- POLÍTICAS ADICIONAIS PARA QUIZZES
-- =============================================================================

-- Política para administradores verem todos os quizzes
CREATE POLICY "Admins podem ver todos os quizzes"
  ON quizzes FOR ALL
  USING (is_admin());

-- Política para moderadores moderarem quizzes públicos
CREATE POLICY "Moderadores podem moderar quizzes públicos"
  ON quizzes FOR UPDATE
  USING (is_moderator_or_admin() AND is_public = true);

-- Política para limitar criação de quizzes por plano
CREATE POLICY "Usuários free limitados a 5 quizzes"
  ON quizzes FOR INSERT
  WITH CHECK (
    has_premium_plan() OR
    (
      SELECT COUNT(*) FROM quizzes 
      WHERE author_id = auth.uid()
    ) < 5
  );

-- =============================================================================
-- POLÍTICAS AVANÇADAS PARA PERGUNTAS
-- =============================================================================

-- Limitar número de perguntas por quiz baseado no plano
CREATE OR REPLACE FUNCTION can_add_question_to_quiz(quiz_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_count INTEGER;
  user_plan TEXT;
BEGIN
  -- Verificar plano do usuário
  SELECT plan INTO user_plan
  FROM profiles
  WHERE id = auth.uid();
  
  -- Contar perguntas existentes no quiz
  SELECT COUNT(*) INTO current_count
  FROM questions
  WHERE quiz_id = quiz_uuid;
  
  -- Limites por plano
  CASE user_plan
    WHEN 'free' THEN RETURN current_count < 10;
    WHEN 'pro' THEN RETURN current_count < 50;
    WHEN 'enterprise' THEN RETURN current_count < 200;
    ELSE RETURN current_count < 10;
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Política para limitar criação de perguntas por plano
CREATE POLICY "Limite de perguntas por plano"
  ON questions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quizzes 
      WHERE quizzes.id = questions.quiz_id 
      AND quizzes.author_id = auth.uid()
    ) AND
    can_add_question_to_quiz(quiz_id)
  );

-- =============================================================================
-- POLÍTICAS PARA ANALYTICS
-- =============================================================================

-- Política para analytics detalhadas apenas para premium
CREATE POLICY "Analytics detalhadas apenas para premium"
  ON quiz_analytics FOR SELECT
  USING (
    (
      EXISTS (
        SELECT 1 FROM quizzes 
        WHERE quizzes.id = quiz_analytics.quiz_id 
        AND quizzes.author_id = auth.uid()
      ) AND has_premium_plan()
    ) OR
    (
      EXISTS (
        SELECT 1 FROM quizzes 
        WHERE quizzes.id = quiz_analytics.quiz_id 
        AND quizzes.author_id = auth.uid()
      ) AND event_type IN ('view', 'complete')
    )
  );

-- =============================================================================
-- TRIGGERS DE VALIDAÇÃO
-- =============================================================================

-- Trigger para validar estrutura de perguntas
CREATE OR REPLACE FUNCTION validate_question_structure()
RETURNS TRIGGER AS $$
BEGIN
  -- Validar múltipla escolha
  IF NEW.question_type = 'multiple_choice' THEN
    IF jsonb_array_length(NEW.options) < 2 THEN
      RAISE EXCEPTION 'Múltipla escolha deve ter pelo menos 2 opções';
    END IF;
    
    IF jsonb_array_length(NEW.correct_answers) != 1 THEN
      RAISE EXCEPTION 'Múltipla escolha deve ter exatamente 1 resposta correta';
    END IF;
  END IF;
  
  -- Validar múltiplas respostas
  IF NEW.question_type = 'multiple_answer' THEN
    IF jsonb_array_length(NEW.options) < 2 THEN
      RAISE EXCEPTION 'Múltiplas respostas devem ter pelo menos 2 opções';
    END IF;
    
    IF jsonb_array_length(NEW.correct_answers) < 1 THEN
      RAISE EXCEPTION 'Múltiplas respostas devem ter pelo menos 1 resposta correta';
    END IF;
  END IF;
  
  -- Validar verdadeiro/falso
  IF NEW.question_type = 'true_false' THEN
    IF NEW.correct_answers IS NULL OR jsonb_array_length(NEW.correct_answers) != 1 THEN
      RAISE EXCEPTION 'Verdadeiro/Falso deve ter exatamente 1 resposta correta';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_question_before_insert
  BEFORE INSERT OR UPDATE ON questions
  FOR EACH ROW
  EXECUTE FUNCTION validate_question_structure();

-- =============================================================================
-- FUNÇÃO PARA CALCULAR PONTUAÇÃO
-- =============================================================================

CREATE OR REPLACE FUNCTION calculate_quiz_score(
  attempt_uuid UUID
)
RETURNS NUMERIC AS $$
DECLARE
  total_points INTEGER := 0;
  earned_points INTEGER := 0;
  final_score NUMERIC;
BEGIN
  -- Calcular pontos totais e ganhos
  SELECT 
    COALESCE(SUM(q.points), 0),
    COALESCE(SUM(qr.points_earned), 0)
  INTO total_points, earned_points
  FROM quiz_attempts qa
  JOIN questions q ON q.quiz_id = qa.quiz_id
  LEFT JOIN question_responses qr ON qr.attempt_id = qa.id AND qr.question_id = q.id
  WHERE qa.id = attempt_uuid;
  
  -- Calcular percentual
  IF total_points > 0 THEN
    final_score := (earned_points::NUMERIC / total_points::NUMERIC) * 100;
  ELSE
    final_score := 0;
  END IF;
  
  -- Atualizar tentativa
  UPDATE quiz_attempts 
  SET 
    score = final_score,
    total_points = total_points
  WHERE id = attempt_uuid;
  
  RETURN final_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- FUNÇÃO PARA AVALIAR RESPOSTA
-- =============================================================================

CREATE OR REPLACE FUNCTION evaluate_answer(
  question_uuid UUID,
  answer_data JSONB
)
RETURNS TABLE (
  is_correct BOOLEAN,
  points_earned INTEGER,
  explanation TEXT
) AS $$
DECLARE
  question_record RECORD;
  correct_count INTEGER := 0;
  total_correct INTEGER := 0;
  user_answers TEXT[];
  correct_answers TEXT[];
BEGIN
  -- Buscar dados da pergunta
  SELECT * INTO question_record
  FROM questions
  WHERE id = question_uuid;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Pergunta não encontrada';
  END IF;
  
  -- Avaliar baseado no tipo de pergunta
  CASE question_record.question_type
    WHEN 'multiple_choice' THEN
      is_correct := answer_data->>'answer' = question_record.correct_answers->>0;
      
    WHEN 'multiple_answer' THEN
      -- Converter para arrays
      SELECT array_agg(value::text) INTO user_answers
      FROM jsonb_array_elements_text(answer_data->'answers');
      
      SELECT array_agg(value::text) INTO correct_answers
      FROM jsonb_array_elements_text(question_record.correct_answers);
      
      -- Contar acertos
      SELECT COUNT(*) INTO correct_count
      FROM unnest(user_answers) ua
      WHERE ua = ANY(correct_answers);
      
      SELECT COUNT(*) INTO total_correct
      FROM unnest(correct_answers);
      
      is_correct := (correct_count = total_correct AND array_length(user_answers, 1) = total_correct);
      
    WHEN 'true_false' THEN
      is_correct := (answer_data->>'answer')::boolean = (question_record.correct_answers->>0)::boolean;
      
    WHEN 'text' THEN
      -- Para texto, comparação case-insensitive
      is_correct := LOWER(TRIM(answer_data->>'answer')) = LOWER(TRIM(question_record.correct_answers->>0));
      
    ELSE
      is_correct := false;
  END CASE;
  
  -- Calcular pontos
  IF is_correct THEN
    points_earned := question_record.points;
  ELSE
    points_earned := 0;
  END IF;
  
  explanation := question_record.explanation;
  
  RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- FUNÇÃO PARA COMPLETAR TENTATIVA
-- =============================================================================

CREATE OR REPLACE FUNCTION complete_quiz_attempt(
  attempt_uuid UUID
)
RETURNS JSONB AS $$
DECLARE
  attempt_record RECORD;
  quiz_record RECORD;
  final_score NUMERIC;
  passing_score NUMERIC;
  result JSONB;
BEGIN
  -- Buscar tentativa
  SELECT * INTO attempt_record
  FROM quiz_attempts
  WHERE id = attempt_uuid;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Tentativa não encontrada';
  END IF;
  
  -- Buscar quiz
  SELECT * INTO quiz_record
  FROM quizzes
  WHERE id = attempt_record.quiz_id;
  
  -- Calcular pontuação final
  final_score := calculate_quiz_score(attempt_uuid);
  
  -- Verificar se passou
  passing_score := COALESCE((quiz_record.settings->>'passingScore')::NUMERIC, 60);
  
  -- Atualizar tentativa como completa
  UPDATE quiz_attempts
  SET 
    status = 'completed',
    completed_at = NOW(),
    score = final_score
  WHERE id = attempt_uuid;
  
  -- Incrementar contador de completions
  PERFORM increment_quiz_completions(attempt_record.quiz_id);
  
  -- Montar resultado
  result := jsonb_build_object(
    'attemptId', attempt_uuid,
    'score', final_score,
    'passed', final_score >= passing_score,
    'passingScore', passing_score,
    'completedAt', NOW()
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- ÍNDICES PARA PERFORMANCE
-- =============================================================================

-- Índices compostos para queries frequentes
CREATE INDEX IF NOT EXISTS idx_quizzes_author_published ON quizzes(author_id, is_published);
CREATE INDEX IF NOT EXISTS idx_quizzes_public_category ON quizzes(is_public, category) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_status ON quiz_attempts(user_id, status);
CREATE INDEX IF NOT EXISTS idx_quiz_analytics_quiz_event_date ON quiz_analytics(quiz_id, event_type, created_at);

-- Índices parciais para dados ativos
CREATE INDEX IF NOT EXISTS idx_active_quizzes ON quizzes(created_at) WHERE is_published = true AND is_public = true;
CREATE INDEX IF NOT EXISTS idx_completed_attempts ON quiz_attempts(completed_at) WHERE status = 'completed';

-- =============================================================================
-- COMENTÁRIOS E DOCUMENTAÇÃO
-- =============================================================================

COMMENT ON FUNCTION is_admin() IS 'Verifica se o usuário atual é administrador';
COMMENT ON FUNCTION is_moderator_or_admin() IS 'Verifica se o usuário atual é moderador ou administrador';
COMMENT ON FUNCTION has_premium_plan() IS 'Verifica se o usuário atual tem plano premium';
COMMENT ON FUNCTION calculate_quiz_score(UUID) IS 'Calcula a pontuação final de uma tentativa de quiz';
COMMENT ON FUNCTION evaluate_answer(UUID, JSONB) IS 'Avalia se uma resposta está correta e calcula pontos';
COMMENT ON FUNCTION complete_quiz_attempt(UUID) IS 'Finaliza uma tentativa de quiz e calcula resultados';
