# 🚀 QUICK START - Quiz Flow Pro

> **Para desenvolvedores que estão começando no projeto**

## ⚡ Setup Rápido (5 minutos)

```bash
# 1. Clone e instale
git clone <repo>
cd quiz-flow-pro-verso
npm install

# 2. Configure ambiente
cp .env.example .env
# Edite .env com suas credenciais Supabase

# 3. Inicie o servidor
npm run dev

# 4. Acesse
# Editor: http://localhost:8080/editor
# Quiz: http://localhost:8080/quiz-estilo
```

---

## 🎯 ARQUITETURA SIMPLIFICADA

### Editor Canônico (ÚNICO A USAR)
```
📁 src/components/editor/quiz/QuizModularProductionEditor.tsx
└─ Editor principal com 47 componentes
└─ Acesso: /editor
└─ Status: ✅ PRODUÇÃO
```

### Components Registry
```
📁 src/components/editor/blocks/EnhancedBlockRegistry.tsx
└─ 150+ componentes mapeados
└─ Importação: import { getEnhancedBlockComponent } from '...'
```

### Property Schemas
```
📁 src/config/blockPropertySchemas.ts
└─ 84 schemas de propriedades
└─ Coverage: 100% dos componentes
```

### Template Master
```
📁 public/templates/quiz21-complete.json
└─ 21 steps consolidados
└─ 119 KB de templates
└─ Fonte de verdade única
```

---

## 📝 CHECKLIST DE DESENVOLVIMENTO

### Antes de Começar
- [ ] Li o DEPRECATED.md
- [ ] Entendi qual editor usar (QuizModularProductionEditor)
- [ ] Sei qual serviço usar (FunnelService)
- [ ] Configurei .env corretamente

### Durante o Desenvolvimento
- [ ] Estou usando TypeScript (sem @ts-nocheck)
- [ ] Estou usando o editor canônico
- [ ] Estou usando componentes do EnhancedBlockRegistry
- [ ] Meus componentes têm schemas em blockPropertySchemas.ts
- [ ] Testei no navegador antes de commitar

### Antes de Commitar
- [ ] `npm run lint` passou
- [ ] `npm run type-check` passou (se disponível)
- [ ] Removi console.logs desnecessários
- [ ] Adicionei comentários em código complexo
- [ ] Testei em Chrome E Firefox

---

## 🔧 COMANDOS ÚTEIS

```bash
# Desenvolvimento
npm run dev              # Inicia servidor (porta 8080)
npm run build            # Build de produção
npm run preview          # Preview do build

# Qualidade de Código
npm run lint             # Verifica erros de lint
npm run format           # Formata código (se disponível)

# Testes
npm test                 # Roda testes (Vitest)
npm run test:ui          # UI dos testes

# Análise
npm run analyze          # Analisa bundle size
```

---

## 🎨 ADICIONAR NOVO COMPONENTE

### 1. Criar Componente
```typescript
// src/components/editor/blocks/MeuNovoBlock.tsx
import React from 'react';

interface MeuNovoBlockProps {
  block: Block;
  properties?: any;
  content?: any;
  isSelected?: boolean;
  isPreviewing?: boolean;
}

const MeuNovoBlock: React.FC<MeuNovoBlockProps> = ({
  block,
  properties = {},
  content = {},
  isSelected,
  isPreviewing
}) => {
  return (
    <div className="p-4 border rounded-lg">
      <h3>{content.title || 'Título Padrão'}</h3>
      <p>{content.text || 'Texto aqui...'}</p>
    </div>
  );
};

export default MeuNovoBlock;
```

### 2. Registrar no Registry
```typescript
// src/components/editor/blocks/EnhancedBlockRegistry.tsx
import MeuNovoBlock from './MeuNovoBlock';

export const ENHANCED_BLOCK_REGISTRY: Record<string, ComponentType<any>> = {
  // ... outros componentes
  'meu-novo-block': MeuNovoBlock,
};
```

### 3. Adicionar Schema
```typescript
// src/config/blockPropertySchemas.ts
export const blockPropertySchemas: Record<string, PropertySchema> = {
  // ... outros schemas
  'meu-novo-block': {
    label: 'Meu Novo Bloco',
    fields: [
      {
        key: 'title',
        label: 'Título',
        type: 'text',
        group: 'content',
        defaultValue: 'Título Padrão',
      },
      {
        key: 'text',
        label: 'Texto',
        type: 'textarea',
        group: 'content',
        defaultValue: 'Digite o texto aqui...',
      },
    ],
  },
};
```

