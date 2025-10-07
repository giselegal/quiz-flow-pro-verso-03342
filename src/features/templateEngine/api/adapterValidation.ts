import { useQuery } from '@tanstack/react-query';

// Hook simples para buscar relatório de validação de um draft legacy adaptado (client-side only placeholder)
// Nesta fase usamos a própria validação do engine; endpoint específico poderá ser criado futuramente.
export interface ValidationIssue { code: string; message: string; severity: 'error' | 'warning'; }
export interface ValidationReport { errors: ValidationIssue[]; warnings: ValidationIssue[]; }

export function useAdapterValidation(draft?: { id: string }) {
    return useQuery<ValidationReport>({
        queryKey: ['legacy-adapter-validation', draft?.id],
        enabled: !!draft?.id,
        queryFn: async () => {
            // Placeholder: sem endpoint dedicado, apenas retorna warnings informativos se inexistente
            return { errors: [], warnings: [{ code: 'CLIENT_SIDE_PLACEHOLDER', message: 'Validação detalhada será fornecida ao publicar.', severity: 'warning' }] };
        }
    });
}
