# Mapeamento de Tipos de Bloco (v3.0 → Editor)

Correções aplicadas para alinhar os tipos de sections (v3.0) com os componentes do Editor.

## ✅ Mapeamento Corrigido

- intro-hero → intro-logo (IntroLogoBlock)
- welcome-form → intro-form (IntroFormBlock)
- question-hero → quiz-question-header (QuizQuestionHeaderBlock)
- options-grid → options-grid (OptionsGridBlock)

Notas:
- O tipo original da section é preservado em properties._originalType para fins de auditoria e debug.
- A ordem de renderização agora respeita section.position quando disponível.

## Verificação
Em ambiente DEV, verificamos a ordem no console com o log:

- "📐 Ordem de blocos: [{ id, type, order }]"

## Impacto Esperado
- Step 1 renderiza corretamente os blocos atômicos.
- Ordem consistente por order.
- Menos flashes de carregamento (remoção de Suspense duplicado e pré-carregamento do próximo step).
