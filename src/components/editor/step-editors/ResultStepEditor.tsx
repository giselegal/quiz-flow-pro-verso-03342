// src/components/editor/step-editors/ResultStepEditor.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResultStepSchema } from '@/schemas/result.schema';

export default function ResultStepEditor({ step, props, onApply }: any) {
    const { register, handleSubmit, reset, watch, setValue } = useForm({ resolver: zodResolver(ResultStepSchema), defaultValues: props });
    useEffect(() => reset(props), [props, reset]);
    const offersCsv = (props?.offersToShow || []).join(',');
    return (
        <form onSubmit={handleSubmit((data) => onApply(data))} className="space-y-3">
            <div>
                <label className="text-xs">Template do título</label>
                <input {...register('titleTemplate')} className="w-full" placeholder="Seu resultado: {{resultStyle}}" />
            </div>
            <div className="flex gap-2">
                <label><input type="checkbox" {...register('showPrimaryStyleCard')} /> Mostrar card principal</label>
                <label><input type="checkbox" {...register('showSecondaryStyles')} /> Mostrar estilos secundários</label>
            </div>
            <div>
                <label className="text-xs">Primary style ID</label>
                <input {...register('primaryStyleId')} className="w-full" placeholder="ex: style-a" />
            </div>
            <div>
                <label className="text-xs">Ofertas a exibir (IDs separados por vírgula)</label>
                <input
                    className="w-full"
                    defaultValue={offersCsv}
                    onChange={(e) => {
                        const v = e.currentTarget.value.split(',').map((s) => s.trim()).filter(Boolean);
                        setValue('offersToShow', v as any);
                    }}
                />
            </div>
            <div><button type="submit" className="btn btn-primary">Aplicar</button></div>
        </form>
    );
}
