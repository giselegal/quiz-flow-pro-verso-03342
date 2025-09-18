import { useEffect } from 'react';

export const useQuestionScroll = (questionIndex?: number) => {
  useEffect(() => {
    // Evitar auto-scroll no editor e quando explicitamente desabilitado
    if (typeof window === 'undefined') return;
    const path = window.location?.pathname || '';
    const disabledByFlag = (window as any).__DISABLE_AUTO_SCROLL === true;
    const isEditor = path.includes('/editor');
    if (isEditor || disabledByFlag) return;

    // Scroll to top quando a questão muda (apenas fora do editor)
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {}
  }, [questionIndex]);

  const scrollToQuestion = (index: number) => {
    // Evitar auto-scroll no editor
    if (typeof window === 'undefined') return;
    const path = window.location?.pathname || '';
    if (path.includes('/editor')) return;

    const element = document.getElementById(`question-${index}`);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return { scrollToQuestion };
};
