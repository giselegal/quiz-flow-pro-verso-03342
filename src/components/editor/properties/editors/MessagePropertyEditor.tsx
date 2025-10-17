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
import { Textarea } from '@/components/ui/textarea';
import { Block } from '@/types/editor';
import { AlertCircle, CheckCircle2, FileText, Info, MessageSquare } from 'lucide-react';
import React from 'react';

interface MessagePropertyEditorProps {
    block: Block;
    onUpdate: (updates: Partial<Block>) => void;
    isPreviewMode?: boolean;
}

export const MessagePropertyEditor: React.FC<MessagePropertyEditorProps> = ({
    block,
    onUpdate,
    isPreviewMode = false,
}) => {
    const content = block.content || {};

    // Propriedades específicas da mensagem
    const message = content.message || '';
    const icon = content.icon || 'info';
    const variant = content.variant || 'info';

    const handleContentUpdate = (field: string, value: any) => {
        const updates = {
            content: {
                ...content,
                [field]: value,
            },
        };
        onUpdate(updates);
    };

    const iconOptions = [
        { value: 'info', label: 'Informação', Icon: Info },
        { value: 'success', label: 'Sucesso', Icon: CheckCircle2 },
        { value: 'warning', label: 'Aviso', Icon: AlertCircle },
    ];

    const variantOptions = [
        { value: 'info', label: 'Informação', bgColor: 'bg-blue-50', textColor: 'text-blue-700', borderColor: 'border-blue-200' },
        { value: 'success', label: 'Sucesso', bgColor: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-200' },
        { value: 'warning', label: 'Aviso', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700', borderColor: 'border-yellow-200' },
    ];

    const currentVariant = variantOptions.find((v) => v.value === variant) || variantOptions[0];
    const currentIcon = iconOptions.find((i) => i.value === icon) || iconOptions[0];
    const IconComponent = currentIcon.Icon;

    return (
        <div className="space-y-4 p-4">
            {/* Preview */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Preview da Mensagem
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className={`flex gap-3 p-4 rounded-lg border ${currentVariant.bgColor} ${currentVariant.borderColor}`}>
                        <IconComponent className={`w-5 h-5 flex-shrink-0 ${currentVariant.textColor}`} />
                        <p className={`text-sm ${currentVariant.textColor}`}>
                            {message || 'Sua mensagem aparecerá aqui...'}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Separator />

            {/* Conteúdo */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Conteúdo
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Mensagem */}
                    <div className="space-y-2">
                        <Label htmlFor="message-text">Mensagem</Label>
                        <Textarea
                            id="message-text"
                            value={message}
                            onChange={(e) => handleContentUpdate('message', e.target.value)}
                            placeholder="Digite sua mensagem aqui..."
                            rows={4}
                        />
                        <p className="text-xs text-muted-foreground">
                            {message.length} caracteres
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Aparência */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Aparência
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Variante */}
                    <div className="space-y-2">
                        <Label htmlFor="message-variant">Tipo de Mensagem</Label>
                        <Select
                            value={variant}
                            onValueChange={(value) => handleContentUpdate('variant', value)}
                        >
                            <SelectTrigger id="message-variant">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {variantOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Ícone */}
                    <div className="space-y-2">
                        <Label htmlFor="message-icon">Ícone</Label>
                        <Select
                            value={icon}
                            onValueChange={(value) => handleContentUpdate('icon', value)}
                        >
                            <SelectTrigger id="message-icon">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {iconOptions.map((option) => {
                                    const Icon = option.Icon;
                                    return (
                                        <SelectItem key={option.value} value={option.value}>
                                            <div className="flex items-center gap-2">
                                                <Icon className="w-4 h-4" />
                                                {option.label}
                                            </div>
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
