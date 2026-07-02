import * as React from "react";
import { Button } from "../../components/atoms/Button";

export interface SplashScreenProps {
  onSignIn: () => void;
}

/* Beat 0 — Splash. PRD §3: "Sign in as Arjun" hardcoded button. */
export function SplashScreen({ onSignIn }: SplashScreenProps) {
  return (
    <section className="ds-viewport flex flex-col items-center justify-between p-8 pt-24 pb-12 min-h-[100dvh]">
      <div className="flex flex-col items-center gap-4">
        <span className="ds-caps text-caps text-brass">Jarvis</span>
        <h1 className="ds-jarvis-quote text-display-xl text-center leading-tight">
          Keep today's promise.
        </h1>
        <p className="ds-jarvis-quote text-body-lg text-ink-soft text-center max-w-xs leading-relaxed">
          A small, witnessed commitment — and a warm voice to meet you on the way.
        </p>
      </div>

      <div className="w-full flex flex-col gap-3">
        <Button size="lg" fullWidth onClick={onSignIn}>
          Sign in as Arjun
        </Button>
        <p className="text-body-sm text-ink-faint text-center">
          Demo build · authentication stubbed
        </p>
      </div>
    </section>
  );
}
