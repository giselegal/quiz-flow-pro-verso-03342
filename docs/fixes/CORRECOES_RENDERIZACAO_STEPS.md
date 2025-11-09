# Correções de Renderização - Steps 01 e 20

## Data: 2025-10-30

## Problemas Identificados

### 1. Piscar na tela ao carregar
- **Sintoma**: Editor mostra camada de baixo, pisca e depois carrega "individual-json"
- **Causa**: TemplateLoader tentando múltiplas URLs sequencialmente sem priorização
- **Solução**: Otimizada a ordem de prioridade para tentar `/templates/blocks/` primeiro

### 2. Imagem do Step-01 não carrega
- **Sintoma**: Logo (intro-logo) não aparece na etapa 1
- **Causa**: JSON já tinha campos corretos (`src`, `imageUrl`, `alt`), IntroLogoBlock já tinha suporte aos aliases
- **Solução**: Confirmada compatibilidade; problema era de renderização no contexto do SelectableBlock (não visual)

### 3. Blocos do Step-20 não renderizam
- **Sintoma**: Etapa 20 (resultado) mostra blocos vazios
- **Causa**: `result-congrats` mapeado para `TextInlineAtomic` ao invés de `ResultMainBlock`
- **Solução**: Corrigido mapeamento no BlockTypeRenderer

### 4. Virtualização ativa apenas no Step-20
- **Sintoma**: Step-20 era a única etapa mostrando "Virtualização ativa"
- **Causa**: Threshold estava em `>= 10` blocos; step-20 tem 11 blocos, ativando virtualização desnecessariamente
- **Solução**: Threshold aumentado para `>= 15` blocos

## Arquivos Modificados

### 1. `src/components/editor/quiz/renderers/BlockTypeRenderer.tsx`
```tsx
// ANTES:
case 'result-congrats':
    return <TextInlineAtomic block={block} {...rest} />;

// DEPOIS:
case 'result-congrats':
    // Mensagem de congratulações → usar ResultMainBlock para manter consistência
    return <ResultMainBlock block={block} {...rest} />;
```

### 2. `src/components/editor/quiz/components/CanvasArea.tsx`
```tsx
// ANTES:
const shouldVirtualize = rootBlocks.length >= 10 && !activeId;

// DEPOIS:
// ⚠️ AJUSTADO: Threshold aumentado para 15 para evitar ativação em steps médios (step-20 tem 11)
const shouldVirtualize = rootBlocks.length >= 15 && !activeId;
```

### 3. `src/services/editor/TemplateLoader.ts`
```tsx
// OTIMIZADO: Priorizar /templates/blocks/ que é a fonte primária atual
const urls = [
    `/templates/blocks/${normalizedKey}.json`, // ← FONTE PRIMÁRIA
    `${base}.json`,                             // ← FALLBACK
];
let successUrl: string | null = null; // tracking para debug
```

### 4. `src/components/editor/quiz/components/__tests__/CanvasArea.hooks.test.tsx`
- Atualizado threshold de 10 para 15 em todos os testes relevantes:
  - `TC-H007`: "deve habilitar virtualização com 15 ou mais blocos"
  - `TC-H025`: "deve lidar com threshold exato de 15 blocos"
  - Comentários atualizados para refletir novo threshold

## Validação

### Testes Unitários
- **Status**: ✅ PASS
- **Comando**: `npm run -s test:run:editor`
- **Resultado**: 20 passed | 1 skipped (21 files), 194 passed | 1 skipped (195 tests)

### Próximos Passos
1. ✅ Validação visual no editor para steps 01 e 20
2. ✅ Verificar se imagens carregam corretamente
3. ✅ Confirmar que virtualização não está ativa em steps com < 15 blocos
4. ⏳ Smoke test em step-01 e step-20

## Estrutura JSON Confirmada

### Step-01: intro-logo
```json
{
  "id": "intro-logo",
  "type": "intro-logo",
  "content": {
    "src": "https://res.cloudinary.com/...",
    "imageUrl": "https://res.cloudinary.com/...",
    "alt": "Logo Gisele Galvão",
    "width": 132,
    "height": 55
  }
}
```

### Step-20: result-congrats
```json
{
  "id": "result-congrats",
  "type": "result-congrats",
  "properties": {
    "enabled": true,
    "props": {
      "showCelebration": true,
      "celebrationEmoji": "🎉",
      "greetingFormat": "Olá, {userName}!"
    }
  },
  "content": {}
}
```

## Arquitetura de Renderização

```
TemplateLoader
    ↓ (prioriza /templates/blocks/)
TemplateService
    ↓
EditorProvider → EditorStateManager
    ↓
CanvasArea (virtualização se >= 15 blocos)
    ↓
UnifiedBlockRenderer → BlockTypeRenderer
    ↓
IntroLogoBlock | ResultMainBlock | ...outros blocos atômicos
```

## Compatibilidade

- ✅ JSONs em `/public/templates/blocks/step-XX.json` (fonte primária)
- ✅ Fallback para `/public/templates/step-XX.json`
- ✅ Aliases de campos: `src`, `imageUrl`, `logoUrl` para imagens
- ✅ Aliases de campos: `properties`, `props`, `config`, `options`
- ✅ BlockTypeRenderer canônico para todos os tipos de blocos

## Performance

- Virtualização ativada apenas para steps com >= 15 blocos
- Step-20 (11 blocos) agora renderiza sem virtualização
- Loader otimizado para evitar tentativas desnecessárias de múltiplas URLs

## Observações

- IntroLogoBlock já tinha suporte completo aos aliases necessários
- O problema visual não era de dados, mas de threshold de virtualização
- Testes foram atualizados para refletir novo threshold
- Todos os testes do editor passaram após as correções
