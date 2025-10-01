-- 🚀 INSERÇÃO AUTOMÁTICA DE INSTÂNCIAS DE COMPONENTES
-- Gerado automaticamente em 2025-08-04T20:01:14.898Z

-- Limpar instâncias existentes (opcional - descomente se necessário)
-- DELETE FROM component_instances WHERE quiz_id = 'quiz-demo-id';

-- Inserir instâncias para quiz demo (substitua 'quiz-demo-id' pelo ID real)

-- =============================================================================
-- ETAPA 01
-- =============================================================================

INSERT INTO component_instances (component_type_key, quiz_id, step_number, order_index, properties) VALUES
  ('quiz-header', 'quiz-demo-id', 1, 1, '{"showProgress": false, "showBackButton": false}'::jsonb),
  ('hero-image', 'quiz-demo-id', 1, 2, '{"src": "", "alt": "Imagem principal", "size": "large"}'::jsonb),
  ('question-title', 'quiz-demo-id', 1, 3, '{"content": "Descubra Seu Estilo Ideal", "fontSize": "text-4xl"}'::jsonb),
  ('hero-subtitle', 'quiz-demo-id', 1, 4, '{"content": "Quiz personalizado de estilo"}'::jsonb),
  ('hero-description', 'quiz-demo-id', 1, 5, '{"content": "Responda algumas perguntas e descubra qual estilo combina mais com você!"}'::jsonb),
  ('cta-button', 'quiz-demo-id', 1, 6, '{"text": "Começar Quiz", "variant": "primary", "size": "xl"}'::jsonb);


-- =============================================================================
-- ETAPA 02
-- =============================================================================

INSERT INTO component_instances (component_type_key, quiz_id, step_number, order_index, properties) VALUES
  ('quiz-header', 'quiz-demo-id', 2, 1, '{"progressValue": 20, "progressMax": 100, "showBackButton": true}'::jsonb),
  ('question-title', 'quiz-demo-id', 2, 2, '{"content": "Questão 1 de 13"}'::jsonb),
  ('question-counter', 'quiz-demo-id', 2, 3, '{"content": "Questão 1 de 13"}'::jsonb),
  ('options-grid', 'quiz-demo-id', 2, 4, '{"columns": 2, "showImages": true, "options": []}'::jsonb);


-- =============================================================================
-- ETAPA 03
-- =============================================================================

INSERT INTO component_instances (component_type_key, quiz_id, step_number, order_index, properties) VALUES
  ('quiz-header', 'quiz-demo-id', 3, 1, '{"progressValue": 30, "progressMax": 100, "showBackButton": true}'::jsonb),
  ('question-title', 'quiz-demo-id', 3, 2, '{"content": "Questão 2 de 13"}'::jsonb),
  ('question-counter', 'quiz-demo-id', 3, 3, '{"content": "Questão 2 de 13"}'::jsonb),
  ('options-grid', 'quiz-demo-id', 3, 4, '{"columns": 2, "showImages": true, "options": []}'::jsonb);


-- =============================================================================
-- ETAPA 04
-- =============================================================================

INSERT INTO component_instances (component_type_key, quiz_id, step_number, order_index, properties) VALUES
  ('quiz-header', 'quiz-demo-id', 4, 1, '{"progressValue": 40, "progressMax": 100, "showBackButton": true}'::jsonb),
  ('question-title', 'quiz-demo-id', 4, 2, '{"content": "Questão 3 de 13"}'::jsonb),
  ('question-counter', 'quiz-demo-id', 4, 3, '{"content": "Questão 3 de 13"}'::jsonb),
  ('options-grid', 'quiz-demo-id', 4, 4, '{"columns": 2, "showImages": true, "options": []}'::jsonb);


-- =============================================================================
-- ETAPA 05
-- =============================================================================

INSERT INTO component_instances (component_type_key, quiz_id, step_number, order_index, properties) VALUES
  ('quiz-header', 'quiz-demo-id', 5, 1, '{"progressValue": 50, "progressMax": 100, "showBackButton": true}'::jsonb),
  ('question-title', 'quiz-demo-id', 5, 2, '{"content": "Questão 4 de 13"}'::jsonb),
  ('question-counter', 'quiz-demo-id', 5, 3, '{"content": "Questão 4 de 13"}'::jsonb),
  ('options-grid', 'quiz-demo-id', 5, 4, '{"columns": 2, "showImages": true, "options": []}'::jsonb);


-- =============================================================================
-- ETAPA 06
-- =============================================================================

