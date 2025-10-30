// Shim simples para ambiente de testes e runtime sem implementação real.
// Evita falhas de import em hooks que dependem do serviço de notificação.

type NotifyPayload = {
    title?: string;
    message?: string;
    variant?: 'info' | 'success' | 'warning' | 'error';
};

function noop(..._args: any[]): void { }

export const notificationService = {
    info: (_msg: string | NotifyPayload) => noop(_msg),
    success: (_msg: string | NotifyPayload) => noop(_msg),
    warn: (_msg: string | NotifyPayload) => noop(_msg),
    warning: (_msg: string | NotifyPayload) => noop(_msg),
    error: (_msg: string | NotifyPayload) => noop(_msg),
    notify: (_payload: NotifyPayload) => noop(_payload),
};

export default notificationService;
