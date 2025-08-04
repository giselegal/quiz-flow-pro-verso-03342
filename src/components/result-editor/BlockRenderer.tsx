import React from "react";
import { Block, FAQItem } from "@/types/editor";
import { StyleResult } from "@/types/quiz";

interface BlockRendererProps {
  block: Block;
  isEditing?: boolean;
  onUpdate?: (content: any) => void;
  primaryStyle?: StyleResult;
}

const BlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  isEditing = false,
  onUpdate,
  primaryStyle,
}) => {
  const content = block.content || {};

  const handleContentChange = (key: string, value: any) => {
    if (onUpdate) {
      onUpdate({ ...content, [key]: value });
    }
  };

  // Type guard to check if items is string array or FAQItem array
  const isStringArray = (items: any[]): items is string[] => {
    return items.length === 0 || typeof items[0] === "string";
  };

  const isFAQItemArray = (items: any[]): items is FAQItem[] => {
    return (
      items.length > 0 && typeof items[0] === "object" && "question" in items[0]
    );
  };

  switch (block.type) {
    case "header":
    case "headline":
      return (
        <div className="text-center">
          {isEditing ? (
            <input
              type="text"
              value={content.title || ""}
              onChange={(e) => handleContentChange("title", e.target.value)}
              className="text-2xl font-bold w-full border-none outline-none bg-transparent"
              placeholder="Digite o título"
            />
          ) : (
            <h1 className="text-2xl font-bold text-gray-900">
              {content.title || "Título"}
            </h1>
          )}
          {content.subtitle && (
            <p className="text-lg text-gray-600 mt-2">{content.subtitle}</p>
          )}
        </div>
      );

    case "text":
      return (
        <div>
          {isEditing ? (
            <textarea
              value={content.text || ""}
              onChange={(e) => handleContentChange("text", e.target.value)}
              className="w-full p-2 border rounded resize-none"
              rows={4}
              placeholder="Digite o texto"
            />
          ) : (
            <p className="text-gray-700 leading-relaxed">
              {content.text || "Texto de exemplo"}
            </p>
          )}
        </div>
      );

    case "image":
      return (
        <div className="text-center">
          {content.imageUrl ? (
            <img
              src={content.imageUrl}
              alt={content.imageAlt || "Imagem"}
              className="max-w-full h-auto rounded-lg mx-auto"
            />
          ) : (
            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Imagem</span>
            </div>
          )}
          {content.description && (
            <p className="text-sm text-gray-600 mt-2">{content.description}</p>
          )}
        </div>
      );

    case "button":
      return (
        <div className="text-center">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            {content.buttonText || "Clique aqui"}
          </button>
        </div>
      );

    case "benefits":
      const benefitItems = content.items || [];
      return (
        <div>
          <h3 className="text-xl font-semibold mb-4">
            {content.title || "Benefícios"}
          </h3>
          <ul className="space-y-2">
            {benefitItems.length > 0 && isStringArray(benefitItems) ? (
              benefitItems.map((item: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-gray-500">Nenhum benefício adicionado</li>
            )}
          </ul>
        </div>
      );

    case "faq":
      const faqItems = content.faqItems || content.items || [];
      return (
        <div>
          <h3 className="text-xl font-semibold mb-4">
            {content.title || "Perguntas Frequentes"}
          </h3>
          <div className="space-y-4">
            {faqItems.length > 0 && isFAQItemArray(faqItems) ? (
              faqItems.map((item: FAQItem, index: number) => (
                <div key={index} className="border-b pb-3">
                  <h4 className="font-medium text-gray-900 mb-2">
                    {item.question}
                  </h4>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Nenhuma pergunta adicionada</p>
            )}
          </div>
        </div>
      );

    case "testimonials":
      return (
        <div className="bg-gray-50 p-6 rounded-lg">
          <blockquote className="text-lg italic text-gray-800 mb-4">
            "{content.quote || "Depoimento incrível sobre o produto..."}"
          </blockquote>
          <cite className="text-gray-600 font-medium">
            — {content.quoteAuthor || "Nome do Cliente"}
          </cite>
        </div>
      );

    case "pricing":
      return (
        <div className="bg-white border-2 border-blue-200 rounded-lg p-6 text-center">
          {content.regularPrice && (
            <div className="text-gray-500 line-through text-lg">
              R$ {content.regularPrice}
            </div>
          )}
          <div className="text-3xl font-bold text-blue-600 mb-4">
            R$ {content.salePrice || "97"}
          </div>
          <button className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors">
            Comprar Agora
          </button>
        </div>
      );

    default:
      return (
        <div className="p-4 bg-gray-100 rounded-lg text-center text-gray-600">
          Bloco: {block.type}
          {content.title && <div className="font-medium">{content.title}</div>}
          {content.text && <div className="text-sm">{content.text}</div>}
        </div>
      );
  }
};

export default BlockRenderer;
