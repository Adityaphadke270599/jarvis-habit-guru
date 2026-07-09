/* HTTP contract shared by the client (state stores) and the mock backend.
 * When a real backend arrives, it implements this same shape and the
 * client swaps its transport without touching the stores. */

import type { DayState, DayKey, Register, Status } from "../..";

export interface User {
  id: string;
  name: string;
  honorific: string;
  register: Register;
}

export interface Habit {
  id: string;
  title: string;
  tinyUnit: string;
  startedAt: string;   // ISO
  taskDays: DayKey[];
}

export interface Streak {
  kept: number;
  missed: number;
}

export interface TodayPromise {
  promiseId: string;
  state: DayState;      // "kept" | "missed" | "today" | "future" | "skipped"
  dueAt: string;        // ISO
}

export interface CirclePartner {
  id: string;
  name: string;
  status: Status;
  kept: number;
  missed: number;
  lastUpdate?: string;
  isSelf?: boolean;
}

/* ─── Responses ─────────────────────────────────────────── */

export interface SessionResponse {
  user: User;
}

export interface HabitResponse {
  habit: Habit;
  streak: Streak;
  today: TodayPromise;
  history: DayState[];
}

export interface CircleResponse {
  partners: CirclePartner[];
}

export interface CheckInResponse {
  streak: Streak;
  today: TodayPromise;
  jarvisClose?: string;
}
