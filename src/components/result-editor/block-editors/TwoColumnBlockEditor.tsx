import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Block } from '@/types/editor';
import StyleEditor from '../style-editors/StyleEditor';

interface TwoColumnBlockEditorProps {
  block: Block;
  onUpdate: (content: any) => void;
}

const TwoColumnBlockEditor: React.FC<TwoColumnBlockEditorProps> = ({ block, onUpdate }) => {
  const { content = {} } = block;

  // Ensure leftColumn and rightColumn exist and have style property
  const leftColumn = content.leftColumn || {
    content: '',
    width: '50%',
    style: {},
  };
  const rightColumn = content.rightColumn || {
    content: '',
    width: '50%',
    style: {},
  };

  const handleLeftColumnUpdate = (leftColumnUpdate: any) => {
    onUpdate({
      ...content,
      leftColumn: {
        ...leftColumn,
        ...leftColumnUpdate,
      },
    });
  };

  const handleRightColumnUpdate = (rightColumnUpdate: any) => {
    onUpdate({
      ...content,
      rightColumn: {
        ...rightColumn,
        ...rightColumnUpdate,
      },
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <Tabs defaultValue="layout" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="layout" className="flex-1">
              Layout
            </TabsTrigger>
            <TabsTrigger value="left" className="flex-1">
              Coluna Esquerda
            </TabsTrigger>
            <TabsTrigger value="right" className="flex-1">
              Coluna Direita
            </TabsTrigger>
          </TabsList>

          <TabsContent value="layout" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="columnGap">Espaçamento entre Colunas</Label>
              <Input
                id="columnGap"
                value={content.columnGap || '20px'}
                onChange={e => onUpdate({ ...content, columnGap: e.target.value })}
                placeholder="ex: 20px ou 1rem"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="leftColumnWidth">Largura da Coluna Esquerda</Label>
              <Input
                id="leftColumnWidth"
                value={leftColumn.width || '50%'}
                onChange={e => handleLeftColumnUpdate({ width: e.target.value })}
                placeholder="ex: 50% ou 300px"
              />
              <p className="text-xs text-muted-foreground">
                Em telas pequenas, as colunas serão empilhadas
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rightColumnWidth">Largura da Coluna Direita</Label>
              <Input
                id="rightColumnWidth"
                value={rightColumn.width || '50%'}
                onChange={e => handleRightColumnUpdate({ width: e.target.value })}
                placeholder="ex: 50% ou 300px"
              />
            </div>
          </TabsContent>

          <TabsContent value="left" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="leftContent">Conteúdo da Coluna Esquerda</Label>
              <Textarea
                id="leftContent"
                value={leftColumn.content || ''}
                onChange={e => handleLeftColumnUpdate({ content: e.target.value })}
                placeholder="Adicione conteúdo HTML ou texto simples aqui"
                className="min-h-[150px]"
              />
              <p className="text-xs text-muted-foreground">
                Você pode adicionar HTML básico como &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, etc.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Estilo da Coluna Esquerda</Label>
              <StyleEditor
                style={leftColumn.style || {}}
                onUpdate={style => handleLeftColumnUpdate({ style })}
              />
            </div>
          </TabsContent>

          <TabsContent value="right" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rightContent">Conteúdo da Coluna Direita</Label>
              <Textarea
                id="rightContent"
                value={rightColumn.content || ''}
                onChange={e => handleRightColumnUpdate({ content: e.target.value })}
                placeholder="Adicione conteúdo HTML ou texto simples aqui"
                className="min-h-[150px]"
              />
              <p className="text-xs text-muted-foreground">
                Você pode adicionar HTML básico como &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, etc.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Estilo da Coluna Direita</Label>
              <StyleEditor
                style={rightColumn.style || {}}
                onUpdate={style => handleRightColumnUpdate({ style })}
              />
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      <div className="space-y-2">
        <Label>Estilo do Container</Label>
        <StyleEditor
          style={content.style || {}}
          onUpdate={style => onUpdate({ ...content, style })}
        />
      </div>
    </div>
  );
};

export default TwoColumnBlockEditor;