INSERT INTO component_instances (component_type_key, quiz_id, step_number, order_index, properties) VALUES
  ('quiz-header', 'quiz-demo-id', 6, 1, '{"progressValue": 60, "progressMax": 100, "showBackButton": true}'::jsonb),
  ('question-title', 'quiz-demo-id', 6, 2, '{"content": "Questão 5 de 13"}'::jsonb),
  ('question-counter', 'quiz-demo-id', 6, 3, '{"content": "Questão 5 de 13"}'::jsonb),
  ('options-grid', 'quiz-demo-id', 6, 4, '{"columns": 2, "showImages": true, "options": []}'::jsonb);


-- =============================================================================
-- ETAPA 07
-- =============================================================================

INSERT INTO component_instances (component_type_key, quiz_id, step_number, order_index, properties) VALUES
  ('quiz-header', 'quiz-demo-id', 7, 1, '{"progressValue": 70, "progressMax": 100, "showBackButton": true}'::jsonb),
  ('question-title', 'quiz-demo-id', 7, 2, '{"content": "Questão 6 de 13"}'::jsonb),
  ('question-counter', 'quiz-demo-id', 7, 3, '{"content": "Questão 6 de 13"}'::jsonb),
  ('options-grid', 'quiz-demo-id', 7, 4, '{"columns": 2, "showImages": true, "options": []}'::jsonb);


-- =============================================================================
-- ETAPA 08
-- =============================================================================

INSERT INTO component_instances (component_type_key, quiz_id, step_number, order_index, properties) VALUES
  ('quiz-header', 'quiz-demo-id', 8, 1, '{"progressValue": 80, "progressMax": 100, "showBackButton": true}'::jsonb),
  ('question-title', 'quiz-demo-id', 8, 2, '{"content": "Questão 7 de 13"}'::jsonb),
  ('question-counter', 'quiz-demo-id', 8, 3, '{"content": "Questão 7 de 13"}'::jsonb),
  ('options-grid', 'quiz-demo-id', 8, 4, '{"columns": 2, "showImages": true, "options": []}'::jsonb);


-- =============================================================================
-- ETAPA 09
-- =============================================================================

INSERT INTO component_instances (component_type_key, quiz_id, step_number, order_index, properties) VALUES
  ('quiz-header', 'quiz-demo-id', 9, 1, '{"progressValue": 90, "progressMax": 100, "showBackButton": true}'::jsonb),
  ('question-title', 'quiz-demo-id', 9, 2, '{"content": "Questão 8 de 13"}'::jsonb),
  ('question-counter', 'quiz-demo-id', 9, 3, '{"content": "Questão 8 de 13"}'::jsonb),
  ('options-grid', 'quiz-demo-id', 9, 4, '{"columns": 2, "showImages": true, "options": []}'::jsonb);


-- =============================================================================
-- ETAPA 10
-- =============================================================================

INSERT INTO component_instances (component_type_key, quiz_id, step_number, order_index, properties) VALUES
  ('quiz-header', 'quiz-demo-id', 10, 1, '{"progressValue": 100, "progressMax": 100, "showBackButton": true}'::jsonb),
  ('question-title', 'quiz-demo-id', 10, 2, '{"content": "Questão 9 de 13"}'::jsonb),
  ('question-counter', 'quiz-demo-id', 10, 3, '{"content": "Questão 9 de 13"}'::jsonb),
  ('options-grid', 'quiz-demo-id', 10, 4, '{"columns": 2, "showImages": true, "options": []}'::jsonb);


-- =============================================================================
-- ETAPA 11
-- =============================================================================

INSERT INTO component_instances (component_type_key, quiz_id, step_number, order_index, properties) VALUES
  ('quiz-header', 'quiz-demo-id', 11, 1, '{"progressValue": 110, "progressMax": 100, "showBackButton": true}'::jsonb),
  ('question-title', 'quiz-demo-id', 11, 2, '{"content": "Questão 10 de 13"}'::jsonb),
  ('question-counter', 'quiz-demo-id', 11, 3, '{"content": "Questão 10 de 13"}'::jsonb),
  ('options-grid', 'quiz-demo-id', 11, 4, '{"columns": 2, "showImages": true, "options": []}'::jsonb);


-- =============================================================================
-- ETAPA 12
-- =============================================================================

INSERT INTO component_instances (component_type_key, quiz_id, step_number, order_index, properties) VALUES
  ('quiz-header', 'quiz-demo-id', 12, 1, '{"progressValue": 120, "progressMax": 100, "showBackButton": true}'::jsonb),
  ('question-title', 'quiz-demo-id', 12, 2, '{"content": "Questão 11 de 13"}'::jsonb),
  ('question-counter', 'quiz-demo-id', 12, 3, '{"content": "Questão 11 de 13"}'::jsonb),
  ('options-grid', 'quiz-demo-id', 12, 4, '{"columns": 2, "showImages": true, "options": []}'::jsonb);


