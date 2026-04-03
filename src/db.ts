export const DB = {
  // Global registry for authentication
  getRegistry: async () => {
    try {
      const res = await fetch("/api/registry");
      return await res.json();
    } catch {
      return {};
    }
  },
  saveToRegistry: async (email: string, data: { password?: string; role: string; gymName: string; name: string }) => {
    try {
      await fetch("/api/registry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, data })
      });
    } catch {}
  },
  removeFromRegistry: async (email: string) => {
    try {
      await fetch(`/api/registry/${encodeURIComponent(email)}`, {
        method: "DELETE"
      });
    } catch {}
  },

  load: async (gymName: string) => {
    try {
      const res = await fetch(`/api/gym/${encodeURIComponent(gymName)}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },
  save: async (gymName: string, data: any) => {
    try {
      await fetch(`/api/gym/${encodeURIComponent(gymName)}/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
    } catch {}
  },
};
