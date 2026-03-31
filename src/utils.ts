export const uid = () => Math.random().toString(36).slice(2, 9);
export const toDay = () => new Date().toISOString().slice(0, 10);
export const fmtD = (d: string) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
export const fmtT = (d: string) => new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
export const dLeft = (e: string) => Math.ceil((new Date(e).getTime() - new Date().getTime()) / 864e5);
export const isGmail = (e: string) => /^[^\s@]+@gmail\.com$/i.test((e || "").trim());
export const avt = (n: string) => (n || "?").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
export const inr = (n: number) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
