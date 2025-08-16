import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

interface LeadFormBlockProps {
  block?: any;
  isSelected?: boolean;
  onClick?: () => void;
  onPropertyChange?: (key: string, value: any) => void;
  isPreviewMode?: boolean;
  isPreviewing?: boolean;
  previewMode?: string;
}

const LeadFormBlock: React.FC<LeadFormBlockProps> = ({
  block,
  isSelected,
  onClick,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Lead form submitted:', formData);
    // Aqui seria enviado para o backend
  };

  const title = block?.properties?.title || block?.title || 'Cadastre-se agora';
  const description = block?.properties?.description || block?.description || 'Preencha seus dados para continuar';
  const buttonText = block?.properties?.buttonText || block?.buttonText || 'Enviar';

  return (
    <Card 
      className={`max-w-md mx-auto ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
            {description && (
              <p className="text-gray-600 mt-2">{description}</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full">
              {buttonText}
            </Button>
          </form>

          <p className="text-xs text-gray-500 text-center">
            Seus dados estão seguros conosco
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadFormBlock;