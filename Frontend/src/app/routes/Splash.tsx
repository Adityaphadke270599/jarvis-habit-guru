import { Button } from "../../components/atoms/Button";
import { useSession } from "../state/session";
import { navigate } from "../lib/router";

/* Splash route — the entry surface.
 * "Sign in as Arjun" per PRD Option C. Real auth is roadmap.
 * On success: navigate to /today. */
export function Splash() {
  const { status, signInAsArjun, error } = useSession();
  const busy = status === "authenticating";

  const onSignIn = async () => {
    await signInAsArjun();
    if (useSession.getState().status === "authenticated") {
      navigate("/today");
    }
  };

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
        <Button size="lg" fullWidth onClick={onSignIn} disabled={busy}>
          {busy ? "Signing you in…" : "Sign in as Arjun"}
        </Button>
        <p className="text-body-sm text-ink-faint text-center">
          {error ? error : "Demo build · authentication stubbed"}
        </p>
      </div>
    </section>
  );
}
