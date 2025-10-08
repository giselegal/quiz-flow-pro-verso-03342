// Mock mais completo de IndexedDB para testes que usam transactions
// Não implementa toda a API, apenas o necessário para os serviços atuais.

interface MockStoreData { [key: string]: any }

class MockIDBRequest<T = any> implements IDBRequest<T> {
    result: any = undefined;
    error: any = null;
    source: any = null;
    transaction: any = null;
    readyState: IDBRequestReadyState = 'pending';
    onsuccess: ((this: IDBRequest<T>, ev: Event) => any) | null = null;
    onerror: ((this: IDBRequest<T>, ev: Event) => any) | null = null;
    onupgradeneeded: any = null; // só presente em open
    onblocked: any = null;
    addEventListener(): any { /* noop */ }
    removeEventListener(): any { /* noop */ }
    dispatchEvent(): boolean { return true; }
}

class MockObjectStore {
    name: string;
    data: MockStoreData;
    keyPath: string | null;
    indexes: Record<string, any> = {};
    constructor(name: string, data: MockStoreData, keyPath: string | null) {
        this.name = name; this.data = data; this.keyPath = keyPath;
    }
    createIndex(name: string) { this.indexes[name] = true; return {}; }
    put(value: any) {
        const req = new MockIDBRequest();
        setTimeout(() => {
            const key = this.keyPath ? value[this.keyPath] : value.id;
            this.data[key] = value;
            req.result = key; req.readyState = 'done'; req.onsuccess && req.onsuccess(new Event('success'));
        }, 0);
        return req as unknown as IDBRequest<IDBValidKey>;
    }
    get(key: IDBValidKey) {
        const req = new MockIDBRequest();
        setTimeout(() => {
            req.result = this.data[key as string] || undefined; req.readyState = 'done'; req.onsuccess && req.onsuccess(new Event('success'));
        }, 0);
        return req as unknown as IDBRequest<any>;
    }
    getAll() {
        const req = new MockIDBRequest();
        setTimeout(() => {
            req.result = Object.values(this.data); req.readyState = 'done'; req.onsuccess && req.onsuccess(new Event('success'));
        }, 0);
        return req as unknown as IDBRequest<any[]>;
    }
    delete(key: IDBValidKey) {
        const req = new MockIDBRequest();
        setTimeout(() => { delete this.data[key as string]; req.readyState = 'done'; req.onsuccess && req.onsuccess(new Event('success')); }, 0);
        return req as unknown as IDBRequest<undefined>;
    }
    clear() {
        const req = new MockIDBRequest();
        setTimeout(() => { Object.keys(this.data).forEach(k => delete this.data[k]); req.readyState = 'done'; req.onsuccess && req.onsuccess(new Event('success')); }, 0);
        return req as unknown as IDBRequest<undefined>;
    }
    count() {
        const req = new MockIDBRequest();
        setTimeout(() => { req.result = Object.keys(this.data).length; req.readyState = 'done'; req.onsuccess && req.onsuccess(new Event('success')); }, 0);
        return req as unknown as IDBRequest<number>;
    }
}

class MockIDBDatabase implements IDBDatabase {
    name = 'QuizQuestFunnelDB';
    version = 1;
    objectStoreNames = { contains: (n: string) => !!this.stores[n], length: 0, item: () => null, [Symbol.iterator]: function* () { } } as any;
    stores: Record<string, MockObjectStore> = {};
    close(): void { /* noop */ }
    createObjectStore(name: string, options?: IDBObjectStoreParameters): IDBObjectStore {
        const store = new MockObjectStore(name, {}, options?.keyPath || null);
        this.stores[name] = store;
        return store as unknown as IDBObjectStore;
    }
    deleteObjectStore(name: string): void { delete this.stores[name]; }
    transaction(storeNames: string | string[], mode?: IDBTransactionMode): IDBTransaction {
        const names = Array.isArray(storeNames) ? storeNames : [storeNames];
        const objectStores = names.map(n => this.stores[n]);
        const tx: any = {
            objectStore: (n: string) => this.stores[n],
            mode,
            oncomplete: null,
            onerror: null,
            onabort: null,
        };
        // Concluímos a transação assíncronamente após pequeno delay para permitir queue de requests
        setTimeout(() => { tx.oncomplete && tx.oncomplete(new Event('complete')); }, 5);
        return tx as IDBTransaction;
    }
    // Eventos não usados
    onabort: any; onclose: any; onerror: any; onversionchange: any;
}

// Instalar mock caso não exista ou seja muito simples
// @ts-ignore
if (!(global.indexedDB && (global.indexedDB as any).__qqcvMock)) {
    // @ts-ignore
    global.indexedDB = {
        __qqcvMock: true,
        open: () => {
            const req = new MockIDBRequest();
            const db = new MockIDBDatabase();
            // criar stores esperados
            db.createObjectStore('funnels', { keyPath: 'id' });
            db.createObjectStore('settings', { keyPath: 'id' });
            db.createObjectStore('metadata', { keyPath: 'key' });
            setTimeout(() => { req.result = db as any; req.readyState = 'done'; req.onsuccess && req.onsuccess(new Event('success')); }, 0);
            return req as any;
        }
    } as any;
}
