// Guards the test harness that slice 0.5 (Dexie) depends on.
describe('test environment', () => {
  it('provides an IndexedDB implementation via fake-indexeddb', async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('harness-check', 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore('items', { keyPath: 'id' });
      };
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        reject(request.error ?? new Error('open failed'));
      };
    });
    expect(Array.from(db.objectStoreNames)).toEqual(['items']);
    db.close();
  });
});
