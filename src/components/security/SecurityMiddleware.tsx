/**
 * Security Middleware Component
 * Intercepta e monitora requisições para aplicar controles de segurança
 */

import React, { useEffect, ReactNode } from 'react';
import { useSecurityMonitor } from '@/hooks/useSecurityMonitor';
import { useRateLimit } from '@/hooks/useRateLimit';

interface SecurityMiddlewareProps {
  children: ReactNode;
}

export const SecurityMiddleware: React.FC<SecurityMiddlewareProps> = ({ children }) => {
  const { logSecurityEvent, recordMetric } = useSecurityMonitor();
  const { checkRateLimit } = useRateLimit();

  useEffect(() => {
    // Interceptar fetch requests para aplicar rate limiting
    const originalFetch = window.fetch;
    
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
      const method = init?.method || 'GET';
      
      try {
        // Determinar endpoint para rate limiting
        const endpoint = getEndpointForRateLimit(url, method);
        
        if (endpoint) {
          // Verificar rate limit
          const rateLimitResult = await checkRateLimit(endpoint);
          
          if (!rateLimitResult.allowed) {
            // Log da violação
            await logSecurityEvent({
              event_type: 'rate_limit_blocked_request',
              event_data: {
                url,
                method,
                endpoint,
                user_agent: navigator.userAgent
              },
              severity: 'medium'
            });

            // Retornar response de rate limit
            return new Response(
              JSON.stringify({
                error: 'Rate limit exceeded',
                retry_after: rateLimitResult.retry_after
              }),
              {
                status: 429,
                statusText: 'Too Many Requests',
                headers: {
                  'Content-Type': 'application/json',
                  'Retry-After': (rateLimitResult.retry_after || 60).toString()
                }
              }
            );
          }
        }

        // Executar request original
        const startTime = performance.now();
        const response = await originalFetch(input, init);
        const endTime = performance.now();
        const duration = endTime - startTime;

        // Registrar métricas de performance
        await recordMetric({
          service_name: 'frontend_fetch',
          metric_name: 'request_duration',
          metric_value: duration,
          metric_unit: 'ms',
          status: response.ok ? 'healthy' : 'warning',
          metadata: {
            url,
            method,
            status_code: response.status,
            endpoint
          }
        });

        // Log de requests suspeitos
        if (!response.ok && response.status >= 400) {
          const severity = response.status >= 500 ? 'high' : 'medium';
          
          await logSecurityEvent({
            event_type: 'failed_request',
            event_data: {
              url,
              method,
              status_code: response.status,
              duration,
              user_agent: navigator.userAgent
            },
            severity
          });
        }

        return response;

      } catch (error) {
        // Log de erros de rede
        await logSecurityEvent({
          event_type: 'network_error',
          event_data: {
            url,
            method,
            error: error instanceof Error ? error.message : 'Unknown error',
            user_agent: navigator.userAgent
          },
          severity: 'medium'
        });

        throw error;
      }
    };

    // Monitorar eventos de visibilidade da página
    const handleVisibilityChange = () => {
      logSecurityEvent({
        event_type: 'page_visibility_change',
        event_data: {
          hidden: document.hidden,
          visibility_state: document.visibilityState
        },
        severity: 'low'
      });
    };

    // Monitorar eventos de foco
    const handleFocus = () => {
      logSecurityEvent({
        event_type: 'page_focus',
        event_data: { timestamp: Date.now() },
        severity: 'low'
      });
    };

    const handleBlur = () => {
      logSecurityEvent({
        event_type: 'page_blur',
        event_data: { timestamp: Date.now() },
        severity: 'low'
      });
    };

    // Monitorar tentativas de debug
    const handleDevToolsCheck = () => {
      let devtools = { open: false };
      const threshold = 160;
      
      setInterval(() => {
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        
        if (widthThreshold || heightThreshold) {
          if (!devtools.open) {
            devtools.open = true;
            logSecurityEvent({
              event_type: 'devtools_opened',
              event_data: {
                width_diff: window.outerWidth - window.innerWidth,
                height_diff: window.outerHeight - window.innerHeight,
                user_agent: navigator.userAgent
              },
              severity: 'low'
            });
          }
        } else {
          devtools.open = false;
        }
      }, 500);
    };

    // Monitorar tentativas de injeção de código
    const handleCodeInjection = () => {
      const originalConsoleLog = console.log;
      const originalConsoleError = console.error;
      
      console.log = (...args) => {
        logSecurityEvent({
          event_type: 'console_log_intercepted',
          event_data: { args: args.slice(0, 3) }, // Primeiros 3 args apenas
          severity: 'low'
        });
        return originalConsoleLog.apply(console, args);
      };

      console.error = (...args) => {
        logSecurityEvent({
          event_type: 'console_error_intercepted',  
          event_data: { args: args.slice(0, 3) },
          severity: 'medium'
        });
        return originalConsoleError.apply(console, args);
      };
    };

    // Configurar listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    
    // Iniciar monitoramentos
    handleDevToolsCheck();
    handleCodeInjection();

    // Cleanup
    return () => {
      window.fetch = originalFetch;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [logSecurityEvent, recordMetric, checkRateLimit]);

  return <>{children}</>;
};

// Helper para determinar endpoint de rate limiting
function getEndpointForRateLimit(url: string, method: string): string | null {
  try {
    const urlObj = new URL(url);
    
    // APIs Supabase
    if (urlObj.hostname.includes('supabase.co')) {
      if (urlObj.pathname.includes('/functions/v1/')) {
        return 'authenticated_api';
      }
      if (urlObj.pathname.includes('/rest/v1/')) {
        return 'authenticated_api';
      }
      if (urlObj.pathname.includes('/auth/v1/')) {
        return 'public_api';
      }
    }
    
    // APIs locais de quiz
    if (urlObj.pathname.includes('/api/quiz')) {
      return 'quiz_submission';
    }
    
    // APIs de funnel
    if (urlObj.pathname.includes('/api/funnel') && method !== 'GET') {
      return 'funnel_update';
    }
    
    // APIs de IA
    if (urlObj.pathname.includes('ai') || urlObj.pathname.includes('generate')) {
      return 'ai_generation';
    }

    return null;
  } catch {
    return null;
  }
}

export default SecurityMiddleware;