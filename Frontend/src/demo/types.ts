/* Shared demo state.
 *
 * The walkthrough mutates this as you advance — habit text, register stop,
 * frequency choice, kept/missed state. Lets later screens reflect earlier
 * choices, so the demo feels coherent. */

import type { DayKey } from "../components/molecules/DaySelector";
import type { Register } from "../components/molecules/RegisterSlider";

export interface DemoState {
  habitTyped: string;       // what the user typed (e.g., "Read 30 minutes")
  habitFinal: string;       // after Jarvis's reframe (e.g., "Read 10 minutes")
  register: Register;
  frequency: "daily" | "weekdays" | "custom";
  taskDays: DayKey[];
  consentGiven: boolean;
  todayKept: boolean;       // flipped by the Day-14 check-in tap
}

export const initialDemoState: DemoState = {
  habitTyped: "Read 30 minutes a day",
  habitFinal: "Read 10 minutes",
  register: "neutral",
  frequency: "daily",
  taskDays: ["M", "T", "W", "Th", "F", "Sa", "S"],
  consentGiven: false,
  todayKept: false,
};
