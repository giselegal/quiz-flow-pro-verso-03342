# 🎯 GUIA COMPLETO - Persistência do Canvas

## 📋 Visão Geral

Sistema completo para **persistir mudanças do canvas no quiz21-complete.json**, incluindo:

- ✅ Reordenação de blocos (drag & drop)
- ✅ Adição de novos blocos
- ✅ Remoção de blocos
- ✅ Edição de propriedades
- ✅ Auto-save inteligente
- ✅ Sistema de backups automáticos
- ✅ Gerador CLI de steps

---

## 🛠️ Ferramentas Criadas

### 1. **Step Generator** (CLI)
**Arquivo**: `scripts/step-generator.mjs`

Ferramenta de linha de comando para manipular steps do template.

#### Comandos Disponíveis:

```bash
# Listar todos os steps
node scripts/step-generator.mjs list

# Adicionar nova pergunta
node scripts/step-generator.mjs add-question --number 22 --title "Qual seu hobby favorito?"

# Adicionar pergunta estratégica
node scripts/step-generator.mjs add-question --number 13 --title "Estratégia" --strategic

# Adicionar step de introdução
node scripts/step-generator.mjs add-intro --number 1 --title "Bem-vindo"

# Adicionar transição
node scripts/step-generator.mjs add-transition --number 12 --message "Analisando..."

# Adicionar resultado
node scripts/step-generator.mjs add-result --number 20 --title "Seu Resultado"

# Adicionar bloco a step existente
node scripts/step-generator.mjs add-block --step 5 --type question-progress --position 0

# Reordenar steps
node scripts/step-generator.mjs reorder --from 10 --to 8

# Ver ajuda
node scripts/step-generator.mjs help
```

#### Tipos de Blocos Disponíveis:

- `intro-form` - Formulário de introdução (captura nome)
- `question-title` - Título da pergunta
- `question-multiple-choice` - Opções de múltipla escolha
- `question-progress` - Barra de progresso
- `question-navigation` - Botões de navegação
- `transition-loader` - Animação de transição
- `result-main` - Resultado principal
- `result-cta` - Call-to-action
- `result-share` - Botões de compartilhamento
- `result-progress-bars` - Barras de progresso do resultado

---

### 2. **Template Persistence Service**
**Arquivo**: `src/services/persistence/TemplatePersistenceService.ts`

Serviço responsável por persistir mudanças em tempo real.

#### Funcionalidades:

```typescript
import { templatePersistence } from '@/services/persistence/TemplatePersistenceService';

// Salvar reordenação de blocos
await templatePersistence.saveBlockReorder('step-05', blocks);

// Adicionar bloco
await templatePersistence.saveBlockAdd('step-05', newBlock, 2);

// Remover bloco
await templatePersistence.saveBlockRemove('step-05', 'block-id');

// Atualizar propriedades
await templatePersistence.saveBlockUpdate('step-05', 'block-id', { title: 'Novo Título' });

// Forçar save imediato
await templatePersistence.forceSave();

// Verificar mudanças pendentes
console.log(templatePersistence.hasPendingChanges()); // true/false
console.log(templatePersistence.getPendingChangesCount()); // número
```

#### Auto-Save:

O serviço possui **auto-save automático** em desenvolvimento:
- Intervalo: 10 segundos
- Só salva se houver mudanças pendentes
- Dispara eventos customizados (`template-saved`, `template-save-error`)

---

### 3. **API Backend**
**Arquivo**: `src/api/templates.ts`

Endpoints REST para manipular o template.

#### Endpoints:

```bash
# Salvar template completo
POST http://localhost:3001/api/templates/save
Body: { "id": "quiz21", "steps": [...] }

# Aplicar mudanças incrementais
POST http://localhost:3001/api/templates/apply-changes
Body: { "changes": [{ "type": "reorder", "stepId": "step-05", "blocks": [...] }] }

# Obter template atual
GET http://localhost:3001/api/templates/current

# Listar backups
GET http://localhost:3001/api/templates/backups

# Restaurar backup
POST http://localhost:3001/api/templates/restore
Body: { "filename": "quiz21-complete-2025-01-15T10-30-00.json" }

# Health check
GET http://localhost:3001/health
```

---

### 4. **Dev Server**
**Arquivo**: `scripts/dev-server.mjs`

Servidor Express para desenvolvimento.

#### Iniciar:

```bash
# Opção 1: Comando direto
node scripts/dev-server.mjs

# Opção 2: Via package.json (adicione o script)
npm run dev:api
```

#### Configuração:

```bash
# Porta padrão: 3001
# Alterar porta:
API_PORT=4000 node scripts/dev-server.mjs
```

---

## 🚀 Como Usar

