/**
 * 🔍 DEBUG PAGE - Verificar se o template está chegando no navegador
 */

import React, { useEffect, useState } from 'react';
import { quizLegacyTemplateAdapter } from '@/services/legacy/QuizLegacyTemplateAdapter';
import { normalizeStepBlocks } from '@/config/quizStepsComplete';

const TemplateDebugPage: React.FC = () => {
    const [templateInfo, setTemplateInfo] = useState<any>(null);
    const [normalizedInfo, setNormalizedInfo] = useState<any>(null);

    useEffect(() => {
        (async () => {
            console.log('🔍 TemplateDebugPage mounted');
            try {
                const all = await quizLegacyTemplateAdapter.getAll();
                const templateData = {
                    hasTemplate: !!all,
                    templateType: typeof all,
                    templateKeys: Object.keys(all),
                    keyCount: Object.keys(all).length,
                    sampleEntries: Object.entries(all).slice(0, 3).map(([k, v]) => [k, Array.isArray(v) ? `Array[${(v as any[]).length}]` : typeof v])
                };
                console.log('📦 Raw template data:', templateData);
                setTemplateInfo(templateData);

                const normalized = normalizeStepBlocks(all as any);
                const normalizedData = {
                    normalizedKeys: Object.keys(normalized),
                    keyCount: Object.keys(normalized).length,
                    stepBlocks: Object.entries(normalized).map(([k, v]) => [k, (v as any[]).length]),
                    specificSteps: {} as any
                };
                for (let i = 1; i <= 5; i++) {
                    const stepKey = `step-${i}`;
                    const blocks = (normalized as any)[stepKey];
                    normalizedData.specificSteps[i] = {
                        hasBlocks: !!blocks,
                        count: blocks?.length || 0,
                        types: blocks?.slice(0, 3).map((b: any) => b.type) || []
                    };
                }
                console.log('🔧 Normalized data:', normalizedData);
                setNormalizedInfo(normalizedData);
            } catch (err) {
                console.error('TemplateDebugPage load error', err);
            }
        })();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">🔍 Template Debug Page</h1>

                <div className="grid gap-6">
                    {/* Template Info */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">📦 Raw Template Info</h2>
                        {templateInfo ? (
                            <div className="space-y-2">
                                <div>Has Template: <span className="font-mono text-sm">{String(templateInfo.hasTemplate)}</span></div>
                                <div>Template Type: <span className="font-mono text-sm">{templateInfo.templateType}</span></div>
                                <div>Key Count: <span className="font-mono text-sm">{templateInfo.keyCount}</span></div>
                                <div>
                                    Keys:
                                    <div className="font-mono text-sm bg-gray-100 p-2 rounded mt-1">
                                        {templateInfo.templateKeys.join(', ')}
                                    </div>
                                </div>
                                <div>
                                    Sample Entries:
                                    <div className="font-mono text-sm bg-gray-100 p-2 rounded mt-1">
                                        {templateInfo.sampleEntries.map((entry: any, idx: number) => (
                                            <div key={idx}>{entry[0]}: {entry[1]}</div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>Loading...</div>
                        )}
                    </div>

                    {/* Normalized Info */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">🔧 Normalized Template Info</h2>
                        {normalizedInfo ? (
                            <div className="space-y-2">
                                <div>Normalized Key Count: <span className="font-mono text-sm">{normalizedInfo.keyCount}</span></div>
                                <div>
                                    Step Block Counts:
                                    <div className="font-mono text-sm bg-gray-100 p-2 rounded mt-1 max-h-40 overflow-y-auto">
                                        {normalizedInfo.stepBlocks.map((item: any, idx: number) => (
                                            <div key={idx}>{item[0]}: {item[1]} blocks</div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    First 5 Steps:
                                    <div className="font-mono text-sm bg-gray-100 p-2 rounded mt-1">
                                        {Object.entries(normalizedInfo.specificSteps).map(([step, data]: [string, any]) => (
                                            <div key={step}>
                                                Step {step}: {data.hasBlocks ? `✅ ${data.count} blocks` : '❌ no blocks'} ({data.types.join(', ')})
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>Loading...</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplateDebugPage;