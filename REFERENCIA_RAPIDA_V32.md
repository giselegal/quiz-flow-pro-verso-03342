# ⚡ REFERÊNCIA RÁPIDA: Sistema JSON v3.2

**Consulta rápida para desenvolvimento diário**

---

## 🎯 Comandos Essenciais

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Abrir editor
open http://localhost:8081/editor

# Build de produção
npm run build

# Preview do build
npm run preview
```

### Testes

```bash
# Todos os testes
npm test

# Testes específicos
npm test -- versionHelpers
npm test -- ConsolidatedTemplateService

# E2E tests
npm run test:e2e

# Cobertura
npm test -- --coverage
```

### Validação

```bash
# TypeScript
npm run typecheck

# Linting
npm run lint

# Validar JSON
node -e "JSON.parse(require('fs').readFileSync('templates/step-01-v3.json'))"
```

---

## 📁 Estrutura de Arquivos

### Templates

```
public/templates/
├── quiz21-complete.json          # Master JSON v3.0 (101 KB)
└── funnels/
    └── quiz21StepsComplete/
        └── master.v3.json         # Master v3.2 (futuro)

templates/
├── step-01-v3.json               # Individual v3.2 (~3 KB)
├── step-02-v3.json
└── ...step-21-v3.json
```

### Services

```
src/services/
├── core/
│   └── ConsolidatedTemplateService.ts  # Fonte única
├── TemplateProcessor.ts                # Variáveis v3.2
└── TemplateLoader.ts                   # Carregamento

src/hooks/
└── useEditor.ts                        # Hook unificado
```

### Types

```
src/types/
├── schemas/
│   └── templateSchema.ts               # Zod schemas
├── template-v3.types.ts                # Types principais
├── normalizedTemplate.ts               # Normalized types
└── v3/
    └── template.ts                     # v3 specific
```

### Utils

```
src/lib/utils/
└── versionHelpers.ts                   # Comparação de versões
```

---

## 🔧 APIs Principais

### ConsolidatedTemplateService

```typescript
import { consolidatedTemplateService } from '@/services/core/ConsolidatedTemplateService';

// Carregar template
const template = await consolidatedTemplateService.getTemplate('step-01');

// Pré-carregar (opcional)
await consolidatedTemplateService.preload('step-02');

// Limpar cache
consolidatedTemplateService.clearCache();

// Health check
const isHealthy = await consolidatedTemplateService.healthCheck();
```

### TemplateProcessor (v3.2)

```typescript
import { processTemplate } from '@/services/TemplateProcessor';

// Processar variáveis dinâmicas
const processed = await processTemplate(template);

// Input:  { backgroundColor: "{{theme.colors.primary}}" }
// Output: { backgroundColor: "#B89B7A" }
```

### Version Helpers

```typescript
import {
  isV3Template,
  isV32OrNewer,
  supportsDynamicVariables,
  compareVersions,
  isSupportedVersion,
} from '@/lib/utils/versionHelpers';

// Verificar versão
if (isV3Template(template.templateVersion)) {
  // É v3.x
}

if (isV32OrNewer(template.templateVersion)) {
  // Suporta variáveis dinâmicas
}

if (supportsDynamicVariables(template.templateVersion)) {
  const processed = await processTemplate(template);
}

// Comparar versões
const result = compareVersions('3.2', '3.1'); // 1 (maior)
```

### useEditor Hook

```typescript
import { useEditor } from '@/hooks/useEditor';

