import * as React from "react";
import { OnboardingChat, type ChatTurn } from "../../components/organisms/OnboardingChat";

export interface MissReflectionProps {
  onComplete: () => void;
}

/* Beat 12 — retrospective miss probe. PRD §3 row 12, F16.3/F16.4.
 *
 * Reuses the OnboardingChat shell. One reflective question; the user
 * may decline to engage. Reason is private; never surfaces in the circle. */
export function MissReflection({ onComplete }: MissReflectionProps) {
  const [reason, setReason] = React.useState("");
  const [step, setStep] = React.useState<"prompt" | "ack">("prompt");

  const baseHistory: ChatTurn[] = [
    {
      role: "jarvis",
      text:
        "Two quiet days in the last fortnight, sir. No judgement — but if you've a moment, what got in the way, and how are you sitting with them?",
    },
  ];

  if (step === "ack") {
    const history: ChatTurn[] = [
      ...baseHistory,
      { role: "user", text: reason || "I'd rather not say." },
      {
        role: "jarvis",
        text:
          reason.trim().length > 0
            ? "Thank you for telling me, sir. I'll adjust the tone gently for the next stretch. If a pattern forms, I may quietly propose a smaller unit — never as pressure."
            : "Quite alright, sir. We carry on. The two missed days remain in your history — kept, not erased — and the practice continues.",
      },
    ];
    return (
      <OnboardingChat
        history={history}
        inputMode="choices"
        choices={[{ value: "ok", label: "Thank you, Jarvis." }]}
        selectedChoice="ok"
        onChoiceSelect={() => {}}
        onChoiceContinue={onComplete}
      />
    );
  }

  return (
    <OnboardingChat
      history={baseHistory}
      inputMode="typed"
      inputValue={reason}
      onInputChange={setReason}
      placeholder="What got in the way? (Private — never shared.)"
      onSend={() => setStep("ack")}
    />
  );
}
