import React from "react";
import ButtonInlineFixed from "../components/blocks/inline/ButtonInlineFixed";

const TestButton = () => {
  const testBlock = {
    id: "test-button",
    type: "button-inline",
    content: {},
    order: 1,
    properties: {
      text: "✨ Teste do Botão CTA ✨",
      variant: "primary",
      size: "large",
      fullWidth: true,
      backgroundColor: "#B89B7A",
      textColor: "#ffffff",
      requiresValidInput: false,
      textAlign: "text-center",
      borderRadius: "rounded-full",
      padding: "py-4 px-8",
      fontSize: "text-lg",
      fontWeight: "font-bold",
      boxShadow: "shadow-xl",
      hoverEffect: true,
    },
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-8 text-center">Teste do Botão CTA</h1>
      
      <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
        <ButtonInlineFixed
          block={testBlock}
          isSelected={false}
          onClick={() => console.log("Botão clicado!")}
        />
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Propriedades do teste:</strong></p>
        <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
          {JSON.stringify(testBlock.properties, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default TestButton;