-- =============================================================================
-- ETAPA 13
-- =============================================================================

INSERT INTO component_instances (component_type_key, quiz_id, step_number, order_index, properties) VALUES
  ('quiz-header', 'quiz-demo-id', 13, 1, '{"progressValue": 130, "progressMax": 100, "showBackButton": true}'::jsonb),
  ('question-title', 'quiz-demo-id', 13, 2, '{"content": "Questão 12 de 13"}'::jsonb),
  ('question-counter', 'quiz-demo-id', 13, 3, '{"content": "Questão 12 de 13"}'::jsonb),
  ('options-grid', 'quiz-demo-id', 13, 4, '{"columns": 2, "showImages": true, "options": []}'::jsonb);


-- =============================================================================
-- ETAPA 14
-- =============================================================================

INSERT INTO component_instances (component_type_key, quiz_id, step_number, order_index, properties) VALUES
  ('quiz-header', 'quiz-demo-id', 14, 1, '{"progressValue": 140, "progressMax": 100, "showBackButton": true}'::jsonb),
  ('question-title', 'quiz-demo-id', 14, 2, '{"content": "Questão 13 de 13"}'::jsonb),
  ('question-counter', 'quiz-demo-id', 14, 3, '{"content": "Questão 13 de 13"}'::jsonb),
  ('options-grid', 'quiz-demo-id', 14, 4, '{"columns": 2, "showImages": true, "options": []}'::jsonb);


-- =============================================================================
-- ETAPA 15
-- =============================================================================

INSERT INTO component_instances (component_type_key, quiz_id, step_number, order_index, properties) VALUES
  ('quiz-header', 'quiz-demo-id', 15, 1, '{"showProgress": true, "showBackButton": false}'::jsonb),
  ('transition-title', 'quiz-demo-id', 15, 2, '{}'::jsonb);


-- =============================================================================
-- ETAPA 16
-- =============================================================================

INSERT INTO component_instances (component_type_key, quiz_id, step_number, order_index, properties) VALUES
  ('quiz-header', 'quiz-demo-id', 16, 1, '{"showProgress": true, "showBackButton": false}'::jsonb),
  ('processing-title', 'quiz-demo-id', 16, 2, '{}'::jsonb);


-- =============================================================================
-- ETAPA 17
-- =============================================================================

INSERT INTO component_instances (component_type_key, quiz_id, step_number, order_index, properties) VALUES
  ('quiz-header', 'quiz-demo-id', 17, 1, '{"showProgress": true, "showBackButton": false}'::jsonb),
  ('result-title', 'quiz-demo-id', 17, 2, '{}'::jsonb);


-- =============================================================================
-- ETAPA 18
-- =============================================================================

INSERT INTO component_instances (component_type_key, quiz_id, step_number, order_index, properties) VALUES
  ('quiz-header', 'quiz-demo-id', 18, 1, '{"showProgress": true, "showBackButton": false}'::jsonb),
  ('result-description', 'quiz-demo-id', 18, 2, '{}'::jsonb);


-- =============================================================================
-- ETAPA 19
-- =============================================================================

INSERT INTO component_instances (component_type_key, quiz_id, step_number, order_index, properties) VALUES
  ('quiz-header', 'quiz-demo-id', 19, 1, '{"showProgress": true, "showBackButton": false}'::jsonb),
  ('transformation-gallery', 'quiz-demo-id', 19, 2, '{}'::jsonb);


-- =============================================================================
-- ETAPA 20
-- =============================================================================

INSERT INTO component_instances (component_type_key, quiz_id, step_number, order_index, properties) VALUES
  ('quiz-header', 'quiz-demo-id', 20, 1, '{"showProgress": true, "showBackButton": false}'::jsonb),
  ('lead-form', 'quiz-demo-id', 20, 2, '{}'::jsonb);


-- =============================================================================
-- ETAPA 21
-- =============================================================================

INSERT INTO component_instances (component_type_key, quiz_id, step_number, order_index, properties) VALUES
  ('quiz-header', 'quiz-demo-id', 21, 1, '{"showProgress": true, "showBackButton": false}'::jsonb),
  ('offer-cta', 'quiz-demo-id', 21, 2, '{}'::jsonb);

-- 🎯 ATUALIZAR CONTADORES DE USO
UPDATE component_types SET usage_count = (
  SELECT COUNT(*) FROM component_instances 
  WHERE component_instances.component_type_key = component_types.type_key
);

-- ✅ MIGRAÇÃO CONCLUÍDA!
-- Total de instâncias criadas: 42 (aproximadamente)
