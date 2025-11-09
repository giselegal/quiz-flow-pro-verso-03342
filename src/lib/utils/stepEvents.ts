import { getStepNumberFromKey, makeStepKey } from '@/utils/stepKey';
import { track } from '@/utils/telemetryLight';

export type NavigateDetail = {
    step: number | string;
    stepId: number;
    stepKey: string;
    source?: string;
    [k: string]: any;
};

export function buildNavigateDetail(step: number | string, extra?: Record<string, any>): NavigateDetail {
    const stepId = getStepNumberFromKey(step);
    const stepKey = makeStepKey(step);
    return { step, stepId, stepKey, ...extra };
}

export function dispatchNavigate(step: number | string, extra?: Record<string, any>) {
    const detail = buildNavigateDetail(step, extra);
    try {
        track('navigate', { stepId: detail.stepId, stepKey: detail.stepKey, source: detail.source || 'unknown' });
        window.dispatchEvent(new CustomEvent('navigate-to-step', { detail }));
        window.dispatchEvent(new CustomEvent('quiz-navigate-to-step', { detail }));
    } catch { /* no-op */ }
}

export default { buildNavigateDetail, dispatchNavigate };
