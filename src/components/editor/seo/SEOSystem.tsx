import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export const CustomURLEditor: React.FC = () => {
  const [url, setUrl] = useState('');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editor de URL Personalizada</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="custom-url">URL Personalizada</Label>
          <Input
            id="custom-url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="meu-quiz-personalizado"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export const SEOEditor: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editor de SEO</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="seo-title">Título SEO</Label>
          <Input
            id="seo-title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Título para mecanismos de busca"
          />
        </div>
        <div>
          <Label htmlFor="seo-description">Descrição SEO</Label>
          <Textarea
            id="seo-description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Descrição para mecanismos de busca"
            rows={3}
          />
        </div>
        <div>
          <Label htmlFor="seo-keywords">Palavras-chave</Label>
          <Input
            id="seo-keywords"
            value={keywords}
            onChange={e => setKeywords(e.target.value)}
            placeholder="palavra1, palavra2, palavra3"
          />
        </div>
      </CardContent>
    </Card>
  );
};

const SEOSystem: React.FC = () => {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold mb-4">Sistema de SEO</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SEOEditor />
        <CustomURLEditor />
      </div>
    </div>
  );
};

export default SEOSystem;
