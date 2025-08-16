import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface LeadFormBlockProps {
  title?: string;
  subtitle?: string;
  fields?: string[];
  buttonText?: string;
  onSubmit?: (data: Record<string, string>) => void;
}

export const LeadFormBlock: React.FC<LeadFormBlockProps> = ({
  title = "Get Started",
  subtitle = "Fill out the form below",
  fields = ["name", "email"],
  buttonText = "Submit",
  onSubmit
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data: Record<string, string> = {};
    
    fields.forEach(field => {
      data[field] = formData.get(field) as string || '';
    });
    
    onSubmit?.(data);
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="space-y-4">
        {title && <h3 className="text-xl font-semibold">{title}</h3>}
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <Input
              key={field}
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              required
            />
          ))}
          <Button type="submit" className="w-full">
            {buttonText}
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default LeadFormBlock;