# Cobertura de Schemas de Blocos (Painel de Propriedades)

Este relatório resume os tipos de blocos usados no template `quiz21StepsComplete` e a cobertura de schemas no `DynamicPropertiesForm` via `blockSchema.ts`.

## Como funciona
- O `PropertiesPanel` usa o `DynamicPropertiesForm`, que lê schemas do registro em `schema/blockSchema.ts`.
- Os valores exibidos unem `selectedBlock.properties` + `selectedBlock.content`. Alterações são devolvidas como patch e aplicadas separando entre `content` e `properties` (com base nas chaves já existentes em `content`).
- Para evitar divergências, o renderer foi ajustado para aceitar fallbacks em alguns blocos (ex.: `text`, `image`, `button`, `legal-notice`).

## Tipos do template e status
Cobertura atual de schemas por tipo:

Suportados previamente:
- heading ✅
- text ✅ (ajustes de fallback no renderer)
- image ✅ (schema expandido)
- button ✅ (fallback no renderer)
- quiz-options ✅
- form-input ✅ (schema expandido)
- container ✅
- progress-header ✅

Adicionados nesta atualização:
- quiz-intro-header ✅
- options-grid ✅ (edição de opções avançadas ficará para próxima etapa)
- text-inline ✅
- button-inline ✅
- decorative-bar ✅
- form-container ✅
- legal-notice ✅ (renderer com links de privacidade/termos)
- quiz-offer-cta-inline ✅
- testimonials ✅ (suporta lista simples de textos; versão avançada futura)
- result-header-inline ✅
- style-card-inline ✅
- secondary-styles ✅ (lista simples; suporta strings)
- urgency-timer-inline ✅
- guarantee ✅
- bonus ✅
- benefits ✅ (lista simples)
- secure-purchase ✅
- value-anchoring ✅
- before-after-inline ✅
- mentor-section-inline ✅
- fashion-ai-generator ✅ (placeholder)
- connected-template-wrapper ✅
- conversion ✅ (renderer incluído)

## Observações importantes
- `options-grid`: o template define `content.options` com `{ id, text, imageUrl }`. O renderer agora entende `image` ou `imageUrl` e `label` ou `text`.
- `testimonials` e `secondary-styles`: o formulário usa `options-list` (texto simples). No preview, strings são normalizadas para objetos. Suporte completo (autor, cargo, imagem, score) pode ser adicionado em uma versão futura com um editor de lista avançado.
- `form-container`: hoje o preview busca filhos via `parentId`. O template possui `properties.children` (não materializados como blocos-filhos). Essa compatibilidade pode ser implementada posteriormente (ex.: expandindo children em blocos filhos ao carregar o template).

## Próximos passos sugeridos
- Editor avançado de listas (array) para `options-grid`, `testimonials` e `secondary-styles`.
- Mapear e materializar `properties.children` de `form-container` em blocos filhos para melhor pré-visualização.
- Validações adicionais específicas de domínio (ex.: `requiredSelections <= maxSelections`).
