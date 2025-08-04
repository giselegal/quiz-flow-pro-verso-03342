import React from "react";
import MotivationSection from "@/components/result/MotivationSection";

/**
 * BLOCO EDITÁVEL: Seção de Motivação
 *
 * Props Editáveis:
 * - title: string (título da seção)
 * - subtitle: string (subtítulo)
 * - content: string (texto principal)
 * - showButton: boolean (mostrar botão CTA)
 * - buttonText: string (texto do botão)
 * - buttonColor: string (cor do botão)
 * - backgroundColor: string
 * - textAlign: 'left' | 'center' | 'right'
 *
 * Exemplo de Uso:
 * <MotivationSectionBlock
 *   title="Sua transformação começa agora"
 *   subtitle="Descubra seu potencial"
 *   content="Com o CaktoQuiz, você terá todas as ferramentas..."
 *   showButton={true}
 *   buttonText="Começar agora"
 * />
 */

export interface MotivationSectionBlockProps {
  blockId?: string;
  title?: string;
  subtitle?: string;
  content?: string;
  showButton?: boolean;
  buttonText?: string;
  buttonColor?: string;
  backgroundColor?: string;
  textAlign?: "left" | "center" | "right";
  className?: string;
}

const MotivationSectionBlock: React.FC<MotivationSectionBlockProps> = ({
  blockId = "motivation-section",
  title = "Sua transformação começa agora",
  subtitle = "Descubra seu potencial único",
  content = "Com as estratégias certas, você pode transformar completamente seu estilo e autoestima.",
  showButton = true,
  buttonText = "Quero me transformar",
  buttonColor = "#B89B7A",
  backgroundColor = "#ffffff",
  textAlign = "center",
  className = "",
}) => {
  return (
    <div
      className={`motivation-section-block ${className}`}
      data-block-id={blockId}
      style={{
        backgroundColor,
        textAlign,
      }}
    >
      <MotivationSection />
    </div>
  );
};

export default MotivationSectionBlock;
