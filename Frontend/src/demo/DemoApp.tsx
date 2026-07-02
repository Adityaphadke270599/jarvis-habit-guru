import * as React from "react";
import { initialDemoState, type DemoState } from "./types";
import { SplashScreen } from "./screens/SplashScreen";
import { OnboardingFlow } from "./screens/OnboardingFlow";
import { HowItWorksScreen } from "./screens/HowItWorksScreen";
import { Day14CheckIn } from "./screens/Day14CheckIn";
import { Day14GroupView } from "./screens/Day14GroupView";
import { Day14Close } from "./screens/Day14Close";
import { MissReflection } from "./screens/MissReflection";
import { Day21Teaser } from "./screens/Day21Teaser";

/* DemoApp — walks the user through the full PRD §3 arc.
 *
 * Footer shows ← Back · N/M · Next →. Each beat has its own onAdvance.
 * The Day-14 check-in tap actually flips state.todayKept and the group view
 * reflects it, so the demo feels causal, not slideshow-y. */

type BeatId =
  | "splash"
  | "onboarding"
  | "how"
  | "checkin"
  | "group"
  | "close"
  | "miss"
  | "milestone";

const BEATS: { id: BeatId; label: string }[] = [
  { id: "splash",     label: "Splash" },
  { id: "onboarding", label: "Onboarding" },
  { id: "how",        label: "How it works" },
  { id: "checkin",    label: "Day 14 · nudge" },
  { id: "group",      label: "Day 14 · circle" },
  { id: "close",      label: "Day 14 · close" },
  { id: "miss",       label: "Miss reflection" },
  { id: "milestone",  label: "Day 21 · milestone" },
];

export function DemoApp() {
  const [beatIdx, setBeatIdx] = React.useState(0);
  const [state, setState] = React.useState<DemoState>(initialDemoState);
  const patch = (p: Partial<DemoState>) => setState((s) => ({ ...s, ...p }));

  const next = () => setBeatIdx((i) => Math.min(i + 1, BEATS.length - 1));
  const back = () => setBeatIdx((i) => Math.max(i - 1, 0));
  const restart = () => {
    setState(initialDemoState);
    setBeatIdx(0);
  };

  const beat = BEATS[beatIdx];

  let screen: React.ReactNode = null;
  switch (beat.id) {
    case "splash":
      screen = <SplashScreen onSignIn={next} />;
      break;
    case "onboarding":
      screen = <OnboardingFlow state={state} patch={patch} onComplete={next} />;
      break;
    case "how":
      screen = <HowItWorksScreen onContinue={next} />;
      break;
    case "checkin":
      screen = <Day14CheckIn state={state} patch={patch} onAdvance={next} />;
      break;
    case "group":
      screen = <Day14GroupView state={state} />;
      break;
    case "close":
      screen = <Day14Close onAdvance={next} />;
      break;
    case "miss":
      screen = <MissReflection onComplete={next} />;
      break;
    case "milestone":
      screen = <Day21Teaser onRestart={restart} />;
      break;
  }

  return (
    <div className="min-h-[100dvh] bg-paper flex justify-center">
      <div className="w-full max-w-[390px] flex flex-col relative">
        <div className="flex-1 pb-16">{screen}</div>

        <footer className="sticky bottom-0 w-full flex items-center justify-between gap-3 px-4 py-3 border-t border-paper-edge bg-paper/95 backdrop-blur-sm">
          <button
            type="button"
            onClick={back}
            disabled={beatIdx === 0}
            className="text-body-sm text-ink-soft hover:text-ink disabled:text-ink-faint disabled:cursor-not-allowed"
          >
            ← Back
          </button>
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[10px] uppercase tracking-wider text-ink-faint font-medium">
              Beat {beatIdx + 1} / {BEATS.length}
            </span>
            <span className="text-body-sm text-ink-soft">{beat.label}</span>
          </div>
          <button
            type="button"
            onClick={next}
            disabled={beatIdx === BEATS.length - 1}
            className="text-body-sm text-brass hover:text-brass-deep disabled:text-ink-faint disabled:cursor-not-allowed font-medium"
          >
            Next →
          </button>
        </footer>
      </div>
    </div>
  );
}