### Cenário 1: Reordenar Blocos no Canvas

1. **Arraste um bloco no canvas**
2. O drag & drop dispara `handleDragEnd` → `actions.reorderBlocks`
3. `PureBuilderProvider` chama `templatePersistence.saveBlockReorder()`
4. A mudança fica pendente no auto-save queue
5. Após 10 segundos, a mudança é aplicada automaticamente
6. Um backup é criado antes de salvar

**Resultado**: A ordem dos blocos é salva no `quiz21-complete.json`

---

### Cenário 2: Adicionar Novo Step via CLI

```bash
# 1. Adicionar nova pergunta
node scripts/step-generator.mjs add-question --number 22 --title "Qual seu filme favorito?"

# Resultado no terminal:
# ✅ Step step-22 adicionado: Qual seu filme favorito?

# 2. Verificar
node scripts/step-generator.mjs list

# Resultado:
# 22. step-22 - Qual seu filme favorito? (question)
#    └─ 4 blocos: question-progress, question-title, question-multiple-choice, question-navigation
```

**Resultado**: Novo step adicionado ao JSON com estrutura completa

---

### Cenário 3: Adicionar Bloco a Step Existente

```bash
# Adicionar barra de progresso ao step 5 (na primeira posição)
node scripts/step-generator.mjs add-block --step 5 --type question-progress --position 0

# Resultado:
# ✅ Bloco question-progress adicionado ao step step-05
```

**Resultado**: Novo bloco inserido no step especificado

---

### Cenário 4: Restaurar Backup

```bash
# 1. Listar backups disponíveis
curl http://localhost:3001/api/templates/backups

# Resultado:
# {
#   "backups": [
#     { "filename": "quiz21-complete-2025-01-15T14-30-00.json", "timestamp": "2025-01-15T14-30-00" },
#     { "filename": "quiz21-complete-2025-01-15T10-00-00.json", "timestamp": "2025-01-15T10-00-00" }
#   ]
# }

# 2. Restaurar backup específico
curl -X POST http://localhost:3001/api/templates/restore \
  -H "Content-Type: application/json" \
  -d '{"filename": "quiz21-complete-2025-01-15T10-00-00.json"}'

# Resultado:
# ✅ Restored from quiz21-complete-2025-01-15T10-00-00.json
```

**Resultado**: Template restaurado para versão anterior

---

## 🔧 Integração com PureBuilderProvider

O `PureBuilderProvider` já está integrado com a persistência:

```tsx
// src/components/editor/PureBuilderProvider.tsx (linha 694)

reorderBlocks: useCallback(async (stepKey: string, oldIndex: number, newIndex: number) => {
  setState(prev => {
    const stepBlocks = [...(prev.stepBlocks[stepKey] || [])];
    const [movedBlock] = stepBlocks.splice(oldIndex, 1);
    stepBlocks.splice(newIndex, 0, movedBlock);
    
    // 💾 Persistir mudança automaticamente
    templatePersistence.saveBlockReorder(stepKey, stepBlocks).catch(console.error);
    
    return {
      ...prev,
      stepBlocks: { ...prev.stepBlocks, [stepKey]: stepBlocks }
    };
  });
}, []),
```

**Comportamento**:
- Drag & drop no canvas → Estado local React atualizado
- `templatePersistence.saveBlockReorder()` chamado automaticamente
- Mudança entra na fila de auto-save
- Após 10 segundos, mudança é aplicada ao JSON
- Backup automático criado antes de salvar

---

## 📦 Sistema de Backups

### Localização:
```
public/templates/backups/
  ├── quiz21-complete-2025-01-15T14-30-00.json
  ├── quiz21-complete-2025-01-15T10-00-00.json
  └── quiz21-complete-2025-01-14T18-45-00.json
```

### Criação Automática:
- Backup criado **antes de cada save**
- Formato: `quiz21-complete-{ISO_TIMESTAMP}.json`
- Ordenação: Mais recente primeiro

### Gerenciamento:
```bash
# Listar backups
GET /api/templates/backups

# Restaurar backup
POST /api/templates/restore
Body: { "filename": "quiz21-complete-2025-01-15T10-00-00.json" }
```

---

## 🎯 Resolução do Problema Original

### ❌ Problema Antes:

1. Usuário arrasta bloco no canvas → Estado React atualizado
2. Recarrega página → **Mudanças perdidas** (JSON não foi atualizado)
3. Adicionar novo step → **Precisa editar JSON manualmente**
4. Reordenar steps → **Erro-prone, manual**

### ✅ Solução Agora:

1. **Drag & Drop**: Persiste automaticamente via auto-save (10s)
2. **Adicionar Steps**: CLI generator com templates prontos
3. **Reordenar Steps**: `node scripts/step-generator.mjs reorder --from X --to Y`
4. **Backups Automáticos**: Proteção contra perda de dados
5. **API REST**: Integração com ferramentas externas

