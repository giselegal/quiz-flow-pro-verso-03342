// @ts-nocheck
import React from "react";
import { QuizQuestionBlock } from "./QuizQuestionBlock";
import { EditableContent } from "@/types/editor";

interface CaktoQuizQuestionProps {
  content?: EditableContent;
  isSelected?: boolean;
  isEditing?: boolean;
  onUpdate?: (content: Partial<EditableContent>) => void;
  onSelect?: () => void;
  className?: string;
}

export const CaktoQuizQuestion: React.FC<CaktoQuizQuestionProps> = props => {
  return <QuizQuestionBlock {...props} />;
};

export default CaktoQuizQuestion;
