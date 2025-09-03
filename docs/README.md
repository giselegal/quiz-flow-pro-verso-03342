# Quiz Quest Challenge Verse

Um sistema completo de criação e edição de quizzes interativos com drag & drop, construído em React/TypeScript.

## 🚀 Funcionalidades Principais

### Editor Visual Avançado

- **Drag & Drop:** Sistema completo de arrastar e soltar componentes
- **Layout Responsivo:** 4 colunas adaptáveis (Etapas, Componentes, Canvas, Propriedades)
- **Preview Mode:** Visualização em tempo real
- **Viewport Adaptável:** sm, md, lg, xl
- **Atalhos de Teclado:** Undo/Redo, Delete, etc.

### Sistema de Componentes

- **50+ Componentes:** Blocos predefinidos para construção de funis
- **Propriedades Universais:** Painel dinâmico de configuração
- **Registry System:** Sistema de registro de componentes extensível
- **Validação:** Validação em tempo real de propriedades

### Gestão de Funis

- **Multi-etapas:** Sistema completo de stages/etapas
- **Estado Persistente:** Context API para gerenciamento centralizado
- **Auto-save:** Salvamento automático de alterações
- **Histórico:** Sistema de undo/redo para propriedades

## 🏗️ Estrutura do Projeto

```
src/
├── components/           # Componentes React
│   ├── blocks/          # Blocos de conteúdo
│   ├── editor/          # Editor visual
│   ├── quiz-builder/    # Construtor de quiz
│   └── ui/              # Componentes de interface
├── context/             # Context API
├── hooks/               # Custom hooks
├── pages/               # Páginas da aplicação
├── types/               # Definições TypeScript
└── config/              # Configurações
```

## 🎯 Componente Principal

O editor principal está localizado em:

- **Página:** `src/pages/editor-fixed.tsx`
- **Implementação:** `src/pages/editor-fixed-dragdrop.tsx`

Este é o componente mais completo e funcional do sistema, incluindo todas as funcionalidades avançadas.

## 🛠️ Tecnologias

- **React 18** com TypeScript
- **Tailwind CSS** para estilização
- **Framer Motion** para animações
- **React DnD** para drag & drop
- **Context API** para gerenciamento de estado
- **Vite** como build tool

## 📚 Documentação

- [Arquitetura (central)](./ARCHITECTURE.md)
- [Editores principais](./EDITORS.md)
- [Fluxo 21 etapas (flowchart)](./21-steps-flowchart.md)
- [Fluxo 21 etapas (sequence)](./21-steps-sequence.md)
- [Mapa de código 21 etapas](./21-steps-code-map.md)
- **Análises:** `docs/analysis/` - Análises técnicas detalhadas
- **Exemplos:** `docs/examples/` - Snippets e exemplos práticos
- **Scripts:** `scripts/` - Scripts de automação e análise

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📝 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run preview` - Preview do build
- `npm run lovable:prepare` - Preparação para deploy

## 🏆 Características Técnicas

### Performance

- **Code Splitting:** Carregamento otimizado
- **Lazy Loading:** Componentes sob demanda
- **Memoização:** React.memo e useMemo estratégicos

### Qualidade de Código

- **TypeScript:** Tipagem completa
- **ESLint:** Linting automatizado
- **Prettier:** Formatação consistente
- **Estrutura Modular:** Separação clara de responsabilidades

### UX/UI

- **Design System:** Componentes consistentes
- **Responsividade:** Adaptação completa a devices
- **Acessibilidade:** Suporte a screen readers
- **Performance Visual:** Animações suaves

---

Desenvolvido com ❤️ para criação de funis de conversão eficazes.
