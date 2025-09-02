import { StorageService } from '@/services/core/StorageService';

export const getBestUserName = (block?: any): string => {
    let storedName =
        StorageService.safeGetString('userName') ||
        StorageService.safeGetString('quizUserName') ||
        (typeof window !== 'undefined' ? (window as any).__quizUserName : '') ||
        (block as any)?.properties?.userName ||
        '';

    if (!storedName) {
        try {
            const unified = StorageService.safeGetJSON<any>('unifiedQuizData') || {};
            const formData = unified.formData || {};
            const candidates = [
                formData.userName,
                formData.fullName,
                formData.nomeCompleto,
                formData.nome,
                formData.name,
                [formData.firstName, formData.lastName].filter(Boolean).join(' '),
            ].filter((v: any) => typeof v === 'string' && v.trim().length > 0) as string[];
            if (candidates.length > 0) {
                storedName = candidates.sort((a, b) => b.trim().length - a.trim().length)[0].trim();
            }
        } catch { }
    }

    if (!storedName) {
        try {
            const quizAnswers = StorageService.safeGetJSON<any>('quizAnswers') || {};
            const candidate = quizAnswers.userName || quizAnswers.name || '';
            if (typeof candidate === 'string' && candidate.trim().length > 0) storedName = candidate.trim();
        } catch { }
    }

    return storedName || 'Visitante';
};
