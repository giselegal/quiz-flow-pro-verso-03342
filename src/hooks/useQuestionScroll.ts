import { useEffect } from "react";

export const useQuestionScroll = (questionIndex?: number) => {
  useEffect(() => {
    // Scroll to top when question changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [questionIndex]);

  const scrollToQuestion = (index: number) => {
    const element = document.getElementById(`question-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return { scrollToQuestion };
};
