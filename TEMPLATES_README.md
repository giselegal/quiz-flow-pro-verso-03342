# 📚 Templates - Guia de Referência

**Última atualização:** 2025-11-06  
**Versão dos Templates:** 3.0  
**Status:** ✅ Estável e Validado

---

## 📋 Visão Geral

Este diretório contém os templates JSON que definem a estrutura e conteúdo dos funis de quiz. Os templates seguem a especificação v3.0 e são usados pelo QuizModularEditor para renderizar e editar os funis.

---

## 🏗️ Estrutura de Diretórios

```
public/templates/
├── quiz21-complete.json          # ⭐ Template Mestre (fonte da verdade)
├── step-01-v3.json               # Step individual: Introdução
├── step-02-v3.json               # Step individual: Pergunta 1
├── step-03-v3.json               # Step individual: Pergunta 2
├── ...                           # (Steps 04-18)
├── step-19-v3.json               # Step individual: Transição
├── step-20-v3.json               # Step individual: Resultado
├── step-21-v3.json               # Step individual: Oferta
├── blocks/                       # Blocos individuais (deprecated)
├── funnels/                      # Configurações de funis específicos
├── html/                         # Templates HTML para export
└── normalized/                   # Templates normalizados (cache)
```

---

## 🎯 Fonte da Verdade

### Template Mestre: `quiz21-complete.json`

**Este é o arquivo principal** que contém todos os 21 steps consolidados em um único JSON.

```json
{
  "templateVersion": "3.0",
  "templateId": "quiz21StepsComplete",
  "templateIdAlias": "quiz-estilo-21-steps",
  "name": "Quiz de Estilo Pessoal - 21 Etapas",
  "metadata": { ... },
  "steps": {
    "step-01": { ... },
    "step-02": { ... },
    ...
    "step-21": { ... }
  }
}
```

#### Características
- **Tamanho:** ~119 KB
- **Steps:** 21 completos
- **Blocos Totais:** 103
- **Última atualização:** Automática via scripts

#### Quando Usar
- ✅ Carregar todos os steps de uma vez
- ✅ Inicializar novo funil
- ✅ Sincronização e backup
- ✅ Fonte de referência para validação

---

## 📄 Templates Individuais (v3)

### Steps: `step-01-v3.json` até `step-21-v3.json`

Templates individuais para cada etapa do funil, usados para carregamento sob demanda (lazy loading).

#### Estrutura Padrão

```json
{
  "templateVersion": "3.0",
  "metadata": {
    "id": "step-XX",
    "name": "Nome da Etapa",
    "description": "Descrição",
    "category": "intro|question|transition|result|offer",
    "scoring": {
      "weight": 0-1,
      "timeLimit": 0-60,
      "hasCorrectAnswer": false,
      "speedBonusEnabled": false
    }
  },
  "type": "intro|question|transition|result|offer",
  "theme": { ... },
  "validation": { ... },
  "behavior": { ... },
  "navigation": {
    "nextStep": "step-XX"
  },
  "blocks": [
    {
      "id": "unique-block-id",
      "type": "block-type",
      "order": 0,
      "properties": { ... },
      "content": { ... }
    }
  ]
}
```

#### Quando Usar
- ✅ Lazy loading de steps no editor
- ✅ Otimização de performance (carregar só o necessário)
- ✅ Desenvolvimento e debug de steps individuais
- ✅ Edição isolada de um step

---

## 🔄 Sincronização

### Master → Individual

Quando o `quiz21-complete.json` é atualizado, os steps individuais devem ser sincronizados:

```bash
# Script de sincronização (automático)
npm run normalize:templates
npm run blocks:sync-master
```

### Individual → Master

Mudanças em steps individuais devem ser consolidadas no master:

```bash
# Script de consolidação (manual)
npm run build:templates
```

### ⚠️ IMPORTANTE
- **Edições manuais:** Fazer sempre em `quiz21-complete.json`
- **Scripts automáticos:** Sincronizam master → individual
- **Editor:** Salva no Supabase (funnels.config.steps), não nos arquivos

---

## 🧱 Tipos de Blocos

### Categorias e Tipos

#### 1. Header/Progress (5 tipos)
```typescript
- "quiz-intro-header"      // Header com logo e progress bar
- "question-progress"       // Progress bar da pergunta
- "intro-title"            // Título da introdução
- "intro-image"            // Imagem da introdução
- "intro-description"      // Descrição da introdução
```

