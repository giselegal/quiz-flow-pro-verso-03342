# Migração do Sistema de Logging

## Guia de Migração dos Logs Existentes

### 1. Padrão Antigo vs Novo

#### Antes (console.log)
```javascript
// Logging básico
console.log('User clicked button');
console.warn('Performance degraded');
console.error('API request failed', error);

// Logging com contexto informal
console.log('[QuizEditor]', 'Quiz saved successfully', { id: quizId });
console.debug('[Storage]', 'LocalStorage updated');
```

#### Depois (LoggerService)
```javascript
import { getLogger } from '../utils/logging';

const logger = getLogger();

// Logging estruturado
logger.info('ui', 'User clicked button');
logger.warn('performance', 'Performance degraded');
logger.error('api', 'API request failed', { error });

// Contexto específico
logger.info('quiz-editor', 'Quiz saved successfully', { id: quizId });
logger.debug('storage', 'LocalStorage updated');
```

### 2. Padrões de Migração por Contexto

#### Editor de Quiz
```javascript
// Antes
console.log('Quiz editor initialized');
console.error('Failed to load quiz', error);

// Depois
const logger = getLogger();
logger.info('quiz-editor', 'Quiz editor initialized');
logger.error('quiz-editor', 'Failed to load quiz', { error });
```

#### Sistema de Storage
```javascript
// Antes
console.debug('Saving to localStorage', data);
console.warn('localStorage quota exceeded');

// Depois
const logger = getLogger();
logger.debug('storage', 'Saving to localStorage', { data });
logger.warn('storage', 'localStorage quota exceeded');
```

#### API e Network
```javascript
// Antes
console.log('Making API request', endpoint);
console.error('API request failed', response.status);

// Depois
const logger = getLogger();
logger.info('api', 'Making API request', { endpoint });
logger.error('api', 'API request failed', { status: response.status });
```

#### Performance Monitoring
```javascript
// Antes
const start = performance.now();
// ... código ...
console.log('Operation took', performance.now() - start, 'ms');

// Depois
const logger = getLogger();
const timer = logger.startTimer('operation');
// ... código ...
timer.end('Operation completed');
```

### 3. Contextos Padronizados

| Contexto | Uso |
|----------|-----|
| `ui` | Interações do usuário, eventos de UI |
| `quiz-editor` | Editor de quiz específico |
| `storage` | Operações de storage (localStorage, sessionStorage) |
| `api` | Requests e responses de API |
| `auth` | Autenticação e autorização |
| `routing` | Navegação e roteamento |
| `performance` | Métricas de performance |
| `error` | Erros globais e exceções |
| `debug` | Debugging e desenvolvimento |

### 4. Migração por Componente

#### React Components
```javascript
// Antes
import React from 'react';

function QuizEditor() {
  console.log('QuizEditor mounted');
  
  const handleSave = () => {
    console.log('Saving quiz...');
  };
}

// Depois
import React from 'react';
import { useLogger } from '../utils/logging';

function QuizEditor() {
  const logger = useLogger();
  
  React.useEffect(() => {
    logger.info('quiz-editor', 'QuizEditor mounted');
  }, []);
  
  const handleSave = () => {
    logger.info('quiz-editor', 'Saving quiz...');
  };
}
```

#### Services e Utilities
```javascript
// Antes
class ApiService {
  async fetchData(url) {
    console.log('Fetching', url);
    try {
      const response = await fetch(url);
      console.log('Response received', response.status);
      return response.json();
    } catch (error) {
      console.error('Fetch failed', error);
      throw error;
    }
  }
}

// Depois
import { getLogger } from '../utils/logging';

class ApiService {
  private logger = getLogger();
  
  async fetchData(url) {
    const timer = this.logger.startTimer('api-fetch');
    this.logger.info('api', 'Fetching data', { url });
    
    try {
      const response = await fetch(url);
      this.logger.info('api', 'Response received', { 
        url, 
        status: response.status 
      });
      
      const data = await response.json();
      timer.end('Data fetched successfully');
      return data;
    } catch (error) {
      this.logger.error('api', 'Fetch failed', { url, error });
      timer.end('Fetch failed');
      throw error;
    }
  }
}
```

### 5. Configuração por Ambiente

#### Development
```javascript
// Todos os logs habilitados
const logger = LoggerFactory.createDevelopmentLogger();
```

#### Production
```javascript
// Apenas WARN e ERROR
const logger = LoggerFactory.createProductionLogger();
```

#### Testing
```javascript
// Apenas ERROR, sem storage
const logger = LoggerFactory.createTestLogger();
```

### 6. Script de Migração Automatizada

Crie um script para ajudar na migração:

```bash
#!/bin/bash
# migrate-logs.sh

echo "Migrando console.log para LoggerService..."

# Substituições simples
find src -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | xargs sed -i.bak '
s/console\.log(/logger.info(/g
s/console\.warn(/logger.warn(/g
s/console\.error(/logger.error(/g
s/console\.debug(/logger.debug(/g
'

echo "Migração básica concluída!"
echo "ATENÇÃO: Revise os arquivos manualmente para:"
echo "1. Adicionar imports do logger"
echo "2. Definir contextos apropriados"
echo "3. Estruturar dados corretamente"
```

### 7. Checklist de Migração

- [ ] Identificar todos os console.* no código
- [ ] Definir contextos apropriados para cada área
- [ ] Migrar logs por componente/arquivo
- [ ] Adicionar imports necessários
- [ ] Testar em diferentes ambientes
- [ ] Configurar variáveis de ambiente
- [ ] Validar performance
- [ ] Documentar padrões específicos do projeto

### 8. Validação da Migração

```javascript
// Teste de validação
import { getLogger } from '../utils/logging';

const logger = getLogger();

// Verificar se todos os níveis funcionam
logger.debug('test', 'Debug message');
logger.info('test', 'Info message');
logger.warn('test', 'Warning message');
logger.error('test', 'Error message');

// Verificar estrutura de dados
logger.info('test', 'Structured logging', {
  user: 'test-user',
  action: 'validation',
  timestamp: new Date().toISOString()
});

// Verificar performance tracking
const timer = logger.startTimer('validation');
// ... operação ...
timer.end('Validation completed');
```
