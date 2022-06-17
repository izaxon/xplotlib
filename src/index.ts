export const Hello = (name: string) => `Hello ${name}`;

class IndexedDB {
  private static connect = (
    database: string,
    upgrade: ((this: IDBOpenDBRequest, ev: IDBVersionChangeEvent) => any) | null,
    version?: number,
  ) => {
    return new Promise<Event>((resolve: (e: Event) => void, reject: (e: Event) => void) => {
      const request = indexedDB.open(database, version);

      request.onsuccess = (e: Event) => {
        resolve(e);
      };

      request.onerror = (e) => {
        reject(e);
      };

      request.onupgradeneeded = upgrade;
    });
  };

  static create = (database: string, table: string, version?: number) => {
    return new Promise((resolve, reject) => {
      (async () => {
        IndexedDB.connect(
          database,
          (e) => {
            //@ts-ignore
            let db = e.target.result;
            const _store = db.createObjectStore(table, { keyPath: 'id', autoIncrement: true });
            resolve(db);
          },
          version,
        )
          .then(resolve)
          .catch(reject);
      })();
    });
  };

  static add = (db: any, table: string, item: any) => {
    db.transaction([table], 'readwrite').objectStore(table).add(item).onsuccess = () => {};
  };

  //   db.transaction(['todo'], 'readonly')
  //   .objectStore('todo')
  //   .get(1)
  //   .onsuccess = data => console.log( data.target.result );
}

export class XPlotLib {
  private db: any;

  constructor() {
    IndexedDB.create('xplot', 'data', 1)
      .then((db) => (this.db = db))
      .catch((e) => console.warn(e));
  }

  add(data: any) {
    IndexedDB.add(this.db, 'data', data);
  }
}
