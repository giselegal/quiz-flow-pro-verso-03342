# 🎯 Quiz 21 Steps - Estrutura Modular v4.0

## 📋 Visão Geral

Template modular do quiz de estilo pessoal com 21 etapas editáveis individualmente.

## 📁 Estrutura

```
quiz21Steps/
├── meta.json              # Metadados e configuração global
├── README.md              # Esta documentação
├── steps/                 # Steps individuais (fonte de verdade)
│   ├── step-01.json      # Introdução
│   ├── step-02.json      # Pergunta 1
│   ├── ...
│   └── step-21.json      # Resultado final
└── compiled/              # Build artifacts (gerados automaticamente)
    └── full.json         # Template consolidado para runtime
```

## 🎯 Filosofia

### Fonte de Verdade
- **Steps individuais** (`steps/*.json`) = EDITAR AQUI
- **Compiled** (`compiled/full.json`) = NÃO EDITAR (gerado automaticamente)

### Quando Usar Cada Formato

| Cenário | Usar |
|---------|------|
| Editar conteúdo | `steps/step-XX.json` |
| Adicionar step | Criar `steps/step-XX.json` |
| Reordenar steps | Renomear arquivos ou atualizar `meta.json` |
| Exportar para edição | ZIP com `steps/` |
| Runtime (produção) | `compiled/full.json` |
| Cache do editor | `compiled/full.json` |

## 🔧 Build Process

### Build Manual
```bash
npm run build:templates
```

### Build Automático
- **Pre-commit hook**: Compila automaticamente antes de commit
- **CI/CD**: Build em deploy (Vercel/Netlify)
- **Dev mode**: Watch mode para hot reload

### O que o Build Faz
1. Lê todos os arquivos de `steps/`
2. Valida estrutura de cada step (Zod schema)
3. Consolida em `compiled/full.json`
4. Atualiza `meta.json` com buildInfo
5. Gera TypeScript tipado (opcional)

## ✏️ Como Editar

### Editar Step Existente
1. Abra `steps/step-05.json` (por exemplo)
2. Modifique blocos, propriedades, conteúdo
3. Salve o arquivo
4. Execute `npm run build:templates`
5. Teste no editor

### Adicionar Novo Step
1. Crie `steps/step-22.json`
2. Use estrutura de template:
```json
{
  "templateVersion": "4.0",
  "metadata": {
    "id": "step-22-custom",
    "name": "Minha Nova Etapa",
    "category": "custom"
  },
  "blocks": [
    {
      "id": "block-1",
      "type": "heading",
      "content": { "text": "Título" }
    }
  ]
}
```
3. Atualize `totalSteps` em `meta.json`
4. Build e teste

### Snippet VS Code (rápido)
- Use o snippet `step-v4` (arquivo `.vscode/step-v4.code-snippets`) ao criar `steps/step-XX.json` para garantir conformidade com o ModularStepSchema v4.0.

### Remover Step
1. Delete `steps/step-XX.json`
2. Atualize `totalSteps` em `meta.json`
3. Reordene steps restantes se necessário
4. Build e teste

## 📤 Export/Import

### Exportar para Edição Externa
```typescript
import { FunnelExportService } from '@/services/FunnelExportService';

// Exporta estrutura modular (ZIP)
const zip = await FunnelExportService.exportModular('funnel-id');
// Estrutura: meta.json + steps/*.json + README.md
```

### Importar Funil
```typescript
import { FunnelImportService } from '@/services/FunnelImportService';

// Aceita ZIP modular ou JSON completo
const funnel = await FunnelImportService.import(file);
// Converte automaticamente se necessário
```

## 🎨 Customização

### Alterar Tema Global
Edite `meta.json`:
```json
"globalConfig": {
  "theme": {
    "primaryColor": "#FF0000",    // Sua cor primária
    "secondaryColor": "#00FF00"   // Sua cor secundária
  }
}
```

### Configurar Pontuação
Edite `meta.json`:
```json
"globalConfig": {
  "scoring": {
    "enabled": true,
    "speedBonusPoints": 10,      // Ajuste bônus
    "completionBonus": 100       // Ajuste recompensa
  }
}
```

## 🔍 Validação

### Validar Estrutura
```bash
npm run validate:templates
```

### Verificar Sintaxe JSON
```bash
npm run lint:json
```

### Testar Template
```bash
npm run test:template quiz21StepsComplete
```

### Testes de Schemas
```bash
npm run test -t schemas v4.0
```
- Arquivo de testes: `tests/schemas/modularStepSchema.spec.ts`
- Cobre validações de `ModularStep`, `Navigation` e `Validation`.

## 📊 Vantagens da Estrutura Modular

### ✅ Editabilidade
- Cada step em arquivo pequeno (3-7KB)
- Fácil localizar e modificar blocos
- Sintaxe JSON simples

### ✅ Git Workflow
- Diffs granulares por step
- Merge conflicts isolados
- Code review eficiente

### ✅ Colaboração
- Múltiplos editores trabalhando em paralelo
- Conflitos raros (steps diferentes)
- Histórico claro de mudanças

### ✅ Performance
- Editor carrega apenas step ativo
- Lazy loading de steps
- Cache inteligente

### ✅ Escalabilidade
- Adicionar steps sem limite
- Remover steps não usados
- Duplicar steps facilmente

## 🐛 Troubleshooting

### Build Falha
- Verifique sintaxe JSON de cada step
- Execute `npm run lint:json`
- Veja logs em `compiled/build.log`

### Step Não Aparece no Editor
- Confirme que arquivo existe em `steps/`
- Verifique `totalSteps` em `meta.json`
- Rebuild: `npm run build:templates`

### Dados Antigos no Editor
- Limpe cache: `localStorage.clear()`
- Force rebuild: `npm run build:templates -- --force`
- Reinicie dev server

## 📚 Recursos

- [Documentação Completa](../../docs/TEMPLATE_SYSTEM.md)
- [Guia de Contribuição](../../CONTRIBUTING.md)
- [Exemplos de Templates](../../examples/templates/)

---

**Versão:** 4.0.0  
**Última atualização:** 28/11/2025  
**Mantido por:** Sistema Quiz Flow Pro
