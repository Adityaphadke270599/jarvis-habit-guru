import { create } from "zustand";
import { api } from "../api/client";
import type { User } from "../api/types";

type Status = "idle" | "authenticating" | "authenticated" | "expired";

interface SessionState {
  user: User | null;
  status: Status;
  error?: string;
  signInAsArjun: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useSession = create<SessionState>((set) => ({
  user: null,
  status: "idle",

  signInAsArjun: async () => {
    set({ status: "authenticating", error: undefined });
    try {
      const { user } = await api.signInAsArjun();
      set({ user, status: "authenticated" });
    } catch (e) {
      set({ status: "idle", error: (e as Error).message });
    }
  },

  signOut: async () => {
    await api.signOut();
    set({ user: null, status: "idle" });
  },
}));
