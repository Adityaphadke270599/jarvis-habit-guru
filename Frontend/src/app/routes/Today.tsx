import { useEffect } from "react";
import { CheckInScreen } from "../../components/organisms/CheckInScreen";
import { useHabit } from "../state/habit";
import { useCircle } from "../state/circle";
import { navigate } from "../lib/router";

/* /today — the daily promise + one-tap check-in.
 * Loads habit + circle on mount; taps route forward to /circle after
 * a soft 900ms so the "kept" broadcast state has a moment to land. */
export function Today() {
  const habit = useHabit();
  const circle = useCircle();

  useEffect(() => {
    if (!habit.habit) habit.loadFromServer();
    if (circle.partners.length === 0) circle.loadFromServer();
  }, []);

  if (!habit.habit || !habit.today) {
    return (
      <section className="ds-viewport flex items-center justify-center min-h-[100dvh] p-8">
        <p className="ds-jarvis-quote text-body-lg text-ink-soft">One moment, sir.</p>
      </section>
    );
  }

  const partners = circle.partners.filter((p) => !p.isSelf).map((p) => p.name);
  const state: "open" | "kept" = habit.today.state === "kept" ? "kept" : "open";

  const onCheckIn = async () => {
    await habit.checkIn();
    setTimeout(() => navigate("/circle"), 900);
  };

  return (
    <CheckInScreen
      greeting={
        state === "kept"
          ? "Kept today, sir. A quiet victory."
          : `Good morning, sir. Day ${habit.streak.kept + habit.streak.missed} — and a quiet, unflashy one to begin.`
      }
      habit={habit.habit.title}
      jarvisNote={
        state === "open"
          ? "The book waits on the shelf. Ten minutes will do."
          : undefined
      }
      partners={partners}
      state={state}
      onCheckIn={onCheckIn}
    />
  );
}
