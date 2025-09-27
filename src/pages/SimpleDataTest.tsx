import React from 'react';
import { populateDatabase, verifyDataInsertion } from '@/utils/populateTestData';

const SimpleDataTest = () => {
    const handlePopulate = async () => {
        console.log('Iniciando população do banco...');
        const result = await populateDatabase();
        console.log('Resultado:', result);
    };

    const handleVerify = async () => {
        console.log('Verificando dados...');
        const result = await verifyDataInsertion();
        console.log('Resultado:', result);
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Teste de Dados Simples</h1>

            <div className="space-y-4">
                <button
                    onClick={handlePopulate}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Popular Banco de Dados
                </button>

                <button
                    onClick={handleVerify}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ml-4"
                >
                    Verificar Dados
                </button>
            </div>

            <div className="mt-8">
                <h2 className="text-lg font-semibold mb-2">Links de Teste:</h2>
                <div className="space-y-2">
                    <div><a href="/admin" className="text-blue-600 hover:underline">/admin</a></div>
                    <div><a href="/dashboard" className="text-blue-600 hover:underline">/dashboard</a></div>
                    <div><a href="/admin/dashboard" className="text-blue-600 hover:underline">/admin/dashboard</a></div>
                </div>
            </div>
        </div>
    );
};

export default SimpleDataTest;