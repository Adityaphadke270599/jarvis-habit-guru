import * as React from "react";
import { Button } from "../../components/atoms/Button";

export interface HowItWorksScreenProps {
  onContinue: () => void;
}

interface Card {
  eyebrow: string;
  title: string;
  body: string;
}

const CARDS: Card[] = [
  {
    eyebrow: "Each morning",
    title: "I'll set today's promise.",
    body: "A small, witnessed commitment — placed on your Calendar, cc'd to your circle.",
  },
  {
    eyebrow: "Across the day",
    title: "You keep it, off-app.",
    body: "Ten minutes with the book. The rep is yours; nothing performative.",
  },
  {
    eyebrow: "One tap",
    title: "Mark it done.",
    body: "A tick — and your circle sees you've shown up. The witness mechanic fires.",
  },
  {
    eyebrow: "By evening",
    title: "We close the day together.",
    body: "An identity-led word from me, and quiet acknowledgement from the circle.",
  },
];

/* Beat 7 — "Here's how it works" 4-card preview. PRD §3 row 7. */
export function HowItWorksScreen({ onContinue }: HowItWorksScreenProps) {
  return (
    <section className="ds-viewport flex flex-col gap-6 p-5 pt-8 pb-8 min-h-[100dvh]">
      <div className="flex flex-col gap-1">
        <span className="ds-caps text-caps text-brass">A quiet preview</span>
        <h2 className="text-display-md text-ink font-semibold leading-tight">
          Here's how it works, sir.
        </h2>
      </div>

      <ol className="flex flex-col gap-3">
        {CARDS.map((card, i) => (
          <li
            key={i}
            className="flex gap-4 p-4 rounded-lg bg-paper-deep border border-paper-edge"
          >
            <span className="ds-caps text-caps shrink-0 w-6 text-brass font-semibold pt-1">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-body-sm text-ink-faint">{card.eyebrow}</span>
              <h3 className="ds-jarvis-quote text-body-lg text-ink">{card.title}</h3>
              <p className="text-body-sm text-ink-soft leading-relaxed">{card.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-auto">
        <Button size="lg" fullWidth onClick={onContinue}>
          Begin
        </Button>
      </div>
    </section>
  );
}
