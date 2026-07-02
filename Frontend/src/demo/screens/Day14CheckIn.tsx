import * as React from "react";
import { CheckInScreen } from "../../components/organisms/CheckInScreen";
import type { DemoState } from "../types";

export interface Day14CheckInProps {
  state: DemoState;
  patch: (p: Partial<DemoState>) => void;
  onAdvance: () => void;
}

/* Beat 8 (cut to Day 14) + Beat 10 (one-tap check-in).
 *
 * The tap toggles state.todayKept → "kept" visual → 900ms pause → advance.
 * This is the moment the demo "feels real" — the broadcast cue lands here. */
export function Day14CheckIn({ state, patch, onAdvance }: Day14CheckInProps) {
  return (
    <CheckInScreen
      greeting="Good morning, sir. Day fourteen — and a quiet, unflashy one to begin."
      habit={state.habitFinal}
      jarvisNote="The book waits on the shelf. Ten minutes will do."
      partners={["Jaanvi", "Mike"]}
      state={state.todayKept ? "kept" : "open"}
      onCheckIn={() => {
        patch({ todayKept: true });
        setTimeout(onAdvance, 900);
      }}
    />
  );
}
