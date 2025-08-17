import React from 'react';
import { useEditorFieldValidation } from '../../hooks/useEditorFieldValidation';
import { ValidationProps } from '../../types/editor';
import { ValidatedInput } from './ValidatedInput';
import { ValidatedMultiSelect } from './ValidatedMultiSelect';

interface PropertyPanelProps {
  blockId: string;
  type: string;
  values: Record<string, unknown>;
  onChange: (values: Record<string, unknown>) => void;
  validations: Record<string, ValidationProps[]>;
}

export const ValidatedPropertyPanel: React.FC<PropertyPanelProps> = ({
  blockId,
  type,
  values,
  onChange,
  validations,
}) => {
  const { validateBlock, getFieldErrors } = useEditorFieldValidation();
  const errors = getFieldErrors(blockId);

  const handleFieldChange = (fieldId: string, value: unknown) => {
    const newValues = {
      ...values,
      [fieldId]: value,
    };

    onChange(newValues);

    // Validar o bloco inteiro após cada mudança
    validateBlock(blockId, newValues, { [fieldId]: validations[fieldId] || [] });
  };

  // Renderiza campos baseados no tipo de bloco
  const renderFields = () => {
    switch (type) {
      case 'text':
        return (
          <>
            <ValidatedInput
              id={`${blockId}.content`}
              label="Conteúdo"
              value={(values.content as string) || ''}
              onChange={value => handleFieldChange('content', value)}
              validations={validations.content}
            />
            <ValidatedInput
              id={`${blockId}.style`}
              label="Estilo"
              value={(values.style as string) || ''}
              onChange={value => handleFieldChange('style', value)}
              validations={validations.style}
            />
          </>
        );

      case 'options':
        return (
          <>
            <ValidatedInput
              id={`${blockId}.question`}
              label="Pergunta"
              value={(values.question as string) || ''}
              onChange={value => handleFieldChange('question', value)}
              validations={validations.question}
            />
            <ValidatedMultiSelect
              id={`${blockId}.options`}
              label="Opções"
              options={(values.options as Array<{ value: string; label: string }>) || []}
              value={(values.selected as string[]) || []}
              onChange={value => handleFieldChange('selected', value)}
              validations={validations.selected}
            />
          </>
        );

      case 'image':
        return (
          <>
            <ValidatedInput
              id={`${blockId}.src`}
              label="URL da Imagem"
              value={(values.src as string) || ''}
              onChange={value => handleFieldChange('src', value)}
              validations={validations.src}
            />
            <ValidatedInput
              id={`${blockId}.alt`}
              label="Texto Alternativo"
              value={(values.alt as string) || ''}
              onChange={value => handleFieldChange('alt', value)}
              validations={validations.alt}
            />
          </>
        );

      // Adicione mais tipos conforme necessário

      default:
        return <div>Tipo de bloco não suportado: {type}</div>;
    }
  };

  return <div className="validated-property-panel">{renderFields()}</div>;
};
