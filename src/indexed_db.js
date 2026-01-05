const DB_NAME = "la-belle-nathalie";
const DB_VERSION = 1;
const STORE_NAME = "images";

let dbPromise = null;

export function resetDBCache() {
  dbPromise = null;
}

// ensures single cached open connection
export function getDB() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);

      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      req.onsuccess = () => {
        const db = req.result;

        // if DB version changed elsewhere, close and clear cache so next getDB will re-open
        db.onversionchange = () => {
          try { db.close(); } catch (err) { /* ignore */ }
          resetDBCache();
        };

        resolve(db);
      };

      req.onerror = (e) => {
        resetDBCache();
        reject(e.target.error);
      };
    });
  };
  return dbPromise;
};

// safe wrapper that retries once if the DB was deleted mid-session
async function withDB(fn) {
  try {
    const db = await getDB();
    return await fn(db);
  } catch (err) {
    // common case: DB removed/closed while open -> reset and try once
    resetDBCache();
    const db = await getDB();
    return await fn(db);
  };
};

// public API
export const saveImageArr = async (key, blob_obj) => {
  return withDB((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(blob_obj, key);
    tx.oncomplete = () => resolve();
    tx.onerror = (e) => reject(e.target.error);
  }));
};

export const getImageArr = async (key) => {
  return withDB((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = (e) => reject(e.target.error);
  }));
};

export const deleteImageArr = async (key) => {
  return withDB((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = (e) => reject(e.target.error);
  }));
};
