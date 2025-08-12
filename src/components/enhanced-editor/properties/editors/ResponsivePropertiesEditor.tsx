import { Block } from '@/types/editor';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ResponsivePropertiesEditorProps {
  block: Block;
  onUpdate: (content: any) => void;
  isMobile?: boolean;
}

export function ResponsivePropertiesEditor({
  block,
  onUpdate,
  isMobile = false,
}: ResponsivePropertiesEditorProps) {
  const responsive = block.content?.responsive || {};

  const handleResponsiveUpdate = (key: string, value: any) => {
    onUpdate({
      responsive: {
        ...responsive,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-[#432818]">Visibilidade</h3>

        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hide-on-mobile"
              checked={responsive.hideOnMobile || false}
              onCheckedChange={checked => handleResponsiveUpdate('hideOnMobile', checked === true)}
            />
            <Label htmlFor="hide-on-mobile">Ocultar em dispositivos móveis (sm)</Label>
          </div>
          {isMobile && responsive.hideOnMobile && (
            <p className="text-xs text-orange-500">
              Este componente está oculto em dispositivos móveis. A visualização atual mostra como
              ficará em desktop.
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="hide-on-tablet"
            checked={responsive.hideOnTablet || false}
            onCheckedChange={checked => handleResponsiveUpdate('hideOnTablet', checked === true)}
          />
          <Label htmlFor="hide-on-tablet">Ocultar em tablets (md)</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="hide-on-desktop"
            checked={responsive.hideOnDesktop || false}
            onCheckedChange={checked => handleResponsiveUpdate('hideOnDesktop', checked === true)}
          />
          <Label htmlFor="hide-on-desktop">Ocultar em desktop (lg, xl)</Label>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-[#432818]">Tamanho</h3>

        <div className="space-y-2">
          <Label htmlFor="mobile-width">Largura em dispositivos móveis</Label>
          <Select
            value={responsive.mobileWidth || 'full'}
            onValueChange={value => handleResponsiveUpdate('mobileWidth', value)}
          >
            <SelectTrigger id="mobile-width">
              <SelectValue placeholder="Selecione a largura" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Largura completa</SelectItem>
              <SelectItem value="auto">Automática</SelectItem>
              <SelectItem value="3/4">3/4</SelectItem>
              <SelectItem value="1/2">1/2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tablet-width">Largura em tablets</Label>
          <Select
            value={responsive.tabletWidth || 'full'}
            onValueChange={value => handleResponsiveUpdate('tabletWidth', value)}
          >
            <SelectTrigger id="tablet-width">
              <SelectValue placeholder="Selecione a largura" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Largura completa</SelectItem>
              <SelectItem value="auto">Automática</SelectItem>
              <SelectItem value="3/4">3/4</SelectItem>
              <SelectItem value="1/2">1/2</SelectItem>
              <SelectItem value="1/3">1/3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
