// src/components/editor/step-editors/OfferStepEditor.tsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { OfferStepSchema } from '@/schemas/offer.schema';
import { slugify } from '@/utils/normalize';

export default function OfferStepEditor({ step, props, onApply }: any) {
    const { handleSubmit, reset } = useForm({ resolver: zodResolver(OfferStepSchema), defaultValues: props });
    const [offerMap, setOfferMap] = useState<Record<string, any>>(props?.offerMap || {});
    useEffect(() => { reset(props); setOfferMap(props?.offerMap || {}); }, [props, reset]);

    const addOffer = () => {
        const key = slugify(`nova-oferta-${Object.keys(offerMap).length + 1}`);
        setOfferMap((m) => ({ ...m, [key]: { title: 'Nova oferta', price: null, ctaLabel: 'Aproveitar' } }));
    };
    const updateOffer = (key: string, field: string, value: any) => setOfferMap((m) => ({ ...m, [key]: { ...m[key], [field]: value } }));
    const removeOffer = (key: string) => setOfferMap((m) => { const n = { ...m }; delete n[key]; return n; });

    return (
        <form onSubmit={handleSubmit(() => onApply({ offerMap }))} className="space-y-3">
            <div className="flex justify-between items-center">
                <h4 className="font-medium">Ofertas</h4>
                <button type="button" className="btn btn-secondary" onClick={addOffer}>Adicionar</button>
            </div>
            <div className="space-y-4">
                {Object.entries(offerMap).map(([key, o]) => (
                    <div key={key} className="rounded border p-3 space-y-2">
                        <div className="flex justify-between items-center">
                            <strong>{key}</strong>
                            <button type="button" className="btn btn-ghost" onClick={() => removeOffer(key)}>Remover</button>
                        </div>
                        <div>
                            <label className="text-xs">Título</label>
                            <input className="w-full" value={o.title || ''} onChange={(e) => updateOffer(key, 'title', e.target.value)} />
                        </div>
                        <div>
                            <label className="text-xs">Descrição</label>
                            <textarea className="w-full" value={o.description || ''} onChange={(e) => updateOffer(key, 'description', e.target.value)} />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label className="text-xs">Preço</label>
                                <input type="number" className="w-full" value={o.price ?? ''} onChange={(e) => updateOffer(key, 'price', e.target.value === '' ? null : Number(e.target.value))} />
                            </div>
                            <div>
                                <label className="text-xs">Moeda</label>
                                <input className="w-full" value={o.currency || 'BRL'} onChange={(e) => updateOffer(key, 'currency', e.target.value)} />
                            </div>
                            <div>
                                <label className="text-xs">Imagem (URL)</label>
                                <input className="w-full" value={o.image || ''} onChange={(e) => updateOffer(key, 'image', e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-xs">CTA label</label>
                                <input className="w-full" value={o.ctaLabel || 'Aproveitar'} onChange={(e) => updateOffer(key, 'ctaLabel', e.target.value)} />
                            </div>
                            <div>
                                <label className="text-xs">CTA URL</label>
                                <input className="w-full" value={o.ctaUrl || ''} onChange={(e) => updateOffer(key, 'ctaUrl', e.target.value)} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div><button type="submit" className="btn btn-primary">Aplicar</button></div>
        </form>
    );
}
