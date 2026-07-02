import * as React from "react";
import { MilestoneScreen } from "../../components/organisms/MilestoneScreen";

export interface Day21TeaserProps {
  onRestart: () => void;
}

/* Beat 13 — Day 21 milestone teaser. PRD §3 row 13.
 *
 * Identity moment. The language ladders from behaviour to becoming —
 * the identity pillar's central expression. */
export function Day21Teaser({ onRestart }: Day21TeaserProps) {
  return (
    <MilestoneScreen
      day={21}
      eyebrow="A glimpse — Day 21"
      identityLine="You are no longer someone trying to read. You are a reader."
      closingLine="With respect, sir — the practice has done its quiet work. Three weeks. The book has become a part of the day, not an item on it."
      cheers={[
        { name: "Jaanvi", note: "saw twenty-one days." },
        { name: "Mike",   note: "noted the milestone." },
      ]}
      continueLabel="Restart the walkthrough"
      onContinue={onRestart}
    />
  );
}
