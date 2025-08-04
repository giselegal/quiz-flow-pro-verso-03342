import React from "react";

interface SchemaDrivenEditorResponsiveProps {
  className?: string;
}

/**
 * Editor responsivo baseado em schema
 */
const SchemaDrivenEditorResponsive: React.FC<SchemaDrivenEditorResponsiveProps> = ({
  className = "",
}) => {
  return (
    <div className={`schema-driven-editor ${className}`}>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Editor Schema-Driven</h2>
        <p className="text-gray-600">Editor responsivo baseado em schema em desenvolvimento.</p>
      </div>
    </div>
  );
};

export default SchemaDrivenEditorResponsive;
