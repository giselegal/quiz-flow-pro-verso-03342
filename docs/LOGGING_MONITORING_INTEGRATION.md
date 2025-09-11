# Integração com Ferramentas de Monitoramento

## Visão Geral

O sistema de logging suporta integração com diversas ferramentas de monitoramento através de transports personalizados e formatters específicos.

## Sentry Integration

### Configuração

```bash
# .env
VITE_SENTRY_DSN=https://your-dsn@sentry.io/project-id
VITE_ENABLE_SENTRY_LOGGING=true
```

### Transport Customizado

```typescript
// src/utils/logging/transports/SentryTransport.ts
import * as Sentry from '@sentry/browser';
import type { LogTransport, LogEntry } from '../LoggerService';

export class SentryTransport implements LogTransport {
  private initialized = false;

  constructor(private dsn: string) {
    this.initializeSentry();
  }

  private initializeSentry() {
    if (this.initialized) return;

    Sentry.init({
      dsn: this.dsn,
      environment: import.meta.env.NODE_ENV,
      integrations: [
        new Sentry.BrowserTracing(),
        new Sentry.Replay()
      ],
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0
    });

    this.initialized = true;
  }

  async log(entry: LogEntry): Promise<void> {
    if (!this.initialized) return;

    // Map log levels to Sentry levels
    const sentryLevel = this.mapLogLevel(entry.level);
    
    // Add context
    Sentry.withScope(scope => {
      scope.setContext('logging', {
        context: entry.context,
        sessionId: entry.sessionId,
        userId: entry.userId,
        timestamp: entry.timestamp
      });

      if (entry.data) {
        scope.setContext('data', entry.data);
      }

      if (entry.performance) {
        scope.setContext('performance', entry.performance);
      }

      // Send to Sentry
      if (entry.level === 'ERROR' || entry.level === 'FATAL') {
        const error = entry.data?.error || new Error(entry.message);
        Sentry.captureException(error);
      } else {
        Sentry.captureMessage(entry.message, sentryLevel);
      }
    });
  }

  private mapLogLevel(level: string): Sentry.SeverityLevel {
    switch (level) {
      case 'DEBUG': return 'debug';
      case 'INFO': return 'info';
      case 'WARN': return 'warning';
      case 'ERROR': return 'error';
      case 'FATAL': return 'fatal';
      default: return 'info';
    }
  }
}
```

### Integração

```typescript
// src/utils/logging/LoggerFactory.ts - Adicionar ao método configureGlobalLogger
if (import.meta.env.VITE_ENABLE_SENTRY_LOGGING === 'true' && 
    import.meta.env.VITE_SENTRY_DSN) {
  
  const sentryTransport = new SentryTransport(import.meta.env.VITE_SENTRY_DSN);
  logger.addTransport(sentryTransport);
}
```

## DataDog Integration

### Configuração

```bash
# .env
VITE_DATADOG_CLIENT_TOKEN=your-client-token
VITE_DATADOG_APPLICATION_ID=your-app-id
VITE_ENABLE_DATADOG_LOGGING=true
```

### Transport Customizado

```typescript
// src/utils/logging/transports/DataDogTransport.ts
import { datadogLogs } from '@datadog/browser-logs';
import type { LogTransport, LogEntry } from '../LoggerService';

export class DataDogTransport implements LogTransport {
  private initialized = false;

  constructor(
    private clientToken: string,
    private applicationId: string
  ) {
    this.initializeDataDog();
  }

  private initializeDataDog() {
    if (this.initialized) return;

    datadogLogs.init({
      clientToken: this.clientToken,
      site: 'datadoghq.com',
      forwardErrorsToLogs: true,
      sessionSampleRate: 100,
      service: 'quiz-quest-challenge-verse',
      version: import.meta.env.VITE_APP_VERSION || '1.0.0',
      env: import.meta.env.NODE_ENV
    });

    this.initialized = true;
  }

  async log(entry: LogEntry): Promise<void> {
    if (!this.initialized) return;

    const logData = {
      message: entry.message,
      context: entry.context,
      sessionId: entry.sessionId,
      userId: entry.userId,
      ...entry.data
    };

    switch (entry.level) {
      case 'DEBUG':
        datadogLogs.logger.debug(entry.message, logData);
        break;
      case 'INFO':
        datadogLogs.logger.info(entry.message, logData);
        break;
      case 'WARN':
        datadogLogs.logger.warn(entry.message, logData);
        break;
      case 'ERROR':
      case 'FATAL':
        datadogLogs.logger.error(entry.message, logData);
        break;
    }
  }
}
```

## LogRocket Integration

### Configuração

```typescript
// src/utils/logging/transports/LogRocketTransport.ts
import LogRocket from 'logrocket';
import type { LogTransport, LogEntry } from '../LoggerService';

export class LogRocketTransport implements LogTransport {
  private initialized = false;

  constructor(private appId: string) {
    this.initializeLogRocket();
  }

  private initializeLogRocket() {
    if (this.initialized) return;

    LogRocket.init(this.appId, {
      network: {
        requestSanitizer: request => {
          // Sanitize sensitive headers
          if (request.headers.authorization) {
            request.headers.authorization = '[REDACTED]';
          }
          return request;
        }
      }
    });

    this.initialized = true;
  }

  async log(entry: LogEntry): Promise<void> {
    if (!this.initialized) return;

    // Add context to LogRocket session
    LogRocket.addTag(entry.context);
    
    if (entry.userId) {
      LogRocket.identify(entry.userId);
    }

    // Log to LogRocket console
    const logData = {
      context: entry.context,
      sessionId: entry.sessionId,
      ...entry.data
    };

    switch (entry.level) {
      case 'DEBUG':
        LogRocket.log(entry.message, logData);
        break;
      case 'INFO':
        LogRocket.info(entry.message, logData);
        break;
      case 'WARN':
        LogRocket.warn(entry.message, logData);
        break;
      case 'ERROR':
      case 'FATAL':
        LogRocket.captureException(new Error(entry.message));
        LogRocket.error(entry.message, logData);
        break;
    }
  }
}
```

