-- Populate component_types table with essential quiz block types including component_path
INSERT INTO component_types (type_key, display_name, description, category, component_path, default_properties, validation_schema, is_system, is_active)
VALUES 
  -- Core Components
  ('text-inline', 'Texto Inline', 'Componente de texto editável', 'content', '@/components/blocks/inline/TextInline', '{"content": "Texto padrão", "fontSize": "text-base", "textAlign": "text-left"}', '{"type": "object"}', true, true),
  ('heading-inline', 'Título Inline', 'Componente de título editável', 'content', '@/components/blocks/inline/HeadingBlock', '{"content": "Título", "fontSize": "text-2xl", "fontWeight": "font-bold"}', '{"type": "object"}', true, true),
  ('image-display-inline', 'Imagem Inline', 'Componente de imagem editável', 'media', '@/components/blocks/inline/ImageDisplayInlineBlock.clean', '{"src": "", "alt": "Imagem", "width": "auto", "height": "auto"}', '{"type": "object"}', true, true),
  ('button-inline', 'Botão Inline', 'Componente de botão editável', 'interactive', '@/components/blocks/inline/ButtonInlineFixed', '{"text": "Clique aqui", "variant": "primary", "onClick": ""}', '{"type": "object"}', true, true),
  
  -- Quiz Specific Components
  ('quiz-intro-header', 'Cabeçalho Quiz', 'Cabeçalho unificado para quiz', 'quiz', '@/components/blocks/unified/UnifiedHeaderBlock', '{"logoUrl": "", "showProgress": true, "progressValue": 0}', '{"type": "object"}', true, true),
  ('options-grid', 'Grid de Opções', 'Grid de opções para quiz', 'quiz', '@/components/blocks/inline/OptionsGridInlineBlock', '{"options": [], "maxSelection": 1, "layout": "grid"}', '{"type": "object"}', true, true),
  ('loading-animation', 'Animação Loading', 'Animação de carregamento', 'ui', '@/components/blocks/inline/LoadingAnimationBlock', '{"type": "spinner", "color": "#B89B7A", "size": "medium"}', '{"type": "object"}', true, true),
  ('progress-bar', 'Barra de Progresso', 'Barra de progresso animada', 'ui', '@/components/blocks/inline/ProgressBarBlock', '{"value": 0, "max": 100, "animated": true}', '{"type": "object"}', true, true),
  ('lead-form', 'Formulário Lead', 'Formulário de captura de leads', 'form', '@/components/blocks/inline/LeadFormBlock', '{"fields": ["name", "email"], "submitText": "Enviar"}', '{"type": "object"}', true, true),
  ('countdown-timer', 'Timer Countdown', 'Timer regressivo', 'ui', '@/components/blocks/inline/CountdownTimerBlock', '{"duration": 30, "color": "#B89B7A", "size": "medium"}', '{"type": "object"}', true, true),
  ('result-display', 'Exibição de Resultado', 'Componente para mostrar resultados', 'quiz', '@/components/blocks/inline/ResultDisplayBlock', '{"title": "Seu Resultado", "score": 85, "category": "Elegante"}', '{"type": "object"}', true, true)

ON CONFLICT (type_key) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  component_path = EXCLUDED.component_path,
  default_properties = EXCLUDED.default_properties,
  validation_schema = EXCLUDED.validation_schema,
  is_active = EXCLUDED.is_active,
  updated_at = now();