function MyComponent() {
  const {
    currentStep,
    blocks,
    actions: { updateBlock, undo, redo, exportJSON }
  } = useEditor();
  
  // Atualizar block
  await actions.updateBlock('step-01', 'block-1', { title: 'Novo título' });
  
  // Undo/Redo
  actions.undo();
  actions.redo();
  
  // Export
  const json = actions.exportJSON();
}
```

---

## 📊 Estrutura de Template v3.2

### Template Completo

```json
{
  "templateVersion": "3.2",
  "templateId": "quiz21StepsComplete",
  "name": "Quiz de Estilo Pessoal",
  "metadata": {
    "version": "3.2.0",
    "dynamicVariables": true,
    "createdAt": "2025-11-12",
    "updatedAt": "2025-11-12"
  },
  "theme": {
    "colors": {
      "primary": "#B89B7A",
      "secondary": "#432818",
      "background": "#fefefe",
      "text": "#5b4135"
    },
    "fonts": {
      "heading": "Playfair Display, serif",
      "body": "Inter, sans-serif"
    },
    "spacing": {
      "sm": 8,
      "md": 16,
      "lg": 24,
      "xl": 32
    }
  },
  "steps": {
    "step-01": {
      "templateVersion": "3.2",
      "metadata": {
        "id": "step-01-intro-v3",
        "name": "Introdução",
        "type": "intro"
      },
      "blocks": [
        {
          "id": "hero-1",
          "type": "hero",
          "properties": {
            "title": "Bem-vindo!",
            "backgroundColor": "{{theme.colors.background}}",
            "textColor": "{{theme.colors.text}}"
          }
        }
      ]
    }
  }
}
```

### Step Individual (v3.2)

```json
{
  "templateVersion": "3.2",
  "metadata": {
    "id": "step-01-intro-v3",
    "name": "Introdução",
    "type": "intro",
    "version": "3.2.0",
    "dynamicVariables": true
  },
  "blocks": [
    {
      "id": "hero-1",
      "type": "hero",
      "properties": {
        "title": "{{content.title}}",
        "subtitle": "{{content.subtitle}}",
        "backgroundColor": "{{theme.colors.background}}",
        "textColor": "{{theme.colors.text}}",
        "padding": "{{theme.spacing.lg}}",
        "fontFamily": "{{theme.fonts.heading}}"
      }
    }
  ]
}
```

---

## 🎨 Variáveis v3.2

### Tema - Cores

```json
{
  "primary": "{{theme.colors.primary}}",           // #B89B7A
  "secondary": "{{theme.colors.secondary}}",       // #432818
  "background": "{{theme.colors.background}}",     // #fefefe
  "text": "{{theme.colors.text}}",                 // #5b4135
  "border": "{{theme.colors.border}}",             // #E5E7EB
  "primaryHover": "{{theme.colors.primaryHover}}", // #A68B6A
  "primaryLight": "{{theme.colors.primaryLight}}"  // #F3E8D3
}
```

### Tema - Fontes

```json
{
  "heading": "{{theme.fonts.heading}}",  // "Playfair Display, serif"
  "body": "{{theme.fonts.body}}"         // "Inter, sans-serif"
}
```

### Tema - Espaçamentos

```json
{
  "sm": "{{theme.spacing.sm}}",   // 8
  "md": "{{theme.spacing.md}}",   // 16
  "lg": "{{theme.spacing.lg}}",   // 24
  "xl": "{{theme.spacing.xl}}"    // 32
}
```

### Assets - Imagens

```json
{
  "logo": "{{assets.images.logo}}",
  "hero": "{{assets.images.hero}}",
  "icon": "{{assets.images.icon}}"
}
```

### Conteúdo Dinâmico

```json
{
  "title": "{{content.title}}",
  "subtitle": "{{content.subtitle}}",
  "description": "{{content.description}}",
  "ctaText": "{{content.ctaText}}"
}
```

---

## 🔍 Debugging

### Console do Browser

```javascript
// Carregar service
const { consolidatedTemplateService } = await import('@/services/core/ConsolidatedTemplateService');

// Carregar template
const step01 = await consolidatedTemplateService.getTemplate('step-01');
console.log('Template:', step01);

// Verificar versão
console.log('Version:', step01?.metadata?.version);

// Verificar blocks
console.log('Blocks:', step01?.steps[0]?.blocks);

// Verificar cache
consolidatedTemplateService.getCached('step-01');

// Limpar cache
consolidatedTemplateService.clearCache();

// Health check
const health = await consolidatedTemplateService.healthCheck();
console.log('Health:', health);
```

### Performance

```javascript
// Medir tempo de carregamento
console.time('load-step-01');
const template = await consolidatedTemplateService.getTemplate('step-01');
console.timeEnd('load-step-01');
// Deve ser < 300ms

// Tamanho do template
const size = JSON.stringify(template).length;
console.log('Size:', (size / 1024).toFixed(2), 'KB');
```

### Verificar Variáveis v3.2

```javascript
// Importar processor
const { processTemplate } = await import('@/services/TemplateProcessor');

// Template com variáveis
const template = {
  blocks: [{
    properties: {
      backgroundColor: '{{theme.colors.primary}}'
    }
  }]
};

