import React from "react";
import BeforeAfterTransformation from "@/components/result/BeforeAfterTransformation";

/**
 * BLOCO EDITÁVEL: Transformação Antes e Depois
 *
 * Props Editáveis:
 * - title: string (título da seção)
 * - beforeTitle: string (título do "antes")
 * - afterTitle: string (título do "depois")
 * - beforeImage: string (imagem do antes)
 * - afterImage: string (imagem do depois)
 * - description: string (descrição da transformação)
 * - showCTA: boolean (mostrar call-to-action)
 * - ctaText: string (texto do botão)
 *
 * Exemplo de Uso:
 * <BeforeAfterTransformationBlock
 *   title="Sua Transformação"
 *   beforeTitle="Antes"
 *   afterTitle="Depois"
 *   description="Veja como você pode se transformar"
 * />
 */

export interface BeforeAfterTransformationBlockProps {
  blockId?: string;
  title?: string;
  beforeTitle?: string;
  afterTitle?: string;
  beforeImage?: string;
  afterImage?: string;
  description?: string;
  showCTA?: boolean;
  ctaText?: string;
  backgroundColor?: string;
  className?: string;
}

const BeforeAfterTransformationBlock: React.FC<
  BeforeAfterTransformationBlockProps
> = ({
  blockId = "before-after-transformation",
  title = "Sua Transformação Começa Agora",
  beforeTitle = "Antes",
  afterTitle = "Depois",
  beforeImage = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=600&fit=crop",
  afterImage = "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=600&fit=crop",
  description = "Descubra como pequenas mudanças podem criar uma transformação incrível no seu estilo.",
  showCTA = true,
  ctaText = "Quero me transformar",
  backgroundColor = "#ffffff",
  className = "",
}) => {
  return (
    <div
      className={`before-after-transformation-block ${className}`}
      data-block-id={blockId}
      style={{ backgroundColor }}
    >
      <BeforeAfterTransformation />
    </div>
  );
};

export default BeforeAfterTransformationBlock;
