/**
 * 🔍 VERIFICAÇÃO COMPLETA DE TEMPLATES
 * Script para diagnosticar se há sources ocultas de templates
 */

import React, { useState, useEffect } from 'react';
import { AVAILABLE_TEMPLATES, TemplateService } from '../../config/templates';

// Verificar hooks e serviços relacionados
import useMyTemplates from '../../hooks/useMyTemplates';

const TemplateInvestigationPage: React.FC = () => {
    const [localStorageTemplates, setLocalStorageTemplates] = useState<any[]>([]);
    const [supabaseData, setSupabaseData] = useState<any>(null);
    const [apiData, setApiData] = useState<any>(null);
    const [cacheData, setCacheData] = useState<any>(null);

    // Hook para templates do usuário
    const { templates: userTemplates, isLoading: userTemplatesLoading } = useMyTemplates();

    useEffect(() => {
        investigateAllSources();
    }, []);

    const investigateAllSources = async () => {
        console.log('🕵️ Iniciando investigação completa de templates...');

        // 1. Verificar localStorage
        checkLocalStorage();

        // 2. Verificar IndexedDB
        await checkIndexedDB();

        // 3. Tentar buscar do Supabase
        await checkSupabase();

        // 4. Verificar API endpoints
        await checkAPIEndpoints();

        // 5. Verificar cache/arquivos estáticos
        await checkStaticFiles();

        console.log('🔍 Investigação completa finalizada!');
    };

    const checkLocalStorage = () => {
        console.log('📦 Verificando localStorage...');
        const keys = Object.keys(localStorage);
        const templateKeys = keys.filter(key => key.toLowerCase().includes('template'));

        const foundTemplates: any[] = [];
        templateKeys.forEach(key => {
            try {
                const data = JSON.parse(localStorage.getItem(key) || '{}');
                foundTemplates.push({ key, data });
            } catch (e) {
                console.warn(`❌ Erro ao parsear ${key}:`, e);
            }
        });

        setLocalStorageTemplates(foundTemplates);
        console.log(`📦 localStorage: ${foundTemplates.length} items encontrados`);
    };

    const checkIndexedDB = async () => {
        console.log('🗄️ Verificando IndexedDB...');
        try {
            // Verificar bases comuns
            const dbs = ['templates', 'quiz-templates', 'funnel-templates'];
            // IndexedDB é complexo de investigar via JS, vamos pelo menos tentar abrir
            for (const dbName of dbs) {
                try {
                    const request = indexedDB.open(dbName);
                    request.onsuccess = () => {
                        console.log(`✅ IndexedDB encontrado: ${dbName}`);
                        request.result.close();
                    };
                } catch (e) {
                    console.log(`❌ IndexedDB não encontrado: ${dbName}`);
                }
            }
        } catch (e) {
            console.log('❌ Erro ao verificar IndexedDB:', e);
        }
    };

    const checkSupabase = async () => {
        console.log('☁️ Verificando Supabase...');
        try {
            // Tentar importar e usar o cliente Supabase
            const { supabase } = await import('../../integrations/supabase/client');

            // Tentar buscar templates
            const { data, error } = await supabase.from('templates').select('*');

            if (error) {
                console.log('❌ Erro Supabase:', error);
                setSupabaseData({ error: error.message });
            } else {
                console.log('✅ Dados Supabase encontrados:', data);
                setSupabaseData(data);
            }
        } catch (e) {
            console.log('❌ Erro ao acessar Supabase:', e);
            setSupabaseData({ error: e.toString() });
        }
    };

    const checkAPIEndpoints = async () => {
        console.log('🌐 Verificando endpoints de API...');
        const endpoints = [
            '/api/templates',
            '/api/templates/list',
            '/api/funnel-templates',
            '/templates/list.json',
            '/data/templates.json'
        ];

        const results: any = {};

        for (const endpoint of endpoints) {
            try {
                console.log(`🔍 Testando ${endpoint}...`);
                const response = await fetch(endpoint);
                if (response.ok) {
                    const data = await response.json();
                    results[endpoint] = data;
                    console.log(`✅ ${endpoint} retornou dados:`, data);
                } else {
                    results[endpoint] = { error: `Status ${response.status}` };
                    console.log(`❌ ${endpoint} erro: ${response.status}`);
                }
            } catch (e) {
                results[endpoint] = { error: e.toString() };
                console.log(`❌ ${endpoint} erro:`, e);
            }
        }

        setApiData(results);
    };

    const checkStaticFiles = async () => {
        console.log('📁 Verificando arquivos estáticos...');
        const staticFiles = [
            '/templates/templates.json',
            '/cache/templates.json',
            '/public/templates.json',
            '/data/funnel-templates.json'
        ];

        const results: any = {};

        for (const file of staticFiles) {
            try {
                const response = await fetch(file);
                if (response.ok) {
                    const data = await response.json();
                    results[file] = data;
                    console.log(`✅ ${file} encontrado:`, data);
                } else {
                    results[file] = { error: `Status ${response.status}` };
                }
            } catch (e) {
                results[file] = { error: e.toString() };
            }
        }

        setCacheData(results);
    };

    return (
        <div className="p-8 min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-center">🕵️ Investigação Completa de Templates</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Templates Configurados */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4">📋 Templates Configurados</h2>
                        <p className="mb-2"><strong>Total:</strong> {AVAILABLE_TEMPLATES.length}</p>
                        <p className="mb-2"><strong>Ativos:</strong> {TemplateService.getActiveTemplates().length}</p>
                        <p className="mb-4"><strong>Quiz21:</strong> {TemplateService.getTemplate('quiz21StepsComplete') ? '✅' : '❌'}</p>

                        <div className="text-sm space-y-1">
                            {AVAILABLE_TEMPLATES.slice(0, 5).map(t => (
                                <div key={t.id} className="flex justify-between">
                                    <span className="truncate">{t.name.substring(0, 20)}</span>
                                    <span>{t.isActive ? '✅' : '❌'}</span>
                                </div>
                            ))}
                            {AVAILABLE_TEMPLATES.length > 5 && (
                                <p className="text-gray-500">...e mais {AVAILABLE_TEMPLATES.length - 5}</p>
                            )}
                        </div>
                    </div>

                    {/* Templates do Usuário */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4">👤 Templates do Usuário</h2>
                        <p className="mb-2"><strong>Status:</strong> {userTemplatesLoading ? 'Carregando...' : 'Carregado'}</p>
                        <p className="mb-4"><strong>Quantidade:</strong> {userTemplates.length}</p>

                        {userTemplates.length > 0 && (
                            <div className="text-sm space-y-1">
                                {userTemplates.slice(0, 3).map(t => (
                                    <div key={t.id} className="p-2 bg-gray-50 rounded">
                                        <p className="font-medium">{t.name}</p>
                                        <p className="text-xs text-gray-600">ID: {t.id}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* LocalStorage */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4">📦 LocalStorage</h2>
                        <p className="mb-4"><strong>Items relacionados:</strong> {localStorageTemplates.length}</p>

                        {localStorageTemplates.slice(0, 3).map((item, i) => (
                            <div key={i} className="text-sm mb-2 p-2 bg-gray-50 rounded">
                                <p className="font-mono text-xs">{item.key}</p>
                                <p className="text-xs text-gray-600">
                                    {typeof item.data === 'object' ? Object.keys(item.data).length + ' keys' : 'string'}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Supabase */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4">☁️ Supabase</h2>
                        {supabaseData === null ? (
                            <p className="text-gray-500">Verificando...</p>
                        ) : supabaseData.error ? (
                            <div>
                                <p className="text-red-500 mb-2">❌ Erro</p>
                                <p className="text-xs text-red-400">{supabaseData.error}</p>
                            </div>
                        ) : (
                            <div>
                                <p className="text-green-500 mb-2">✅ Conectado</p>
                                <p className="text-sm">Templates: {Array.isArray(supabaseData) ? supabaseData.length : 'N/A'}</p>
                            </div>
                        )}
                    </div>

                    {/* API Endpoints */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4">🌐 API Endpoints</h2>
                        {apiData === null ? (
                            <p className="text-gray-500">Verificando...</p>
                        ) : (
                            <div className="space-y-2">
                                {Object.entries(apiData).map(([endpoint, data]: [string, any]) => (
                                    <div key={endpoint} className="text-xs">
                                        <p className="font-mono">{endpoint.substring(0, 20)}...</p>
                                        <p className={data.error ? 'text-red-500' : 'text-green-500'}>
                                            {data.error ? '❌' : '✅'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Arquivos Estáticos */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4">📁 Arquivos Estáticos</h2>
                        {cacheData === null ? (
                            <p className="text-gray-500">Verificando...</p>
                        ) : (
                            <div className="space-y-2">
                                {Object.entries(cacheData).map(([file, data]: [string, any]) => (
                                    <div key={file} className="text-xs">
                                        <p className="font-mono">{file.split('/').pop()}</p>
                                        <p className={data.error ? 'text-red-500' : 'text-green-500'}>
                                            {data.error ? '❌' : '✅'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">🔍 Resumo da Investigação</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold mb-2">📊 Sources Encontradas:</h3>
                            <ul className="text-sm space-y-1">
                                <li>✅ Templates configurados: {AVAILABLE_TEMPLATES.length}</li>
                                <li>{userTemplates.length > 0 ? '✅' : '❌'} Templates do usuário: {userTemplates.length}</li>
                                <li>{localStorageTemplates.length > 0 ? '✅' : '❌'} LocalStorage items: {localStorageTemplates.length}</li>
                                <li>{supabaseData && !supabaseData.error ? '✅' : '❌'} Supabase conectado</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">🎯 Quiz21StepsComplete:</h3>
                            <ul className="text-sm space-y-1">
                                <li>{TemplateService.getTemplate('quiz21StepsComplete') ? '✅' : '❌'} No config/templates</li>
                                <li>{userTemplates.find(t => t.id.includes('quiz21')) ? '✅' : '❌'} Nos templates do usuário</li>
                                <li>🔍 Verificação completa realizada</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplateInvestigationPage;