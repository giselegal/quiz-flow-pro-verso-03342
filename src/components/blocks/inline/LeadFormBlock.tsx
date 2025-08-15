import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LeadFormProps {
  fields?: string[];
  submitText?: string;
  containerWidth?: string;
  spacing?: string;
  onSubmit?: (formData: Record<string, string>) => void;
}

const LeadFormBlock: React.FC<LeadFormProps> = ({
  fields = ['name', 'email'],
  submitText = 'Enviar',
  containerWidth = 'full',
  spacing = 'small',
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const containerClasses = `
    w-full
    ${containerWidth === 'full' ? 'max-w-full' : 'max-w-md mx-auto'}
    ${spacing === 'small' ? 'p-4' : spacing === 'medium' ? 'p-6' : 'p-8'}
  `;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Dispatch form completion event
    const event = new CustomEvent('quiz-form-complete', {
      detail: { formData, source: 'LeadFormBlock' }
    });
    window.dispatchEvent(event);

    if (onSubmit) {
      onSubmit(formData);
    }

    setTimeout(() => setIsSubmitting(false), 1000);
  };

  const getFieldLabel = (field: string): string => {
    const labels: Record<string, string> = {
      name: 'Nome Completo',
      email: 'E-mail',
      phone: 'Telefone',
      whatsapp: 'WhatsApp',
    };
    return labels[field] || field.charAt(0).toUpperCase() + field.slice(1);
  };

  const getFieldType = (field: string): string => {
    const types: Record<string, string> = {
      email: 'email',
      phone: 'tel',
      whatsapp: 'tel',
    };
    return types[field] || 'text';
  };

  const getFieldPlaceholder = (field: string): string => {
    const placeholders: Record<string, string> = {
      name: 'Digite seu nome completo',
      email: 'Digite seu melhor e-mail',
      phone: 'Digite seu telefone',
      whatsapp: 'Digite seu WhatsApp',
    };
    return placeholders[field] || `Digite seu ${field}`;
  };

  return (
    <div className={containerClasses}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => (
          <div key={field} className="space-y-2">
            <Label 
              htmlFor={field}
              className="text-sm font-medium text-stone-700"
            >
              {getFieldLabel(field)}
            </Label>
            <Input
              id={field}
              name={field}
              type={getFieldType(field)}
              placeholder={getFieldPlaceholder(field)}
              value={formData[field] || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="w-full"
              required
            />
          </div>
        ))}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#B89B7A] hover:bg-[#A67B5B] text-white font-medium py-3 text-lg"
        >
          {isSubmitting ? 'Enviando...' : submitText}
        </Button>
      </form>
    </div>
  );
};

export default LeadFormBlock;