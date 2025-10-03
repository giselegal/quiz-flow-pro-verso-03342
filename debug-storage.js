/**
 * 🔍 SCRIPT PARA INSPECIONAR ARMAZENAMENTO DE ALTERAÇÕES
 * 
 * Execute no console do browser para ver onde suas alterações estão salvas
 */

// 1. VERIFICAR LOCALSTORAGE
console.log('📝 === LOCALSTORAGE ===');
Object.keys(localStorage)
    .filter(key => key.includes('funnel') || key.includes('editor') || key.includes('quiz'))
    .forEach(key => {
        try {
            const data = JSON.parse(localStorage.getItem(key));
            console.log(`${key}:`, data);
        } catch (e) {
            console.log(`${key}:`, localStorage.getItem(key));
        }
    });

// 2. VERIFICAR INDEXEDDB
console.log('\n🗃️ === INDEXEDDB ===');
const request = indexedDB.open('QuizQuestEditorDB');
request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction(['funnels'], 'readonly');
    const store = transaction.objectStore('funnels');
    const getAllRequest = store.getAll();

    getAllRequest.onsuccess = () => {
        console.log('IndexedDB funnels:', getAllRequest.result);
    };
};

// 3. VERIFICAR ESTADO ATUAL NO REACT
console.log('\n⚛️ === REACT STATE ===');
// Execute no componente:
// console.log('Current funnel:', crud.currentFunnel);
// console.log('Current steps:', steps);

// 4. VERIFICAR SUPABASE (se logado)
console.log('\n🌐 === SUPABASE ===');
console.log('Para ver dados do Supabase, verifique o painel admin ou use as queries SQL');