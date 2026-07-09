/* In-memory mock backend.
 *
 * Speaks the LLD's HTTP contract. Seeded with the PRD §3 Day-14 state
 * (12 kept, 2 missed, Jaanvi done / Mike pending / Arjun pending).
 *
 * State lives for the session — persistence to IndexedDB is a next step. */

import type {
  User, Habit, Streak, TodayPromise, CirclePartner,
  SessionResponse, HabitResponse, CircleResponse, CheckInResponse,
} from "./types";
import type { DayState } from "../..";

/* ─── Seed ──────────────────────────────────────────────── */

const ARJUN: User = {
  id: "user_arjun",
  name: "Arjun",
  honorific: "sir",
  register: "neutral",
};

const HABIT: Habit = {
  id: "habit_read",
  title: "Read 10 minutes",
  tinyUnit: "10 minutes with the book",
  startedAt: "2026-06-19T07:00:00.000Z",
  taskDays: ["M", "T", "W", "Th", "F", "Sa", "S"],
};

const HISTORY_14: DayState[] = [
  "kept", "kept", "missed", "kept", "kept", "kept", "kept",
  "kept", "kept", "missed", "kept", "kept", "kept", "today",
];

/* ─── Mutable state ─────────────────────────────────────── */

interface BackendState {
  authed: boolean;
  streak: Streak;
  today: TodayPromise;
  history: DayState[];
  partners: CirclePartner[];
}

const state: BackendState = {
  authed: false,
  streak: { kept: 12, missed: 2 },
  today: { promiseId: "promise_day14", state: "today", dueAt: nextRollover() },
  history: [...HISTORY_14],
  partners: [
    { id: "p_jaanvi", name: "Jaanvi", status: "done", kept: 9, missed: 1, lastUpdate: "Just now" },
    { id: "p_mike",   name: "Mike",   status: "pending", kept: 11, missed: 3 },
    { id: "p_arjun",  name: "Arjun",  status: "pending", kept: 12, missed: 2, isSelf: true },
  ],
};

function nextRollover(): string {
  const t = new Date();
  t.setHours(23, 59, 0, 0);
  return t.toISOString();
}

/* ─── Latency shim ──────────────────────────────────────── */

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* ─── Endpoints ─────────────────────────────────────────── */

export const mock = {
  async postSessionDemo(): Promise<SessionResponse> {
    await delay(240);
    state.authed = true;
    return { user: ARJUN };
  },

  async deleteSession(): Promise<void> {
    await delay(80);
    state.authed = false;
  },

  async getHabit(): Promise<HabitResponse> {
    if (!state.authed) throw new AuthError();
    await delay(120);
    return {
      habit: HABIT,
      streak: { ...state.streak },
      today: { ...state.today },
      history: [...state.history],
    };
  },

  async getCircle(): Promise<CircleResponse> {
    if (!state.authed) throw new AuthError();
    await delay(120);
    return { partners: state.partners.map((p) => ({ ...p })) };
  },

  async postCheckIn(promiseId: string): Promise<CheckInResponse> {
    if (!state.authed) throw new AuthError();
    await delay(320);
    if (promiseId !== state.today.promiseId) {
      throw new ClientError("promise not open");
    }
    if (state.today.state === "kept") {
      throw new ClientError("already kept today");
    }

    state.today.state = "kept";
    state.streak.kept += 1;
    state.history[state.history.length - 1] = "kept";

    // Broadcast: Arjun's partner row flips to done.
    const arjun = state.partners.find((p) => p.isSelf);
    if (arjun) {
      arjun.status = "done";
      arjun.kept = state.streak.kept;
      arjun.lastUpdate = "A moment ago";
    }

    return {
      streak: { ...state.streak },
      today: { ...state.today },
      jarvisClose: `Day ${state.streak.kept + state.streak.missed}, sir. Twelve kept, two missed. The book is winning — quietly, but it is winning.`,
    };
  },
};

/* ─── Errors — surfaced by the client to stores ─────────── */

export class AuthError extends Error {
  constructor() { super("unauthenticated"); this.name = "AuthError"; }
}

export class ClientError extends Error {
  constructor(msg: string) { super(msg); this.name = "ClientError"; }
}
