// @ts-nocheck
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TemplateListItem } from '@/types/quizTemplate';
import {
  getAllTemplates,
  createTemplate,
  duplicateTemplate,
  deleteTemplate,
} from '@/services/templates/templateService';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Plus, Copy, Trash2, Edit, Check, X } from 'lucide-react';
import { styleQuizTemplate } from '@/services/templates/styleQuizTemplate';
import { toast } from '@/hooks/use-toast';

interface TemplateSelectorProps {
  onSelectTemplate: (templateId: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelectTemplate }) => {
  const [templates, setTemplates] = useState<TemplateListItem[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateDescription, setNewTemplateDescription] = useState('');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<string | null>(null);

  // Carregar templates ao iniciar
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    const loadedTemplates = getAllTemplates();
    setTemplates(loadedTemplates);
  };

  // Criar novo template
  const handleCreateTemplate = () => {
    if (!newTemplateName.trim()) {
      toast({
        title: 'Nome obrigatório',
        description: 'Por favor, insira um nome para o template.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const newTemplate = {
        name: newTemplateName,
        description: newTemplateDescription,
        isPublished: false,
        questions: [],
        resultPageSettings: {
          styleType: 'classic',
          blocks: [],
          headerConfig: {},
          mainContentConfig: {},
          offerConfig: {},
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const newTemplateId = createTemplate(newTemplate);
      setIsCreateDialogOpen(false);
      setNewTemplateName('');
      setNewTemplateDescription('');
      loadTemplates();

      toast({
        title: 'Template criado',
        description: 'O novo template foi criado com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao criar template:', error);
      toast({
        title: 'Erro ao criar template',
        description: 'Não foi possível criar o novo template.',
        variant: 'destructive',
      });
    }
  };

  // Duplicar template
  const handleDuplicateTemplate = (id: string) => {
    try {
      const duplicatedId = duplicateTemplate(id);
      if (duplicatedId) {
        loadTemplates();
        toast({
          title: 'Template duplicado',
          description: 'O template foi duplicado com sucesso.',
        });
      }
    } catch (error) {
      console.error('Erro ao duplicar template:', error);
      toast({
        title: 'Erro ao duplicar',
        description: 'Não foi possível duplicar o template.',
        variant: 'destructive',
      });
    }
  };

  // Excluir template
  const handleDeleteTemplate = (id: string) => {
    try {
      const success = deleteTemplate(id);
      if (success) {
        loadTemplates();
        setIsDeleteConfirmOpen(null);
        toast({
          title: 'Template excluído',
          description: 'O template foi excluído com sucesso.',
        });
      }
    } catch (error) {
      console.error('Erro ao excluir template:', error);
      toast({
        title: 'Erro ao excluir',
        description: 'Não foi possível excluir o template.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-playfair text-[#432818]">Selecione um Template</h2>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#B89B7A] hover:bg-[#A38A69]">
              <Plus className="w-4 h-4 mr-2" />
              Novo Template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Template</DialogTitle>
              <DialogDescription>
                Crie um novo template de quiz com base no modelo padrão.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Template</Label>
                <Input
                  id="name"
                  value={newTemplateName}
                  onChange={e => setNewTemplateName(e.target.value)}
                  placeholder="Ex: Quiz de Estilo Pessoal"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={newTemplateDescription}
                  onChange={e => setNewTemplateDescription(e.target.value)}
                  placeholder="Uma breve descrição sobre este template..."
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-[#B89B7A] hover:bg-[#A38A69]" onClick={handleCreateTemplate}>
                Criar Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map(template => (
          <Card key={template.id} className="overflow-hidden border border-[#B89B7A]/20">
            <CardHeader className="bg-[#FAF9F7]">
              <CardTitle className="font-playfair text-[#432818]">{template.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {template.description || 'Sem descrição'}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">
                <p className="flex items-center">
                  <span
                    className={`w-2 h-2 rounded-full mr-2 ${template.isPublished ? 'bg-green-500' : 'bg-amber-500'}`}
                  ></span>
                  {template.isPublished ? 'Publicado' : 'Rascunho'}
                </p>
                <p className="mt-1">
                  Atualizado{' '}
                  {formatDistanceToNow(new Date(template.updatedAt), {
                    locale: ptBR,
                    addSuffix: true,
                  })}
                </p>
              </div>
            </CardContent>

            <CardFooter className="border-t bg-[#FAF9F7] flex justify-between">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDuplicateTemplate(template.id)}
                  className="text-[#8F7A6A]"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Duplicar
                </Button>

                {isDeleteConfirmOpen === template.id ? (
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteTemplate(template.id)}
                    >
                      <Check className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsDeleteConfirmOpen(null)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsDeleteConfirmOpen(template.id)}
                    style={{ color: '#432818' }}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Excluir
                  </Button>
                )}
              </div>

              <Button
                size="sm"
                className="bg-[#B89B7A] hover:bg-[#A38A69]"
                onClick={() => onSelectTemplate(template.id)}
              >
                <Edit className="w-4 h-4 mr-1" />
                Editar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {templates.length === 0 && (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground mb-4">
            Nenhum template disponível. Crie um novo para começar.
          </p>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-[#B89B7A] hover:bg-[#A38A69]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Primeiro Template
          </Button>
        </Card>
      )}
    </div>
  );
};

export default TemplateSelector;
