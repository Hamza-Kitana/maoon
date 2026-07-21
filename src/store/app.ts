import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  avatar?: string;
  createdAt: number;
};

export type AidRequest = {
  id: string;
  userId: string;
  userName: string;
  categorySlug: string;
  title: string;
  description: string;
  amountNeeded: number;
  amountRaised: number;
  anonymous: boolean;
  status: "pending" | "approved" | "rejected";
  adminNote?: string;
  createdAt: number;
};

export type Donation = {
  id: string;
  donorId?: string;
  donorName: string;
  amount: number;
  categorySlug?: string; // general to category
  requestId?: string; // specific
  createdAt: number;
};

export type Notification = {
  id: string;
  message: string;
  read: boolean;
  createdAt: number;
  kind: "request" | "donation" | "system";
};

type AppState = {
  users: User[];
  requests: AidRequest[];
  donations: Donation[];
  notifications: Notification[];
  sessionId: string | null;

  // auth
  signup: (u: Omit<User, "id" | "role" | "createdAt">) => { ok: boolean; msg?: string };
  login: (email: string, password: string) => { ok: boolean; msg?: string };
  logout: () => void;
  currentUser: () => User | null;

  // requests
  createRequest: (r: Omit<AidRequest, "id" | "status" | "createdAt" | "amountRaised" | "userId" | "userName">) => void;
  updateRequest: (id: string, patch: Partial<AidRequest>) => void;
  deleteRequest: (id: string) => void;
  approveRequest: (id: string, note?: string) => void;
  rejectRequest: (id: string, note: string) => void;

  // donations
  donate: (d: Omit<Donation, "id" | "createdAt" | "donorId" | "donorName"> & { donorName?: string }) => void;

  // notifications
  markNotifRead: (id: string) => void;
  markAllRead: () => void;

  // admin utils
  deleteUser: (id: string) => void;
  updateUser: (id: string, patch: Partial<Pick<User, "name" | "email" | "password">>) => { ok: boolean; msg?: string };
};

const uid = () => Math.random().toString(36).slice(2, 10);

const seedAdmin: User = {
  id: "admin-root",
  name: "المشرف العام",
  email: "admin@donate.gov",
  password: "admin123",
  role: "admin",
  createdAt: Date.now(),
};

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      users: [seedAdmin],
      requests: [],
      donations: [],
      notifications: [],
      sessionId: null,

      currentUser: () => {
        const id = get().sessionId;
        return id ? get().users.find((u) => u.id === id) ?? null : null;
      },

      signup: (u) => {
        if (get().users.some((x) => x.email === u.email)) return { ok: false, msg: "البريد مستخدم مسبقاً" };
        const nu: User = { ...u, id: uid(), role: "user", createdAt: Date.now() };
        set({ users: [...get().users, nu], sessionId: nu.id });
        return { ok: true };
      },
      login: (email, password) => {
        const u = get().users.find((x) => x.email === email && x.password === password);
        if (!u) return { ok: false, msg: "بيانات الدخول غير صحيحة" };
        set({ sessionId: u.id });
        return { ok: true };
      },
      logout: () => set({ sessionId: null }),

      createRequest: (r) => {
        const u = get().currentUser();
        if (!u) return;
        const nr: AidRequest = {
          ...r,
          id: uid(),
          userId: u.id,
          userName: u.name,
          amountRaised: 0,
          status: "pending",
          createdAt: Date.now(),
        };
        set({
          requests: [nr, ...get().requests],
          notifications: [
            {
              id: uid(),
              message: `طلب مساعدة جديد من ${u.name}`,
              kind: "request",
              read: false,
              createdAt: Date.now(),
            },
            ...get().notifications,
          ],
        });
      },
      updateRequest: (id, patch) =>
        set({ requests: get().requests.map((r) => (r.id === id ? { ...r, ...patch } : r)) }),
      deleteRequest: (id) => set({ requests: get().requests.filter((r) => r.id !== id) }),
      approveRequest: (id, note) =>
        set({
          requests: get().requests.map((r) =>
            r.id === id ? { ...r, status: "approved", adminNote: note } : r,
          ),
        }),
      rejectRequest: (id, note) =>
        set({
          requests: get().requests.map((r) =>
            r.id === id ? { ...r, status: "rejected", adminNote: note } : r,
          ),
        }),

      donate: (d) => {
        const u = get().currentUser();
        const donorName = d.donorName ?? u?.name ?? "متبرع كريم";
        const nd: Donation = {
          ...d,
          id: uid(),
          donorId: u?.id,
          donorName,
          createdAt: Date.now(),
        };
        // update raised amount if request specific
        let requests = get().requests;
        if (d.requestId) {
          requests = requests.map((r) =>
            r.id === d.requestId ? { ...r, amountRaised: r.amountRaised + d.amount } : r,
          );
        }
        set({
          donations: [nd, ...get().donations],
          requests,
          notifications: [
            {
              id: uid(),
              message: `تبرع جديد بقيمة ${d.amount.toLocaleString("ar")} د.أ`,
              kind: "donation",
              read: false,
              createdAt: Date.now(),
            },
            ...get().notifications,
          ],
        });
      },

      markNotifRead: (id) =>
        set({ notifications: get().notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) }),
      markAllRead: () => set({ notifications: get().notifications.map((n) => ({ ...n, read: true })) }),
      deleteUser: (id) => set({ users: get().users.filter((u) => u.id !== id) }),
      updateUser: (id, patch) => {
        if (patch.email && get().users.some((u) => u.email === patch.email && u.id !== id)) {
          return { ok: false, msg: "البريد مستخدم مسبقاً" };
        }
        set({ users: get().users.map((u) => (u.id === id ? { ...u, ...patch } : u)) });
        return { ok: true };
      },
    }),
    { name: "aid-portal-store" },
  ),
);
