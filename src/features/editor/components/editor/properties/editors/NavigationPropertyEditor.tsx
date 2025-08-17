import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Block } from '@/types/editor';
import {
  ChevronDown,
  Eye,
  Home,
  Info,
  Mail,
  Menu,
  Navigation,
  Phone,
  Plus,
  Settings,
  Trash2,
  User,
} from 'lucide-react';
import React from 'react';
import { PropertyNumber } from '../components/PropertyNumber';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  target?: string;
  active?: boolean;
  children?: NavigationItem[];
}

interface NavigationPropertyEditorProps {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
  isPreviewMode?: boolean;
}

export const NavigationPropertyEditor: React.FC<NavigationPropertyEditorProps> = ({
  block,
  onUpdate,
  isPreviewMode = false,
}) => {
  // Propriedades específicas da navegação - com cast seguro
  const items: NavigationItem[] =
    Array.isArray(block.content?.items) &&
    block.content.items.length > 0 &&
    typeof block.content.items[0] === 'object' &&
    'label' in block.content.items[0]
      ? (block.content.items as unknown as NavigationItem[])
      : [
          { id: '1', label: 'Home', href: '/', icon: 'home' },
          { id: '2', label: 'Sobre', href: '/sobre', icon: 'info' },
        ];
  const layout = block.content?.layout || 'horizontal';
  const alignment = block.content?.alignment || 'left';
  const extendedAlignment = alignment as
    | 'left'
    | 'center'
    | 'right'
    | 'space-between'
    | 'space-around';
  const showIcons = block.content?.showIcons || true;
  const showMobileMenu = block.content?.showMobileMenu || true;
  const backgroundColor = block.content?.backgroundColor || 'transparent';
  const textColor = block.content?.textColor || '#333333';
  const hoverColor = block.content?.hoverColor || '#B89B7A';
  const activeColor = block.content?.activeColor || '#B89B7A';
  const fontSize = block.content?.fontSize || 16;
  const spacing = block.content?.spacing || 16;
  const borderRadius = block.content?.borderRadius || 0;
  const hasBorder = block.content?.hasBorder || false;
  const borderColor = block.content?.borderColor || '#E5E5E5';
  const isSticky = block.content?.isSticky || false;
  const dropdownStyle = block.content?.dropdownStyle || 'hover';

  const handleContentUpdate = (field: string, value: any) => {
    const updates = {
      content: {
        ...block.content,
        [field]: value,
      },
    };
    onUpdate(updates);
  };

  const layoutOptions = [
    { value: 'horizontal', label: 'Horizontal' },
    { value: 'vertical', label: 'Vertical' },
    { value: 'dropdown', label: 'Menu Dropdown' },
    { value: 'hamburger', label: 'Menu Hambúrguer' },
  ];

  const alignmentOptions = [
    { value: 'left', label: 'Esquerda' },
    { value: 'center', label: 'Centro' },
    { value: 'right', label: 'Direita' },
    { value: 'space-between', label: 'Espaçado' },
    { value: 'space-around', label: 'Distribuído' },
  ];

  const iconOptions = [
    { value: '', label: 'Nenhum' },
    { value: 'home', label: 'Home', icon: Home },
    { value: 'user', label: 'Usuário', icon: User },
    { value: 'settings', label: 'Configurações', icon: Settings },
    { value: 'mail', label: 'Email', icon: Mail },
    { value: 'phone', label: 'Telefone', icon: Phone },
    { value: 'info', label: 'Informações', icon: Info },
  ];

  const dropdownStyleOptions = [
    { value: 'hover', label: 'Ao passar mouse' },
    { value: 'click', label: 'Ao clicar' },
  ];

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      home: Home,
      user: User,
      settings: Settings,
      mail: Mail,
      phone: Phone,
      info: Info,
    };
    return iconMap[iconName];
  };

  const handleItemsUpdate = (newItems: any[]) => {
    const formattedItems: NavigationItem[] = newItems.map((item, index) => ({
      id: item.id || `item-${index + 1}`,
      label: item.label || `Item ${index + 1}`,
      href: item.href || '#',
      icon: item.icon || '',
      target: item.target || '_self',
      active: item.active || false,
      children: item.children || [],
    }));
    handleContentUpdate('items', formattedItems);
  };

  const renderNavigationItem = (item: NavigationItem, isChild = false) => {
    const IconComponent = item.icon ? getIconComponent(item.icon) : null;

    const itemStyles = {
      color: item.active ? activeColor : textColor,
      fontSize: `${fontSize}px`,
      padding: isChild ? '6px 12px' : '8px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      textDecoration: 'none',
      borderRadius: `${borderRadius}px`,
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      backgroundColor: item.active ? `${activeColor}15` : 'transparent',
    };

    return (
      <div key={item.id} style={itemStyles} className="hover:bg-opacity-10">
        {showIcons && IconComponent && <IconComponent className="h-4 w-4" />}
        <span>{item.label}</span>
        {item.children && item.children.length > 0 && <ChevronDown className="h-4 w-4 ml-auto" />}
      </div>
    );
  };

  const renderPreview = () => {
    const containerStyles = {
      backgroundColor,
      borderRadius: `${borderRadius}px`,
      border: hasBorder ? `1px solid ${borderColor}` : 'none',
      padding: '12px',
      position: isSticky ? ('sticky' as const) : ('static' as const),
      top: isSticky ? 0 : 'auto',
    };

    const navigationStyles = {
      display: 'flex',
      flexDirection: layout === 'vertical' ? ('column' as const) : ('row' as const),
      alignItems: layout === 'vertical' ? 'stretch' : 'center',
      justifyContent:
        extendedAlignment === 'space-between'
          ? 'space-between'
          : extendedAlignment === 'space-around'
            ? 'space-around'
            : alignment === 'center'
              ? 'center'
              : alignment === 'right'
                ? 'flex-end'
                : 'flex-start',
      gap: `${spacing}px`,
      width: '100%',
    };

    if (layout === 'hamburger') {
      return (
        <div style={containerStyles}>
          <div className="flex items-center justify-between">
            <div className="text-lg font-medium">Menu</div>
            <Menu className="h-6 w-6" style={{ color: textColor }} />
          </div>
        </div>
      );
    }

    if (layout === 'dropdown') {
      return (
        <div style={containerStyles}>
          <div className="relative inline-block">
            <button
              className="flex items-center gap-2 px-4 py-2 border rounded"
              style={{ borderColor, color: textColor }}
            >
              Menu <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div style={containerStyles}>
        <nav style={navigationStyles}>{items.map(item => renderNavigationItem(item))}</nav>
      </div>
    );
  };

  if (isPreviewMode) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-[#B89B7A]" />
            Preview: Navegação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 bg-gray-50 min-h-[100px]">{renderPreview()}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5 text-[#B89B7A]" />
          Propriedades: Navegação
          <Badge variant="secondary" className="ml-auto">
            {items.length} {items.length === 1 ? 'item' : 'itens'}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Itens de Navegação */}
        <div className="space-y-2">
          <Label>Itens de Navegação</Label>
          <div className="space-y-3">
            {items.map((item, index) => (
              <Card key={item.id} className="p-3 border">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Texto</Label>
                      <Input
                        value={item.label || ''}
                        onChange={e => {
                          const updatedItems = [...items];
                          updatedItems[index] = { ...updatedItems[index], label: e.target.value };
                          handleItemsUpdate(updatedItems);
                        }}
                        placeholder="Texto do menu"
                        className="h-8"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">Link</Label>
                      <Input
                        value={item.href || ''}
                        onChange={e => {
                          const updatedItems = [...items];
                          updatedItems[index] = { ...updatedItems[index], href: e.target.value };
                          handleItemsUpdate(updatedItems);
                        }}
                        placeholder="/pagina ou #secao"
                        className="h-8"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Ícone</Label>
                      <Select
                        value={item.icon || ''}
                        onValueChange={value => {
                          const updatedItems = [...items];
                          updatedItems[index] = { ...updatedItems[index], icon: value };
                          handleItemsUpdate(updatedItems);
                        }}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {iconOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                {option.icon && <option.icon className="h-3 w-3" />}
                                <span className="text-xs">{option.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">Abrir</Label>
                      <Select
                        value={item.target || '_self'}
                        onValueChange={value => {
                          const updatedItems = [...items];
                          updatedItems[index] = { ...updatedItems[index], target: value };
                          handleItemsUpdate(updatedItems);
                        }}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="_self">Mesma aba</SelectItem>
                          <SelectItem value="_blank">Nova aba</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-center pt-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={item.active || false}
                          onCheckedChange={checked => {
                            const updatedItems = [...items];
                            updatedItems[index] = { ...updatedItems[index], active: checked };
                            handleItemsUpdate(updatedItems);
                          }}
                          className="scale-75"
                        />
                        <Label className="text-xs">Ativo</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const newItem: NavigationItem = {
                  id: `item-${Date.now()}`,
                  label: `Item ${items.length + 1}`,
                  href: '#',
                  icon: '',
                  target: '_self',
                  active: false,
                };
                handleItemsUpdate([...items, newItem]);
              }}
              disabled={items.length >= 10}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Item
            </Button>

            {items.length > 1 && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const updatedItems = items.slice(0, -1);
                  handleItemsUpdate(updatedItems);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remover Último
              </Button>
            )}
          </div>
        </div>

        <Separator />

        {/* Layout */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Layout</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="layout">Tipo de Layout</Label>
              <Select value={layout} onValueChange={value => handleContentUpdate('layout', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {layoutOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="alignment">Alinhamento</Label>
              <Select
                value={alignment}
                onValueChange={value => handleContentUpdate('alignment', value)}
                disabled={layout === 'hamburger' || layout === 'dropdown'}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {alignmentOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {layout === 'dropdown' && (
            <div className="space-y-2">
              <Label htmlFor="dropdownStyle">Comportamento do Dropdown</Label>
              <Select
                value={dropdownStyle}
                onValueChange={value => handleContentUpdate('dropdownStyle', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dropdownStyleOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <Separator />

        {/* Aparência */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Aparência</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <PropertyNumber
                label="Tamanho da Fonte"
                value={fontSize}
                onChange={(value: number) => handleContentUpdate('fontSize', value)}
                min={12}
                max={24}
                step={1}
              />
              <span className="text-xs text-gray-500">pixels</span>
            </div>

            <div className="space-y-2">
              <PropertyNumber
                label="Espaçamento"
                value={spacing}
                onChange={(value: number) => handleContentUpdate('spacing', value)}
                min={4}
                max={32}
                step={2}
              />
              <span className="text-xs text-gray-500">pixels</span>
            </div>
          </div>

          <div className="space-y-2">
            <PropertyNumber
              label="Border Radius"
              value={borderRadius}
              onChange={(value: number) => handleContentUpdate('borderRadius', value)}
              min={0}
              max={20}
              step={1}
            />
            <span className="text-xs text-gray-500">pixels</span>
          </div>
        </div>

        <Separator />

        {/* Cores */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Cores</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="backgroundColor">Cor de Fundo</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  id="backgroundColor"
                  value={backgroundColor === 'transparent' ? '#ffffff' : backgroundColor}
                  onChange={e => handleContentUpdate('backgroundColor', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <Input
                  value={backgroundColor}
                  onChange={e => handleContentUpdate('backgroundColor', e.target.value)}
                  placeholder="transparent"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="textColor">Cor do Texto</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  id="textColor"
                  value={textColor}
                  onChange={e => handleContentUpdate('textColor', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <Input
                  value={textColor}
                  onChange={e => handleContentUpdate('textColor', e.target.value)}
                  placeholder="#333333"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hoverColor">Cor ao Passar Mouse</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  id="hoverColor"
                  value={hoverColor}
                  onChange={e => handleContentUpdate('hoverColor', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <Input
                  value={hoverColor}
                  onChange={e => handleContentUpdate('hoverColor', e.target.value)}
                  placeholder="#B89B7A"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="activeColor">Cor do Item Ativo</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  id="activeColor"
                  value={activeColor}
                  onChange={e => handleContentUpdate('activeColor', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <Input
                  value={activeColor}
                  onChange={e => handleContentUpdate('activeColor', e.target.value)}
                  placeholder="#B89B7A"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Configurações */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Configurações</h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="showIcons">Mostrar Ícones</Label>
                <p className="text-sm text-gray-500">Exibe ícones ao lado dos itens do menu</p>
              </div>
              <Switch
                id="showIcons"
                checked={showIcons}
                onCheckedChange={checked => handleContentUpdate('showIcons', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="showMobileMenu">Menu Mobile</Label>
                <p className="text-sm text-gray-500">Adapta para dispositivos móveis</p>
              </div>
              <Switch
                id="showMobileMenu"
                checked={showMobileMenu}
                onCheckedChange={checked => handleContentUpdate('showMobileMenu', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isSticky">Navegação Fixa</Label>
                <p className="text-sm text-gray-500">Menu permanece visível ao rolar a página</p>
              </div>
              <Switch
                id="isSticky"
                checked={isSticky}
                onCheckedChange={checked => handleContentUpdate('isSticky', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="hasBorder">Mostrar Borda</Label>
                <p className="text-sm text-gray-500">Adiciona borda ao redor da navegação</p>
              </div>
              <Switch
                id="hasBorder"
                checked={hasBorder}
                onCheckedChange={checked => handleContentUpdate('hasBorder', checked)}
              />
            </div>
          </div>

          {hasBorder && (
            <div className="space-y-2">
              <Label htmlFor="borderColor">Cor da Borda</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  id="borderColor"
                  value={borderColor}
                  onChange={e => handleContentUpdate('borderColor', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <Input
                  value={borderColor}
                  onChange={e => handleContentUpdate('borderColor', e.target.value)}
                  placeholder="#E5E5E5"
                  className="flex-1"
                />
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Preview */}
        <div className="space-y-2">
          <Label>Preview</Label>
          <div className="border rounded-lg p-4 bg-gray-50 min-h-[80px]">{renderPreview()}</div>
        </div>
      </CardContent>
    </Card>
  );
};
