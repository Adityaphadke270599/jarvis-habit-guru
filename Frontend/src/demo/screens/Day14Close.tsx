import * as React from "react";
import { MilestoneScreen } from "../../components/organisms/MilestoneScreen";

export interface Day14CloseProps {
  onAdvance: () => void;
}

/* Beat 11 — Jarvis's end-of-day close. PRD §3 row 11.
 *
 * "Day fourteen, sir. Twelve kept, two missed. The book is winning —
 * quietly, but it is winning." */
export function Day14Close({ onAdvance }: Day14CloseProps) {
  return (
    <MilestoneScreen
      day={14}
      eyebrow="Day 14"
      identityLine="The book is winning, sir — quietly, but it is winning."
      closingLine="Twelve kept, two missed. A fortnight in, the practice has begun to take its own shape."
      cheers={[
        { name: "Jaanvi", note: "noted your tick today." },
        { name: "Mike",   note: "saw the book is winning." },
      ]}
      continueLabel="A word about the two missed days"
      onContinue={onAdvance}
    />
  );
}
