import { toast } from '@/hooks/use-toast';

type NotifyLevel = 'info' | 'success' | 'warning' | 'error';

export function notify(message: string, level: NotifyLevel = 'info', title?: string) {
  const description = message;
  try {
    // Se estiver dentro de iframe, tentar notificar o parent
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ __type: 'quiz:notify', level, message, title }, '*');
    }
  } catch {
    // ignore cross-origin restriction
  }

  // Notificação local via toast
  try {
    toast({
      title: title || (level === 'success' ? 'Sucesso' : level === 'error' ? 'Erro' : level === 'warning' ? 'Aviso' : 'Informação'),
      description,
      // Shadcn: usar variant quando disponível
      // @ts-expect-error: variant pode não estar tipado em todos os setups
      variant: level === 'error' ? 'destructive' : level === 'warning' ? 'warning' : undefined,
    } as any);
  } catch {
    // Fallback final: console
    try {
      const tag = level.toUpperCase();
      console.warn(`[${tag}]`, message);
    } catch {}
  }
}

export default notify;
