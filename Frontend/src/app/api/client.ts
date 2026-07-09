/* HTTP client seam.
 *
 * Today: routes every call to the in-memory mock. When a real backend
 * arrives, replace the body of each method with a `fetch(...)` — no
 * store or component code changes. */

import { mock } from "./mock";
import type {
  SessionResponse, HabitResponse, CircleResponse, CheckInResponse,
} from "./types";

export const api = {
  /* Auth ─────────────────────────────────────────────── */
  signInAsArjun: (): Promise<SessionResponse> => mock.postSessionDemo(),
  signOut: (): Promise<void> => mock.deleteSession(),

  /* Habit ────────────────────────────────────────────── */
  getHabit: (): Promise<HabitResponse> => mock.getHabit(),
  checkIn: (promiseId: string): Promise<CheckInResponse> => mock.postCheckIn(promiseId),

  /* Circle ───────────────────────────────────────────── */
  getCircle: (): Promise<CircleResponse> => mock.getCircle(),
};