#### 2. Conteúdo (8 tipos)
```typescript
- "question-title"         // Título da pergunta
- "question-hero"          // Hero da pergunta (imagem/título)
- "intro-form"             // Formulário de entrada (nome, email)
- "result-main"            // Resultado principal
- "result-description"     // Descrição do resultado
- "result-image"           // Imagem do resultado
- "transition-hero"        // Hero da transição
- "transition-text"        // Texto da transição
```

#### 3. Interativos (6 tipos)
```typescript
- "options-grid"           // Grid de opções (múltipla escolha)
- "CTAButton"              // Botão de ação
- "question-navigation"    // Navegação entre perguntas
- "result-cta"             // CTA no resultado
- "pricing"                // Tabela de preços
```

#### 4. Resultado (6 tipos)
```typescript
- "result-congrats"        // Parabéns/Celebração
- "result-progress-bars"   // Barras de progresso dos estilos
- "result-secondary-styles"// Estilos secundários
- "result-share"           // Compartilhamento social
- "quiz-score-display"     // Display de pontuação
- "offer-hero"             // Hero da oferta final
```

---

## 📊 Estrutura de Dados

### Metadata

```typescript
interface Metadata {
  id: string;                    // Identificador único
  name: string;                  // Nome legível
  description?: string;          // Descrição (opcional)
  category: "intro" | "question" | "transition" | "result" | "offer";
  tags?: string[];              // Tags para busca
  createdAt: string;            // ISO 8601 timestamp
  updatedAt: string;            // ISO 8601 timestamp
  author?: string;              // Autor
  version: string;              // Versão semântica
  scoring?: ScoringConfig;      // Configuração de pontuação
}
```

### Scoring Configuration

```typescript
interface ScoringConfig {
  weight: number;               // Peso da etapa (0-1)
  timeLimit: number;            // Limite de tempo (segundos)
  hasCorrectAnswer: boolean;    // Se há resposta correta
  speedBonusEnabled: boolean;   // Se bônus de velocidade está ativo
}
```

### Block Structure

```typescript
interface Block {
  id: string;                   // ID único do bloco
  type: string;                 // Tipo do bloco (ver lista acima)
  order: number;                // Ordem de renderização (0-based)
  properties?: Record<string, any>;  // Propriedades específicas do tipo
  content?: Record<string, any>;     // Conteúdo do bloco
  parentId?: string;            // ID do bloco pai (para aninhamento)
}
```

---

## 🔍 Validação

### Scripts de Validação

```bash
# Validar estrutura de todos os JSONs
npm run audit:jsons

# Validar apenas templates
npm run validate:templates

# Verificar esquema e hooks
npm run verificar-schema
```

### Regras de Validação

#### ✅ Obrigatórios
- `templateVersion` deve ser "3.0"
- `metadata.id` deve ser único
- `metadata.name` deve estar presente
- `blocks` deve ser um array
- Cada bloco deve ter `id`, `type` e `order`

#### ⚠️ Recomendados
- `metadata.description` para documentação
- `metadata.scoring` para etapas de pergunta
- `navigation.nextStep` para fluxo
- `validation.required` para campos obrigatórios

#### ❌ Proibidos
- IDs duplicados
- `order` duplicado ou negativo
- Tipos de bloco não suportados
- Referências circulares em `parentId`

---

## 🛠️ Desenvolvimento

### Criar Novo Template

1. **Copiar template base:**
   ```bash
   cp public/templates/step-02-v3.json public/templates/step-XX-v3.json
   ```

2. **Editar campos:**
   - Atualizar `metadata.id`
   - Atualizar `metadata.name`
   - Modificar `blocks` conforme necessário
   - Atualizar `navigation.nextStep`

3. **Validar:**
   ```bash
   npm run validate:templates
   ```

4. **Adicionar ao master:**
   ```bash
   # Editar quiz21-complete.json manualmente
   # OU usar script de consolidação
   npm run build:templates
   ```

### Editar Template Existente

1. **Editar o master:**
   ```
   Abra quiz21-complete.json
   Encontre "steps.step-XX"
   Faça suas alterações
   Salve o arquivo
   ```

2. **Sincronizar individuais:**
   ```bash
   npm run normalize:templates
   ```

