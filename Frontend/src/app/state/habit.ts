import { create } from "zustand";
import { api } from "../api/client";
import type { Habit, Streak, TodayPromise } from "../api/types";
import type { DayState } from "../..";
import { useCircle } from "./circle";

interface HabitState {
  habit: Habit | null;
  streak: Streak;
  today: TodayPromise | null;
  history: DayState[];
  loading: boolean;
  error?: string;
  jarvisClose?: string;

  loadFromServer: () => Promise<void>;
  checkIn: () => Promise<void>;
}

export const useHabit = create<HabitState>((set, get) => ({
  habit: null,
  streak: { kept: 0, missed: 0 },
  today: null,
  history: [],
  loading: false,

  loadFromServer: async () => {
    set({ loading: true, error: undefined });
    try {
      const { habit, streak, today, history } = await api.getHabit();
      set({ habit, streak, today, history, loading: false });
    } catch (e) {
      set({ loading: false, error: (e as Error).message });
    }
  },

  checkIn: async () => {
    const today = get().today;
    if (!today || today.state === "kept") return;

    // Optimistic — the tap is the friction ceiling (NFR3, one tap max).
    set({
      today: { ...today, state: "kept" },
      streak: { ...get().streak, kept: get().streak.kept + 1 },
      history: get().history.map((d, i, arr) => i === arr.length - 1 ? "kept" : d),
    });

    try {
      const res = await api.checkIn(today.promiseId);
      set({
        streak: res.streak,
        today: res.today,
        jarvisClose: res.jarvisClose,
      });
      // Broadcast: refresh the circle so the user sees themselves as done.
      await useCircle.getState().loadFromServer();
    } catch (e) {
      // Revert optimistic write.
      set({
        today,
        streak: get().streak,
        error: (e as Error).message,
      });
    }
  },
}));
