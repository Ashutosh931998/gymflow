import { DB_PREFIX } from './constants';

export const DB = {
  key: (e: string) => `${DB_PREFIX}${e.toLowerCase().trim()}`,
  
  // Global registry for authentication
  getRegistry: () => {
    const r = localStorage.getItem(`${DB_PREFIX}registry`);
    return r ? JSON.parse(r) : {};
  },
  saveToRegistry: (email: string, data: { password?: string; role: string; gymName: string; name: string }) => {
    const r = DB.getRegistry();
    r[email.toLowerCase().trim()] = data;
    localStorage.setItem(`${DB_PREFIX}registry`, JSON.stringify(r));
  },
  removeFromRegistry: (email: string) => {
    const r = DB.getRegistry();
    delete r[email.toLowerCase().trim()];
    localStorage.setItem(`${DB_PREFIX}registry`, JSON.stringify(r));
  },

  load: (e: string) => {
    try {
      const r = localStorage.getItem(DB.key(e));
      return r ? JSON.parse(r) : null;
    } catch {
      return null;
    }
  },
  save: (e: string, d: any) => {
    try {
      localStorage.setItem(DB.key(e), JSON.stringify(d));
    } catch {}
  },
};