3. **Validar:**
   ```bash
   npm run audit:jsons
   ```

---

## 🚀 Performance

### Estratégias de Carregamento

#### Lazy Loading (Recomendado)
```typescript
// Carregar apenas o step necessário
const step = await templateService.getStep('step-01');
```

#### Prefetch Crítico
```typescript
// Pré-carregar steps importantes
const criticalSteps = ['step-01', 'step-12', 'step-19', 'step-20', 'step-21'];
await templateService.prefetchSteps(criticalSteps);
```

#### Carregamento Completo (Evitar)
```typescript
// Evitar carregar tudo de uma vez
const allSteps = await templateService.loadAllSteps(); // ⚠️ 119 KB!
```

### Cache

```typescript
// React Query cache configurado para 60s
const { data } = useQuery({
  queryKey: ['step', stepId],
  queryFn: () => templateService.getStep(stepId),
  staleTime: 60_000, // 60 segundos
});
```

---

## 📦 Backup e Versionamento

### Política de Backup

- **Backups automáticos:** Criados antes de scripts destrutivos
- **Localização:** `.archive/templates/`
- **Formato:** `{filename}.backup-{timestamp}.json`
- **Retenção:** 30 dias

### Restaurar Backup

```bash
# Listar backups
ls .archive/templates/

# Restaurar específico
cp .archive/templates/quiz21-complete.backup-TIMESTAMP.json \
   public/templates/quiz21-complete.json
```

### Git History

```bash
# Ver histórico de um template
git log --follow public/templates/step-01-v3.json

# Ver mudanças em data específica
git log --since="2025-11-01" --until="2025-11-06" \
  -- public/templates/
```

---

## 🔧 Troubleshooting

### Problema: Template não carrega

**Sintomas:** Erro 404 ou null no editor

**Solução:**
```bash
# 1. Verificar se arquivo existe
ls -la public/templates/step-XX-v3.json

# 2. Validar JSON
npm run audit:jsons

# 3. Limpar cache
rm -rf .cache/templates/
```

### Problema: Blocos não renderizam

**Sintomas:** Canvas vazio ou blocos invisíveis

**Solução:**
```bash
# 1. Verificar estrutura de blocos
node scripts/diagnostic/blocks-audit.ts

# 2. Validar tipos de bloco
grep -r "type.*:" public/templates/step-XX-v3.json

# 3. Verificar registry
cat src/components/blocks/registry.ts
```

### Problema: Mudanças não aparecem

**Sintomas:** Edições não refletem no editor

**Solução:**
```bash
# 1. Limpar cache do navegador
# 2. Reiniciar dev server
npm run dev

# 3. Verificar HierarchicalSource
# Edições vão para Supabase, não para arquivos!
```

---

## 📚 Recursos Adicionais

### Documentação
- `AUDITORIA_COMPLETA_EDITOR_FUNIS_2025-11-06.md` - Auditoria completa
- `RESUMO_EXECUTIVO_AUDITORIA_2025-11-06.md` - Resumo executivo
- `AUDIT_QUIZ21_STEPS_COMPLETE_EDITOR.md` - Análise detalhada
- `README.md` - Documentação principal

### Scripts Úteis
```bash
npm run audit:jsons          # Auditar JSONs
npm run verificar            # Verificar estrutura
npm run normalize:templates  # Normalizar templates
npm run build:templates      # Consolidar templates
npm run validate:templates   # Validar estrutura
```

### Suporte
- **Issues:** GitHub Issues
- **Documentação:** `/docs` directory
- **Código:** `/src/components/editor`

---

## 📋 Checklist de Qualidade

Antes de commitar mudanças em templates:

- [ ] JSON válido (sem erros de sintaxe)
- [ ] `templateVersion` é "3.0"
- [ ] `metadata.id` é único
- [ ] Todos os blocos têm `id`, `type` e `order`
- [ ] Não há IDs duplicados
- [ ] `navigation.nextStep` está correto
- [ ] Executado `npm run audit:jsons` com sucesso
- [ ] Sincronizado master ↔ individual se necessário
- [ ] Testado no editor (dev mode)
- [ ] Documentado mudanças significativas

---

**Mantido por:** Equipe de Desenvolvimento  
**Contato:** GitHub Issues  
**Última revisão:** 2025-11-06
