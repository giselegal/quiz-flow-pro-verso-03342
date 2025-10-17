// src/components/editor/step-editors/TransitionStepEditor.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TransitionStepSchema } from '@/schemas/transition.schema';

export default function TransitionStepEditor({ step, props, onApply }: any) {
    const { register, handleSubmit, reset } = useForm({ resolver: zodResolver(TransitionStepSchema), defaultValues: props });
    useEffect(() => reset(props), [props, reset]);
    return (
        <form onSubmit={handleSubmit((data) => onApply(data))} className="space-y-3">
            <div><label className="text-xs">Título</label><input {...register('title')} className="w-full" /></div>
            <div><label className="text-xs">Texto</label><textarea {...register('text')} rows={3} className="w-full" /></div>
            <div className="flex gap-2"><label><input type="checkbox" {...register('showContinueButton')} /> Mostrar botão continuar</label></div>
            <div><button type="submit" className="btn btn-primary">Aplicar</button></div>
        </form>
    );
}
