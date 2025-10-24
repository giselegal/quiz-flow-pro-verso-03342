// Stub mínimos para APIs do navegador ausentes no ambiente de teste
if (!(globalThis as any).indexedDB) {
  (globalThis as any).indexedDB = {
    open: () => {
      const req: any = { onerror: null, onsuccess: null, result: {} };
      setTimeout(() => req.onsuccess && req.onsuccess({ target: { result: {} } }), 0);
      return req;
    }
  };
}
