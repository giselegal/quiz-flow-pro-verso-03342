# Templates

Diretório de templates do sistema.

## Estrutura

```
templates/
├── quiz21-v4.json     # Template principal v4.0 (canonical)
├── html/              # Componentes HTML inline
└── README.md
```

## Template Principal

- **quiz21-v4.json**: Template v4.0 seguindo boas práticas:
  - Schema validado com Zod
  - Metadata completo
  - Theme configurável
  - Settings estruturado
  - Blocos tipados

## Uso

```typescript
import { TEMPLATE_PATHS } from '@/config/template-paths';

const templatePath = TEMPLATE_PATHS.V4_SAAS; // /templates/quiz21-v4.json
```