## New Relic Integration

### Configuração

```typescript
// src/utils/logging/transports/NewRelicTransport.ts
import type { LogTransport, LogEntry } from '../LoggerService';

declare global {
  interface Window {
    newrelic: any;
  }
}

export class NewRelicTransport implements LogTransport {
  private isAvailable(): boolean {
    return typeof window !== 'undefined' && window.newrelic;
  }

  async log(entry: LogEntry): Promise<void> {
    if (!this.isAvailable()) return;

    const attributes = {
      context: entry.context,
      level: entry.level,
      sessionId: entry.sessionId,
      userId: entry.userId,
      ...entry.data
    };

    // Add custom attributes
    window.newrelic.addPageAction('log_entry', attributes);

    // For errors, use noticeError
    if (entry.level === 'ERROR' || entry.level === 'FATAL') {
      const error = entry.data?.error || new Error(entry.message);
      window.newrelic.noticeError(error, attributes);
    }
  }
}
```

## Configuração Multi-Transport

### Factory com Múltiplos Transports

```typescript
// src/utils/logging/LoggerFactory.ts - Método estendido
private static configureProductionTransports(logger: LoggerService): void {
  // Console (sempre ativo)
  logger.addTransport(new ConsoleTransport());

  // Storage local para fallback
  if (LoggingFeatures.ENABLE_STORAGE) {
    logger.addTransport(new StorageTransport());
  }

  // Remote logging
  if (LoggingFeatures.ENABLE_REMOTE_LOGGING && LoggingFeatures.LOGGING_ENDPOINT) {
    logger.addTransport(new RemoteTransport(LoggingFeatures.LOGGING_ENDPOINT));
  }

  // Sentry para error tracking
  if (import.meta.env.VITE_ENABLE_SENTRY_LOGGING === 'true') {
    const sentryTransport = new SentryTransport(import.meta.env.VITE_SENTRY_DSN);
    logger.addTransport(sentryTransport);
  }

  // DataDog para observabilidade completa
  if (import.meta.env.VITE_ENABLE_DATADOG_LOGGING === 'true') {
    const dataDogTransport = new DataDogTransport(
      import.meta.env.VITE_DATADOG_CLIENT_TOKEN,
      import.meta.env.VITE_DATADOG_APPLICATION_ID
    );
    logger.addTransport(dataDogTransport);
  }

  // LogRocket para session replay
  if (import.meta.env.VITE_ENABLE_LOGROCKET === 'true') {
    const logRocketTransport = new LogRocketTransport(
      import.meta.env.VITE_LOGROCKET_APP_ID
    );
    logger.addTransport(logRocketTransport);
  }
}
```

## Configuração de Alertas

### Configuração por Ferramenta

#### Sentry Alerts
```typescript
// Configuração de alertas críticos
const criticalContexts = ['auth', 'payment', 'api'];
const criticalLevels = ['ERROR', 'FATAL'];

// Filter para enviar apenas logs críticos para Sentry
export class CriticalFilter implements LogFilter {
  shouldLog(entry: LogEntry): boolean {
    return criticalLevels.includes(entry.level) || 
           criticalContexts.includes(entry.context);
  }
}
```

#### DataDog Dashboards
```typescript
// Configuração de métricas customizadas
export class MetricsTransport implements LogTransport {
  async log(entry: LogEntry): Promise<void> {
    // Enviar métricas específicas
    if (entry.performance?.duration) {
      this.sendMetric('performance.duration', entry.performance.duration, {
        context: entry.context
      });
    }

    if (entry.level === 'ERROR') {
      this.sendMetric('errors.count', 1, {
        context: entry.context
      });
    }
  }

  private sendMetric(name: string, value: number, tags: Record<string, string>) {
    // Implementação de envio de métricas
  }
}
```

## Exemplo de Uso Completo

```typescript
// src/components/QuizEditor.tsx
import React from 'react';
import { useLogger } from '../utils/logging';

export function QuizEditor() {
  const logger = useLogger();

  React.useEffect(() => {
    // Este log vai para console, storage, e potencialmente Sentry/DataDog
    logger.info('quiz-editor', 'Quiz editor initialized', {
      userId: 'user-123',
      quizId: 'quiz-456'
    });
  }, []);

  const handleError = (error: Error) => {
    // Este erro será automaticamente enviado para Sentry
    logger.error('quiz-editor', 'Failed to save quiz', {
      error,
      userId: 'user-123',
      quizId: 'quiz-456'
    });
  };

  return (
    <div>
      {/* Quiz editor implementation */}
    </div>
  );
}
```

Com esta configuração, você terá:
- **Logs locais** para desenvolvimento
- **Sentry** para error tracking e alertas
- **DataDog** para observabilidade e métricas
- **LogRocket** para session replay
- **New Relic** para APM integration

Cada transport pode ser habilitado/desabilitado independentemente através de variáveis de ambiente, permitindo flexibilidade total na configuração por ambiente.
