import React, { useState } from 'react';
import { TemplateEngineList } from './TemplateEngineList';
import { TemplateEngineEditor } from './TemplateEngineEditor';

export const TemplateEnginePage: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);
  return <div className="max-w-5xl mx-auto p-6 space-y-6">
    {!openId && <TemplateEngineList onOpen={setOpenId} />}
    {openId && <TemplateEngineEditor id={openId} onBack={() => setOpenId(null)} />}
  </div>;
};
