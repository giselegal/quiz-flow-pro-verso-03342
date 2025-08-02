
import { useEffect, useRef } from 'react';

export const useQuestionScroll = (shouldScroll: boolean = true) => {
  const questionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldScroll && questionRef.current) {
      questionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [shouldScroll]);

  const scrollToQuestion = () => {
    if (questionRef.current) {
      questionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return {
    questionRef,
    scrollToQuestion
  };
};
