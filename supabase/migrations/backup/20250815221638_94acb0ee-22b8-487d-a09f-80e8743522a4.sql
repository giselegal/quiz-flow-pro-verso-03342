-- Populate component_types table with essential quiz block types
INSERT INTO component_types (type_key, display_name, description, category, default_properties, validation_schema, is_system, is_active)
VALUES 
  -- Core Components
  ('text-inline', 'Texto Inline', 'Componente de texto editável', 'content', '{"content": "Texto padrão", "fontSize": "text-base", "textAlign": "text-left"}', '{"type": "object"}', true, true),
  ('heading-inline', 'Título Inline', 'Componente de título editável', 'content', '{"content": "Título", "fontSize": "text-2xl", "fontWeight": "font-bold"}', '{"type": "object"}', true, true),
  ('image-display-inline', 'Imagem Inline', 'Componente de imagem editável', 'media', '{"src": "", "alt": "Imagem", "width": "auto", "height": "auto"}', '{"type": "object"}', true, true),
  ('button-inline', 'Botão Inline', 'Componente de botão editável', 'interactive', '{"text": "Clique aqui", "variant": "primary", "onClick": ""}', '{"type": "object"}', true, true),
  
  -- Quiz Specific Components
  ('quiz-intro-header', 'Cabeçalho Quiz', 'Cabeçalho unificado para quiz', 'quiz', '{"logoUrl": "", "showProgress": true, "progressValue": 0}', '{"type": "object"}', true, true),
  ('options-grid', 'Grid de Opções', 'Grid de opções para quiz', 'quiz', '{"options": [], "maxSelection": 1, "layout": "grid"}', '{"type": "object"}', true, true),
  ('loading-animation', 'Animação Loading', 'Animação de carregamento', 'ui', '{"type": "spinner", "color": "#B89B7A", "size": "medium"}', '{"type": "object"}', true, true),
  ('progress-bar', 'Barra de Progresso', 'Barra de progresso animada', 'ui', '{"value": 0, "max": 100, "animated": true}', '{"type": "object"}', true, true),
  ('lead-form', 'Formulário Lead', 'Formulário de captura de leads', 'form', '{"fields": ["name", "email"], "submitText": "Enviar"}', '{"type": "object"}', true, true),
  ('countdown-timer', 'Timer Countdown', 'Timer regressivo', 'ui', '{"duration": 30, "color": "#B89B7A", "size": "medium"}', '{"type": "object"}', true, true),
  ('result-display', 'Exibição de Resultado', 'Componente para mostrar resultados', 'quiz', '{"title": "Seu Resultado", "score": 85, "category": "Elegante"}', '{"type": "object"}', true, true),
  
  -- Form Components
  ('form-container', 'Container Form', 'Container para formulários', 'form', '{"layout": "vertical", "spacing": "medium"}', '{"type": "object"}', true, true),
  ('form-input', 'Campo Input', 'Campo de entrada de dados', 'form', '{"inputType": "text", "placeholder": "Digite aqui", "required": false}', '{"type": "object"}', true, true),
  
  -- Layout Components  
  ('decorative-bar', 'Barra Decorativa', 'Barra decorativa visual', 'layout', '{"color": "#B89B7A", "height": "4px", "margin": "16px"}', '{"type": "object"}', true, true)
ON CONFLICT (type_key) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  default_properties = EXCLUDED.default_properties,
  validation_schema = EXCLUDED.validation_schema,
  is_active = EXCLUDED.is_active,
  updated_at = now();