// Processar
const processed = await processTemplate(template);
console.log('Original:', template.blocks[0].properties.backgroundColor);
console.log('Processado:', processed.blocks[0].properties.backgroundColor);
// Deve mostrar: "#B89B7A"
```

---

## 🚨 Troubleshooting

### Problema: "Template não carrega"

**Verificar:**
```javascript
// 1. Arquivo existe?
fetch('/templates/step-01-v3.json').then(r => console.log('Status:', r.status));

// 2. JSON válido?
fetch('/templates/step-01-v3.json')
  .then(r => r.json())
  .then(j => console.log('Valid JSON:', !!j));

// 3. Versão correta?
fetch('/templates/step-01-v3.json')
  .then(r => r.json())
  .then(j => console.log('Version:', j.templateVersion));
```

### Problema: "Variáveis não processadas"

**Verificar:**
```javascript
import { isV32OrNewer } from '@/lib/utils/versionHelpers';

const template = await fetch('/templates/step-01-v3.json').then(r => r.json());

console.log('Version:', template.templateVersion);
console.log('Supports variables:', isV32OrNewer(template.templateVersion));

// Se true, processar
if (isV32OrNewer(template.templateVersion)) {
  const { processTemplate } = await import('@/services/TemplateProcessor');
  const processed = await processTemplate(template);
  console.log('Processed:', processed);
}
```

### Problema: "Erros de TypeScript"

**Verificar tipos:**
```bash
# Check de tipos
npm run typecheck

# Verificar arquivo específico
npx tsc --noEmit src/components/MyComponent.tsx
```

---

## 📈 Métricas de Performance

### Targets

| Operação | Target | Aceitável |
|----------|--------|-----------|
| Load v3.2 JSON | < 250ms | < 300ms |
| Process Variables | < 5ms | < 10ms |
| Total Load Time | < 300ms | < 500ms |
| Cache Hit | < 1ms | < 5ms |

### Monitorar

```javascript
// Performance API
performance.mark('load-start');
await consolidatedTemplateService.getTemplate('step-01');
performance.mark('load-end');

const measure = performance.measure('load-time', 'load-start', 'load-end');
console.log('Load time:', measure.duration.toFixed(2), 'ms');

// Deve ser < 300ms
```

---

## 📚 Links Úteis

### Documentação

- [Sistema JSON v3.2 Adaptado](./SISTEMA_JSON_V32_ADAPTADO.md)
- [Guia de Migração v3.0 → v3.2](./GUIA_MIGRACAO_V30_PARA_V32.md)
- [Relatório de Compatibilidade v3.2](./RELATORIO_COMPATIBILIDADE_V32_FINAL.md)
- [Auditoria v3.2](./AUDITORIA_COMPATIBILIDADE_V32.md)

### Código

- [ConsolidatedTemplateService](./src/services/core/ConsolidatedTemplateService.ts)
- [TemplateProcessor](./src/services/TemplateProcessor.ts)
- [Version Helpers](./src/lib/utils/versionHelpers.ts)
- [useEditor Hook](./src/hooks/useEditor.ts)

### Testes

- [Version Helpers Tests](./src/__tests__/versionHelpers.test.ts)
- [ConsolidatedTemplateService Tests](./src/__tests__/ConsolidatedTemplateService.v32.test.ts)

---

## 🎯 Atalhos de Teclado (Editor)

| Atalho | Ação |
|--------|------|
| `Ctrl+S` | Salvar changes |
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` | Redo |
| `Ctrl+E` | Export JSON |
| `Ctrl+I` | Import JSON |
| `Ctrl+P` | Preview mode |
| `F5` | Reload |

---

## 📝 Notas Rápidas

### Hierarquia de Fallback

```
Individual v3.2 → Master v3.0 → Registry → TypeScript → Fallback
```

### Versões Suportadas

```
3.2 (atual) > 3.1 > 3.0 > 2.1 > 2.0 > 1.0
```

### Compatibilidade

- ✅ v3.2 → v3.1 → v3.0: 100% compatível
- ✅ v3.0 → v3.2: Migração automática disponível
- ⚠️ v2.x → v3.2: Requer migração manual

---

**Última atualização:** 12 de novembro de 2025  
**Versão:** 1.0.0  
**Autor:** GitHub Copilot
