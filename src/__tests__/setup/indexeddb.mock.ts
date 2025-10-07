// Mock global simples de indexedDB para ambiente Vitest (happy-dom)
class IDBRequestMock {
    result: any = {};
    error: any = null;
    onsuccess: ((this: IDBRequestMock, ev: any) => any) | null = null;
    onerror: ((this: IDBRequestMock, ev: any) => any) | null = null;
    onupgradeneeded: ((this: IDBRequestMock, ev: any) => any) | null = null;
}
// @ts-ignore
if (!global.indexedDB) {
    // @ts-ignore
    global.indexedDB = {
        open: () => {
            const req = new IDBRequestMock();
            setTimeout(() => req.onsuccess && req.onsuccess.call(req, {} as any), 0);
            return req as any;
        }
    };
}
