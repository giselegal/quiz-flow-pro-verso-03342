import React, { useState } from 'react';
import { useTemplatesList, useCreateTemplate } from '../../../api/templates/hooks';

export const TemplateEngineList: React.FC<{ onOpen: (id: string) => void }> = ({ onOpen }) => {
  const { data, isLoading, error } = useTemplatesList();
  const createMut = useCreateTemplate();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  return <div className="space-y-4">
    <h1 className="text-xl font-semibold">Template Engine (Quiz)</h1>
    <form onSubmit={e => { e.preventDefault(); if (!name || !slug) return; createMut.mutate({ name, slug }); }} className="flex gap-2 flex-wrap items-end">
      <div className="flex flex-col">
        <label className="text-xs">Nome</label>
        <input className="border px-2 py-1 rounded" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div className="flex flex-col">
        <label className="text-xs">Slug</label>
        <input className="border px-2 py-1 rounded" value={slug} onChange={e => setSlug(e.target.value)} />
      </div>
      <button className="bg-blue-600 text-white px-3 py-1 rounded" disabled={createMut.isPending}>Criar</button>
    </form>
    {isLoading && <div>Carregando...</div>}
    {error && <div className="text-red-600">{(error as Error).message}</div>}
    <table className="w-full text-sm border">
      <thead className="bg-gray-50">
        <tr><th className="p-2 text-left">Nome</th><th className="p-2">Slug</th><th className="p-2">Atualizado</th><th className="p-2">Ações</th></tr>
      </thead>
      <tbody>
        {data?.map(t => <tr key={t.id} className="border-t hover:bg-gray-50">
          <td className="p-2">{t.name}</td>
            <td className="p-2">{t.slug}</td>
            <td className="p-2">{new Date(t.updatedAt).toLocaleString()}</td>
            <td className="p-2"><button onClick={() => onOpen(t.id)} className="text-blue-600 hover:underline">Abrir</button></td>
        </tr>)}
        {data?.length === 0 && <tr><td colSpan={4} className="p-4 text-center text-gray-500">Nenhum template</td></tr>}
      </tbody>
    </table>
  </div>;
};
