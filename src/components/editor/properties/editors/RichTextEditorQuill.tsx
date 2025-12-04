/**
 * 📝 RichTextEditorQuill - Editor WYSIWYG com React Quill
 * 
 * Para campos de texto rico/HTML no painel de propriedades
 */

import { useState, useCallback, useMemo, lazy, Suspense } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2 } from 'lucide-react';
import type { PropertyEditorProps } from '../core/types';

// Import dinâmico do ReactQuill para evitar SSR issues
const ReactQuill = lazy(() => import('react-quill'));

// Importar estilos do Quill
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorQuillProps extends PropertyEditorProps {
  minHeight?: string;
  maxHeight?: string;
}

export function RichTextEditorQuill({
  property,
  onChange,
  minHeight = '120px',
  maxHeight = '300px',
}: RichTextEditorQuillProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Configuração do toolbar
  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['link'],
      ['clean'],
    ],
  }), []);
  
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'align',
    'link',
  ];
  
  const handleChange = useCallback((content: string) => {
    // Quill retorna <p><br></p> para conteúdo vazio
    const cleanContent = content === '<p><br></p>' ? '' : content;
    onChange(property.key, cleanContent);
  }, [property.key, onChange]);
  
  const containerStyle = {
    minHeight: isExpanded ? '400px' : minHeight,
    maxHeight: isExpanded ? '80vh' : maxHeight,
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{property.label}</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-7 px-2"
        >
          {isExpanded ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </Button>
      </div>
      
      <div 
        className="border rounded-md overflow-hidden"
        style={containerStyle}
      >
        <Suspense fallback={<div className="h-32 bg-muted animate-pulse rounded" />}>
          <ReactQuill
            theme="snow"
            value={property.value || ''}
            onChange={handleChange}
            modules={modules}
            formats={formats}
            className="h-full"
            style={{ height: 'calc(100% - 42px)' }} // Desconta toolbar
          />
        </Suspense>
      </div>
      
      {(property as any).description && (
        <p className="text-xs text-muted-foreground">
          {(property as any).description}
        </p>
      )}
    </div>
  );
}

// Fallback para quando react-quill não está disponível
export function RichTextEditorFallback({
  property,
  onChange,
}: PropertyEditorProps) {
  return (
    <div className="space-y-2">
      <Label>{property.label}</Label>
      <textarea
        className="w-full min-h-[120px] p-3 border rounded-md font-mono text-sm"
        value={property.value || ''}
        onChange={(e) => onChange(property.key, e.target.value)}
        placeholder="Digite HTML aqui..."
      />
      <p className="text-xs text-muted-foreground">
        Editor rico indisponível. Use HTML diretamente.
      </p>
    </div>
  );
}

export default RichTextEditorQuill;
