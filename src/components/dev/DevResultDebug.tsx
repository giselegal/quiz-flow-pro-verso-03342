import React, { useEffect, useState } from 'react';
import { StorageService } from '@/services/core/StorageService';

export const DevResultDebug: React.FC = () => {
    const [state, setState] = useState({
        userName: '',
        quizUserName: '',
        quizResult: null as any,
        currentStep: (globalThis as any)?.__quizCurrentStep || '',
    });

    useEffect(() => {
        const load = () => {
            const userName = StorageService.safeGetString('userName') || '';
            const quizUserName = StorageService.safeGetString('quizUserName') || '';
            const quizResult = StorageService.safeGetJSON('quizResult');
            setState({
                userName,
                quizUserName,
                quizResult,
                currentStep: (globalThis as any)?.__quizCurrentStep || '',
            });
        };
        load();
        const handler = () => load();
        window.addEventListener('quiz-result-updated', handler as EventListener);
        window.addEventListener('quiz-result-refresh', handler as EventListener);
        return () => {
            window.removeEventListener('quiz-result-updated', handler as EventListener);
            window.removeEventListener('quiz-result-refresh', handler as EventListener);
        };
    }, []);

    if (!import.meta?.env?.DEV && import.meta?.env?.VITE_SHOW_RESULT_DEBUG !== 'true') return null;

    return (
        <div style={{
            position: 'fixed', right: 12, bottom: 12, zIndex: 9999,
            background: 'rgba(255,255,255,0.95)', border: '1px solid #E5E7EB',
            borderRadius: 12, boxShadow: '0 10px 20px rgba(0,0,0,0.06)', padding: 12,
            maxWidth: 360, fontFamily: 'ui-sans-serif, system-ui',
        }}>
            <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 6 }}>Dev Result Debug</div>
            <div style={{ fontSize: 12, color: '#374151' }}>
                <div><b>Step:</b> {String(state.currentStep)}</div>
                <div><b>userName:</b> {state.userName || '—'}</div>
                <div><b>quizUserName:</b> {state.quizUserName || '—'}</div>
                <div><b>primaryStyle:</b> {state.quizResult?.primaryStyle?.category || state.quizResult?.primaryStyle?.style || '—'}</div>
                <div><b>percentage:</b> {typeof state.quizResult?.primaryStyle?.percentage === 'number' ? state.quizResult.primaryStyle.percentage + '%' : '—'}</div>
            </div>
        </div>
    );
};

export default DevResultDebug;