---

## 🚦 Status Atual

### ✅ Implementado:

- [x] Step Generator CLI completo
- [x] Template Persistence Service
- [x] API Backend com 6 endpoints
- [x] Dev Server Express
- [x] Integração com PureBuilderProvider
- [x] Auto-save inteligente (10s)
- [x] Sistema de backups automáticos
- [x] Documentação completa

### 🔄 Próximos Passos (Opcional):

- [ ] UI para gerenciar backups
- [ ] Preview de diferenças antes de restaurar
- [ ] Sincronização com Supabase
- [ ] Versionamento Git automático
- [ ] Undo/Redo com histórico de mudanças

---

## 📚 Exemplos Práticos

### Exemplo 1: Workflow Completo de Edição

```bash
# 1. Iniciar dev server
node scripts/dev-server.mjs

# 2. Em outro terminal, iniciar Vite
npm run dev

# 3. Abrir canvas no navegador
# http://localhost:5173/editor

# 4. Arrastar blocos no canvas
# → Auto-save aplica mudanças em 10s
# → Backup criado automaticamente

# 5. Adicionar novo step via CLI
node scripts/step-generator.mjs add-question --number 23 --title "Nova Pergunta"

# 6. Recarregar página
# → Novo step aparece no canvas!
```

### Exemplo 2: Criar Quiz do Zero

```bash
# 1. Intro
node scripts/step-generator.mjs add-intro --number 1 --title "Bem-vindo"

# 2. Perguntas (2-11)
for i in {2..11}; do
  node scripts/step-generator.mjs add-question --number $i --title "Pergunta $((i-1))"
done

# 3. Transição
node scripts/step-generator.mjs add-transition --number 12 --message "Processando..."

# 4. Perguntas estratégicas (13-19)
for i in {13..19}; do
  node scripts/step-generator.mjs add-question --number $i --title "Estratégia $((i-12))" --strategic
done

# 5. Resultado
node scripts/step-generator.mjs add-result --number 20 --title "Seu Resultado"

# 6. Verificar
node scripts/step-generator.mjs list
```

---

## 🐛 Troubleshooting

### Problema: Auto-save não está funcionando

**Solução**:
```bash
# Verificar se dev server está rodando
curl http://localhost:3001/health

# Verificar console do navegador
# Deve aparecer: "⏰ [Persistence] Auto-save ativado (intervalo: 10000ms)"
```

### Problema: Mudanças não aparecem após recarregar

**Solução**:
```bash
# 1. Verificar se há mudanças pendentes
# Console: templatePersistence.getPendingChangesCount()

# 2. Forçar save imediato
# Console: await templatePersistence.forceSave()

# 3. Verificar arquivo
cat public/templates/quiz21-complete.json | grep "step-05"
```

### Problema: Step Generator não encontra template

**Solução**:
```bash
# Verificar caminho do template
ls -la public/templates/quiz21-complete.json

# Executar do diretório raiz do projeto
cd /workspaces/quiz-flow-pro-verso-03342
node scripts/step-generator.mjs list
```

---

## 📊 Monitoramento

### Events Customizados:

```javascript
// Escutar evento de save bem-sucedido
window.addEventListener('template-saved', (e) => {
  console.log('✅ Template salvo:', e.detail.timestamp);
});

// Escutar erros
window.addEventListener('template-save-error', (e) => {
  console.error('❌ Erro ao salvar:', e.detail.error);
});
```

### Logs:

```bash
# Backend (dev-server.mjs)
[2025-01-15T14:30:00.000Z] - POST /api/templates/apply-changes
📦 Backup criado: public/templates/backups/quiz21-complete-2025-01-15T14-30-00.json
✅ Template salvo: public/templates/quiz21-complete.json

# Frontend (console)
⏰ [Persistence] Auto-save ativado (intervalo: 10000ms)
🔄 [Persistence] Salvando reordenação do step step-05
⏰ [Persistence] Executando auto-save...
🔄 [Persistence] Aplicando 1 mudanças pendentes...
✅ [Persistence] Mudanças aplicadas com sucesso
```

---

## 🎉 Conclusão

O sistema de persistência está **completo e funcional**! Agora você pode:

✅ **Arrastar e soltar blocos** → Salva automaticamente
✅ **Adicionar novos steps** → Via CLI ou API
✅ **Reordenar steps** → Via CLI
✅ **Recuperar versões anteriores** → Sistema de backups
✅ **Integração perfeita** → PureBuilderProvider + API Backend

**Todas as mudanças no canvas agora persistem no JSON!** 🚀
