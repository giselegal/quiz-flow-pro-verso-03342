import React, { useRef } from 'react';

interface QuizContainerProps {
  children: React.ReactNode;
}

const QuizContainer: React.FC<QuizContainerProps> = ({ children }) => {
  const quizContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-[#FEFEFE] px-4 py-8" ref={quizContainerRef}>
      <div className="max-w-4xl mx-auto">{children}</div>
    </div>
  );
};

export { QuizContainer };
