import React from "react";
import { EditorBlock } from "@/types/editor";

interface QuizIntroHeaderBlockProps {
  block: EditorBlock;
  onClick?: () => void;
  className?: string;
}

const QuizIntroHeaderBlock: React.FC<QuizIntroHeaderBlockProps> = ({
  block,
  onClick,
  className = "",
}) => {
  const { content } = block;

  return (
    <div
      className={`p-6 bg-gradient-to-r from-[#B89B7A] to-[#8F7A6A] text-white rounded-lg cursor-pointer hover:shadow-lg transition-shadow ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {content?.logo && (
            <img
              src={content.logo}
              alt="Logo"
              className="h-10 w-10 object-contain"
            />
          )}
          <div>
            <h1 className="text-xl font-bold">
              {content?.title || "Quiz: Descubra Seu Estilo"}
            </h1>
            {content?.subtitle && (
              <p className="text-sm opacity-90 mt-1">{content.subtitle}</p>
            )}
          </div>
        </div>

        {content?.showProgress && (
          <div className="text-right">
            <div className="text-sm opacity-90">Progresso</div>
            <div className="text-lg font-bold">
              {content?.currentStep || 1} / {content?.totalSteps || 21}
            </div>
          </div>
        )}
      </div>

      {content?.progressBar && (
        <div className="mt-4">
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{
                width: `${((content?.currentStep || 1) / (content?.totalSteps || 21)) * 100}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizIntroHeaderBlock;
