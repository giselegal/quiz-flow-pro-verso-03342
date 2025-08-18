import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PopoverTrigger, Popover, PopoverContent } from '@/components/ui/popover';

interface StylePropertiesEditorProps {
  style: any;
  onUpdate: (style: any) => void;
}

const textAlignOptions = [
  { value: 'left', label: 'Esquerda' },
  { value: 'center', label: 'Centro' },
  { value: 'right', label: 'Direita' },
];

export function StylePropertiesEditor({ style, onUpdate }: StylePropertiesEditorProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-[#432818]">Cores</h3>

        <div className="space-y-2">
          <Label htmlFor="backgroundColor">Cor de Fundo</Label>
          <div className="flex gap-2">
            <div className="h-9 w-9 rounded-md border overflow-hidden">
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className="w-full h-full"
                    style={{
                      backgroundColor: style.backgroundColor || '#ffffff',
                    }}
                  />
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  {/* We'll replace this with a color picker component */}
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      '#ffffff',
                      '#f8f9fa',
                      '#e9ecef',
                      '#dee2e6',
                      '#ced4da',
                      '#B89B7A',
                      '#8F7A6A',
                      '#432818',
                      '#aa6b5d',
                      '#fffaf7',
                    ].map(color => (
                      <button
                        key={color}
                        className="w-8 h-8 rounded-md border"
                        style={{ backgroundColor: color }}
                        onClick={() => onUpdate({ backgroundColor: color })}
                      />
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <Input
              id="backgroundColor"
              value={style.backgroundColor || ''}
              onChange={e => onUpdate({ backgroundColor: e.target.value })}
              placeholder="#ffffff"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">Cor do Texto</Label>
          <div className="flex gap-2">
            <div className="h-9 w-9 rounded-md border overflow-hidden">
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className="w-full h-full"
                    style={{ backgroundColor: style.color || '#000000' }}
                  />
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  {/* We'll replace this with a color picker component */}
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      '#000000',
                      '#212529',
                      '#495057',
                      '#6c757d',
                      '#adb5bd',
                      '#B89B7A',
                      '#8F7A6A',
                      '#432818',
                      '#aa6b5d',
                      '#ffffff',
                    ].map(color => (
                      <button
                        key={color}
                        className="w-8 h-8 rounded-md border"
                        style={{ backgroundColor: color }}
                        onClick={() => onUpdate({ color: color })}
                      />
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <Input
              id="color"
              value={style.color || ''}
              onChange={e => onUpdate({ color: e.target.value })}
              placeholder="#000000"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-[#432818]">Espaçamento</h3>

        <div className="space-y-2">
          <Label htmlFor="padding">Preenchimento</Label>
          <Input
            id="padding"
            value={style.padding || ''}
            onChange={e => onUpdate({ padding: e.target.value })}
            placeholder="1rem"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="margin">Margem</Label>
          <Input
            id="margin"
            value={style.margin || ''}
            onChange={e => onUpdate({ margin: e.target.value })}
            placeholder="0"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-[#432818]">Aparência</h3>

        <div className="space-y-2">
          <Label htmlFor="borderRadius">Arredondamento de Bordas</Label>
          <Input
            id="borderRadius"
            value={style.borderRadius || ''}
            onChange={e => onUpdate({ borderRadius: e.target.value })}
            placeholder="0.375rem"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="textAlign">Alinhamento do Texto</Label>
          <Select
            value={style.textAlign || 'left'}
            onValueChange={value => onUpdate({ textAlign: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o alinhamento" />
            </SelectTrigger>
            <SelectContent>
              {textAlignOptions.filter(option => option.value && option.value !== '').map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
