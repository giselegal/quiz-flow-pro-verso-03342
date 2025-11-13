# 🤝 Guia de Contribuição - Quiz Flow Pro

Obrigado por considerar contribuir para o Quiz Flow Pro! Este documento contém diretrizes para garantir um processo de contribuição suave e eficiente.

---

## 📋 Índice

1. [Código de Conduta](#código-de-conduta)
2. [Como Começar](#como-começar)
3. [Estrutura do Projeto](#estrutura-do-projeto)
4. [Padrões de Código](#padrões-de-código)
5. [Processo de Desenvolvimento](#processo-de-desenvolvimento)
6. [Commits Semânticos](#commits-semânticos)
7. [Testes](#testes)
8. [Pull Requests](#pull-requests)

---

## 📜 Código de Conduta

- Seja respeitoso e profissional
- Aceite feedback construtivo
- Foque no que é melhor para o projeto
- Mantenha discussões técnicas e objetivas

---

## 🚀 Como Começar

### 1. Setup do Ambiente

```bash
# Clone o repositório
git clone https://github.com/giselegal/quiz-flow-pro-verso-03342.git
cd quiz-flow-pro-verso-03342

# Instale dependências
npm install

# Execute em desenvolvimento
npm run dev

# Execute testes
npm test
```

### 2. Estrutura de Branches

- `main` - Branch principal (produção)
- `develop` - Branch de desenvolvimento
- `feature/nome-da-feature` - Novas funcionalidades
- `fix/nome-do-fix` - Correções de bugs
- `refactor/nome-da-refatoracao` - Refatorações
- `docs/nome-da-doc` - Atualizações de documentação

---

## 🏗️ Estrutura do Projeto

### Diretórios Principais

```
src/
├── components/       # Componentes React reutilizáveis
├── pages/           # Páginas da aplicação
├── services/        # Lógica de negócio e APIs
├── hooks/           # Custom React hooks
├── contexts/        # Context API providers
├── lib/             # Utilitários e helpers
├── types/           # Definições TypeScript
├── config/          # Arquivos de configuração
└── templates/       # Templates de funis
```

### Componentes

- **Atômicos**: Componentes mínimos (botões, inputs)
- **Moleculares**: Combinação de atômicos (forms, cards)
- **Organismos**: Seções complexas (header, sidebar)
- **Templates**: Layouts de página

---

## 📝 Padrões de Código

### TypeScript

```typescript
// ✅ BOM - Tipos explícitos
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<User> {
  // ...
}

// ❌ EVITAR - any ou @ts-nocheck
function getUser(id: any): any {  // Não fazer isso
  // ...
}
```

### React Components

```typescript
// ✅ BOM - Componente funcional tipado
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ label, onClick, variant = 'primary' }) => {
  return (
    <button onClick={onClick} className={`btn btn-${variant}`}>
      {label}
    </button>
  );
};

// ❌ EVITAR - Componente sem tipos
export const Button = (props) => {  // Não fazer isso
  return <button>{props.label}</button>;
};
```

### Naming Conventions

- **Componentes**: PascalCase (`QuizModularEditor`)
- **Funções/Variáveis**: camelCase (`getUserData`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)
- **Arquivos**: kebab-case (`user-profile.tsx`)
- **Interfaces**: PascalCase com prefixo I opcional (`UserData` ou `IUserData`)

### Organização de Imports

```typescript
// 1. Imports externos
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Imports internos (aliases)
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

// 3. Imports relativos
import { helper } from './utils';

// 4. Tipos
import type { User } from '@/types/user';
```

### Path Aliases

O projeto utiliza path aliases configurados para facilitar imports e refatoração. **Sempre prefira path aliases ao invés de imports relativos profundos.**

#### Aliases Disponíveis

| Alias | Resolve para | Uso |
|-------|--------------|-----|
| `@/*` | `src/*` | Acesso geral à pasta src |
| `@components/*` | `src/components/*` | Componentes React |
| `@services/*` | `src/services/*` | Serviços e lógica de negócio |
| `@hooks/*` | `src/hooks/*` | React hooks customizados |
| `@utils/*` | `src/utils/*` | Funções utilitárias |
| `@lib/*` | `src/lib/*` | Bibliotecas e helpers |
| `@types/*` | `src/types/*` | Definições de tipos TypeScript |
| `@config/*` | `src/config/*` | Configurações da aplicação |
| `@templates/*` | `src/templates/*` | Templates de quiz |

#### Exemplos de Uso

```typescript
// ✅ BOM - Usando path aliases
import { Button } from '@components/ui/button';
import { useAuth } from '@hooks/useAuth';
import { formatDate } from '@utils/date';
import { templateService } from '@services/canonical/TemplateService';
import type { User } from '@types/user';

// ❌ EVITAR - Imports relativos profundos
import { Button } from '../../../components/ui/button';
import { useAuth } from '../../../../hooks/useAuth';
import { formatDate } from '../../../utils/date';
```

#### Benefícios

- ✅ **Legibilidade**: Imports claros e autodocumentados
- ✅ **Refatoração**: Mover arquivos não quebra imports
- ✅ **Autocomplete**: IDEs fornecem melhor sugestão
- ✅ **Manutenção**: Mais fácil encontrar dependências

---

## 🔄 Processo de Desenvolvimento

### 1. Criar Branch

```bash
git checkout main
git pull origin main
git checkout -b feature/minha-feature
```

### 2. Desenvolver

- Faça alterações pequenas e focadas
- Teste localmente com `npm run dev`
- Adicione testes se necessário
- Mantenha commits atômicos

### 3. Validar

```bash
# Verificar tipos
npm run type-check

# Executar testes
npm test

# Build de produção
npm run build

# Lint
npm run lint
```

### 4. Commit

```bash
git add .
git commit -m "feat: adiciona nova funcionalidade X"
```

### 5. Push e PR

```bash
git push origin feature/minha-feature
# Abra PR no GitHub
```

---

## 📦 Commits Semânticos

Seguimos [Conventional Commits](https://www.conventionalcommits.org/).

### Tipos de Commit

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| `feat` | Nova funcionalidade | `feat: adiciona botão de exportar PDF` |
| `fix` | Correção de bug | `fix: corrige cálculo de pontuação` |
| `refactor` | Refatoração de código | `refactor: simplifica lógica de validação` |
| `perf` | Melhoria de performance | `perf: otimiza carregamento de imagens` |
| `docs` | Documentação | `docs: atualiza README com novos comandos` |
| `test` | Testes | `test: adiciona testes para UserService` |
| `chore` | Manutenção | `chore: atualiza dependências` |
| `style` | Formatação | `style: corrige indentação` |
| `ci` | CI/CD | `ci: adiciona workflow de deploy` |

### Formato

```
<tipo>(<escopo>): <descrição curta>

<corpo opcional com detalhes>

<footer opcional com breaking changes ou issues>
```

### Exemplos

```bash
# Simples
feat: adiciona campo de busca no dashboard

# Com escopo
fix(editor): corrige erro ao salvar template

# Com corpo
refactor(services): consolida FunnelService

Remove duplicação de código entre FunnelService,
FunnelUnifiedService e ContextualFunnelService.
Mantém apenas FunnelService com toda funcionalidade.

# Com breaking change
feat!: muda estrutura de dados do template

BREAKING CHANGE: O formato de template agora usa
estrutura hierárquica. Templates antigos precisam
ser migrados com o script migrate-templates.sh
```

---

## 🧪 Testes

### Estrutura de Testes

```
src/
├── __tests__/
│   ├── unit/           # Testes unitários
│   ├── integration/    # Testes de integração
│   └── e2e/           # Testes end-to-end
```

### Testes Unitários

```typescript
import { describe, it, expect } from 'vitest';
import { calculateScore } from './score-calculator';

describe('calculateScore', () => {
  it('deve calcular pontuação corretamente', () => {
    const result = calculateScore({ correct: 8, total: 10 });
    expect(result).toBe(80);
  });

  it('deve retornar 0 para respostas vazias', () => {
    const result = calculateScore({ correct: 0, total: 10 });
    expect(result).toBe(0);
  });
});
```

### Testes de Componentes

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('deve renderizar com label correto', () => {
    render(<Button label="Click me" onClick={() => {}} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('deve chamar onClick quando clicado', () => {
    const handleClick = vi.fn();
    render(<Button label="Click me" onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Coverage Mínimo

- **Serviços críticos**: 80% coverage
- **Componentes UI**: 60% coverage
- **Utilitários**: 90% coverage

### Executar Testes

```bash
# Todos os testes
npm test

# Testes específicos
npm test -- src/__tests__/unit/score-calculator.test.ts

# Com coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

---

## 🔀 Pull Requests

### Checklist antes de abrir PR

- [ ] Código segue os padrões estabelecidos
- [ ] Tipos TypeScript estão corretos (sem `any` ou `@ts-nocheck`)
- [ ] Testes adicionados/atualizados
- [ ] `npm test` passa sem erros
- [ ] `npm run build` passa sem erros
- [ ] Documentação atualizada se necessário
- [ ] Commits seguem padrão semântico

### Template de PR

```markdown
## 📝 Descrição

Breve descrição das mudanças realizadas.

## 🎯 Motivação

Por que estas mudanças são necessárias?

## 🔗 Issues Relacionadas

Fixes #123
Relates to #456

## 🧪 Como Testar

1. Execute `npm run dev`
2. Navegue até `/editor`
3. Teste funcionalidade X

## 📸 Screenshots

(Se aplicável)

## ✅ Checklist

- [ ] Testes passando
- [ ] Build sem erros
- [ ] Documentação atualizada
- [ ] Code review realizado
```

### Review Process

1. **Automated Checks**: CI/CD verifica testes e build
2. **Code Review**: Pelo menos 1 aprovação necessária
3. **Testing**: Revisor testa mudanças localmente
4. **Merge**: Squash and merge para manter histórico limpo

---

## 🐛 Reportando Bugs

### Template de Issue

```markdown
## 🐛 Descrição do Bug

Descrição clara do problema.

## 🔄 Passos para Reproduzir

1. Vá para '...'
2. Clique em '...'
3. Veja o erro

## ✅ Comportamento Esperado

O que deveria acontecer.

## ❌ Comportamento Atual

O que está acontecendo.

## 🖥️ Ambiente

- OS: [ex: Windows 10]
- Browser: [ex: Chrome 120]
- Versão: [ex: 1.0.0]

## 📸 Screenshots

(Se aplicável)

## 📝 Logs

```
Cole logs relevantes aqui
```
```

---

## 💡 Sugerindo Features

### Template de Feature Request

```markdown
## 🚀 Feature Request

Descrição clara da feature desejada.

## 🎯 Problema que Resolve

Que problema esta feature resolve?

## 💭 Solução Proposta

Como você imagina que funcionaria?

## 🔄 Alternativas Consideradas

Outras abordagens que você pensou?

## 📊 Impacto

Quantos usuários seriam beneficiados?
```

---

## 📚 Recursos Úteis

### Documentação Interna
- [README.md](../README.md) - Visão geral do projeto
- [docs/INDEX.md](../docs/INDEX.md) - Índice de documentação
- [RESUMO_EXECUTIVO_ANALISE.md](../RESUMO_EXECUTIVO_ANALISE.md) - Análise técnica

### Documentação Externa
- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vitest Documentation](https://vitest.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 🙏 Agradecimentos

Obrigado por contribuir para o Quiz Flow Pro! Sua ajuda torna este projeto melhor. 🎉

---

**Dúvidas?** Abra uma issue ou entre em contato com o time de desenvolvimento.

*Última atualização: 09 de Novembro de 2025*
