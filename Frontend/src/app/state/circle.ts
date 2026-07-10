import { create } from "zustand";
import { api } from "../api/client";
import type { CirclePartner } from "../api/types";

interface CircleState {
  partners: CirclePartner[];
  loading: boolean;
  error?: string;

  loadFromServer: () => Promise<void>;
}

export const useCircle = create<CircleState>((set) => ({
  partners: [],
  loading: false,

  loadFromServer: async () => {
    set({ loading: true, error: undefined });
    try {
      const { partners } = await api.getCircle();
      set({ partners, loading: false });
    } catch (e) {
      set({ loading: false, error: (e as Error).message });
    }
  },
}));
