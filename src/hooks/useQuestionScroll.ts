import { useEffect } from 'react';

export const useQuestionScroll = (questionIndex?: number) => {
  useEffect(() => {
  // Evitar forçar scroll no modo editor (/editor)
  const pathname = typeof window !== 'undefined' ? window.location?.pathname || '' : '';
  const isEditorRoute = /(^|\/)(admin\/editor|editor)(\/|$)/.test(pathname);
  if (isEditorRoute) return;

  // Scroll to top when question changes (produção)
  window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [questionIndex]);

  const scrollToQuestion = (index: number) => {
  // Evitar interferir no editor
  const pathname = typeof window !== 'undefined' ? window.location?.pathname || '' : '';
  const isEditorRoute = /(^|\/)(admin\/editor|editor)(\/|$)/.test(pathname);
  if (isEditorRoute) return;

  const element = document.getElementById(`question-${index}`);
  if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return { scrollToQuestion };
};