### 4. Adicionar à Biblioteca
```typescript
// src/components/editor/registry/EnhancedBlockRegistry.tsx
export const AVAILABLE_COMPONENTS: ComponentDefinition[] = [
  // ... outros componentes
  {
    type: 'meu-novo-block',
    label: 'Meu Novo Bloco',
    category: 'content', // ou: layout, visual, quiz, forms, action, result, offer, navigation, ai, advanced
    icon: 'FileText', // Nome do ícone Lucide
    description: 'Descrição breve do bloco',
    defaultContent: {
      title: 'Título Padrão',
      text: 'Texto aqui...',
    },
  },
];
```

### 5. Testar
```
1. npm run dev
2. Abra http://localhost:8080/editor
3. Procure "Meu Novo Bloco" no painel lateral
4. Arraste para o canvas
5. Clique para editar propriedades
6. Verifique se funciona ✅
```

---

## 🐛 SOLUÇÃO DE PROBLEMAS

### Servidor não inicia
```bash
# Limpar cache e reinstalar
rm -rf node_modules .vite
npm install
npm run dev
```

### TypeScript com muitos erros
```
❌ NÃO adicione @ts-nocheck!

✅ Corrija os tipos:
1. Verifique imports
2. Adicione tipos explícitos
3. Use 'any' apenas em último caso
4. Peça ajuda no Slack #tech-help
```

### Componente não aparece no editor
```
Checklist:
✅ Registrado em EnhancedBlockRegistry?
✅ Adicionado em AVAILABLE_COMPONENTS?
✅ Schema existe em blockPropertySchemas?
✅ Categoria está nas 11 categorias ativas?
✅ Servidor foi reiniciado?
```

### Componente não renderiza (placeholder amarelo)
```
Checklist:
✅ Nome do type corresponde ao registry?
✅ Componente exportado corretamente?
✅ Props esperadas estão corretas?
✅ Console do browser tem erros?
```

---

## 📚 RECURSOS IMPORTANTES

### Documentação Interna
- `DEPRECATED.md` - O que NÃO usar
- `ARQUITECTURA.md` - Visão geral da arquitetura (se existir)
- `CONTRIBUTING.md` - Guia de contribuição (se existir)

### Arquivos Críticos
```
src/components/editor/quiz/QuizModularProductionEditor.tsx  ← Editor principal
src/components/editor/blocks/EnhancedBlockRegistry.tsx      ← Registry de componentes
src/config/blockPropertySchemas.ts                          ← Schemas de propriedades
public/templates/quiz21-complete.json                       ← Template master
src/services/FunnelService.ts                               ← Serviço de funnels
```

### Stack Tecnológico
- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS + Radix UI
- **Build:** Vite 5.4
- **Backend:** Supabase (PostgreSQL)
- **State:** React Context + Hooks
- **DnD:** @dnd-kit
- **Icons:** Lucide React

---

## 💬 PRECISA DE AJUDA?

1. **Leia primeiro:** DEPRECATED.md
2. **Procure no código:** Use Ctrl+Shift+F
3. **Console do browser:** Sempre aberto
4. **Pergunte no Slack:** #tech-help
5. **Abra issue no GitHub:** Se for bug confirmado

---

## ✅ PRÓXIMOS PASSOS APÓS SETUP

### Dia 1: Familiarização
- [ ] Explorar /editor no navegador
- [ ] Arrastar componentes para o canvas
- [ ] Editar propriedades
- [ ] Ver como funciona o preview

### Dia 2: Primeiro Componente
- [ ] Criar um componente simples (seguir guia acima)
- [ ] Testar no editor
- [ ] Fazer PR com o componente

### Dia 3: Entender Fluxo
- [ ] Ler QuizModularProductionEditor.tsx
- [ ] Entender renderBlockPreview()
- [ ] Ver como props são passadas

### Semana 1: Contribuir
- [ ] Resolver 1 issue do backlog
- [ ] Melhorar 1 componente existente
- [ ] Documentar 1 feature não documentada

---

**Boa codificação! 🚀**

*Dúvidas? Abra issue ou pergunte no Slack*
