import React from "react";
import { Award } from "lucide-react";

/**
 * BLOCO EDITÁVEL: Título de Seção
 *
 * Props Editáveis:
 * - title: string (título principal)
 * - subtitle: string (subtítulo)
 * - showBadge: boolean (mostrar badge)
 * - badgeText: string (texto do badge)
 * - badgeIcon: string (ícone do badge)
 * - alignment: 'left' | 'center' | 'right'
 * - titleColor: string
 * - subtitleColor: string
 * - badgeColor: string
 *
 * Exemplo de Uso:
 * <SectionTitleBlock
 *   title="Por que escolher o CaktoQuiz?"
 *   subtitle="A solução completa para seu estilo"
 *   showBadge={true}
 *   badgeText="Comprovado por especialistas"
 * />
 */

export interface SectionTitleBlockProps {
  blockId?: string;
  title?: string;
  subtitle?: string;
  showBadge?: boolean;
  badgeText?: string;
  alignment?: "left" | "center" | "right";
  titleColor?: string;
  subtitleColor?: string;
  badgeColor?: string;
  className?: string;
}

const SectionTitleBlock: React.FC<SectionTitleBlockProps> = ({
  blockId = "section-title",
  title = "Por que escolher o CaktoQuiz?",
  subtitle = "A solução mais completa para descobrir seu estilo pessoal",
  showBadge = true,
  badgeText = "3000+ mulheres transformadas",
  alignment = "center",
  titleColor = "#432818",
  subtitleColor = "#6B5B73",
  badgeColor = "#B89B7A",
  className = "",
}) => {
  return (
    <div className={`section-title-block py-12 px-6 ${className}`} data-block-id={blockId}>
      <div className="max-w-4xl mx-auto" style={{ textAlign: alignment }}>
        {showBadge && badgeText && (
          <div className="mb-6">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border"
              style={{
                backgroundColor: `${badgeColor}20`,
                borderColor: `${badgeColor}40`,
                color: badgeColor,
              }}
            >
              <Award className="w-4 h-4" />
              <span className="text-sm font-semibold">{badgeText}</span>
            </div>
          </div>
        )}

        <h2
          className="text-3xl md:text-4xl font-bold mb-6"
          style={{
            fontFamily: "Playfair Display, serif",
            color: titleColor,
          }}
        >
          {title}
        </h2>

        {subtitle && (
          <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: subtitleColor }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default SectionTitleBlock;
