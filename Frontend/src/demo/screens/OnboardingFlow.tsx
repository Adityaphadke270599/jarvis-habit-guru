import * as React from "react";
import { OnboardingChat, type ChatTurn } from "../../components/organisms/OnboardingChat";
import { RegisterSlider } from "../../components/molecules/RegisterSlider";
import { Button } from "../../components/atoms/Button";
import type { DemoState } from "../types";

/* Beats 1–6 of PRD §3 — the Jarvis-led onboarding interview.
 *
 * One container, internal step machine. Mixes typed input (habit) with
 * choice MCQs (frequency, circle confirm, consent) per PRD §8 decision 1.
 * The register slider gets its own dedicated step (not a chat bubble)
 * because it's a visual control that wants room to breathe. */

type Step =
  | "habit"      // F14.2 — typed
  | "reframe"    // F14.3 — choice
  | "register"   // F15
  | "frequency"  // F4
  | "circle"    // F8
  | "consent"   // F9
  ;

const ORDER: Step[] = ["habit", "reframe", "register", "frequency", "circle", "consent"];

export interface OnboardingFlowProps {
  state: DemoState;
  patch: (p: Partial<DemoState>) => void;
  onComplete: () => void;
}

export function OnboardingFlow({ state, patch, onComplete }: OnboardingFlowProps) {
  const [step, setStep] = React.useState<Step>("habit");
  const [habitDraft, setHabitDraft] = React.useState(state.habitTyped);
  const [reframeChoice, setReframeChoice] = React.useState<string | null>(null);
  const [freqChoice, setFreqChoice] = React.useState<string | null>(state.frequency);
  const [circleConfirm, setCircleConfirm] = React.useState<string | null>(null);
  const [consentChoice, setConsentChoice] = React.useState<string | null>(null);

  const idx = ORDER.indexOf(step);
  const advance = () => {
    if (idx + 1 < ORDER.length) setStep(ORDER[idx + 1]);
    else onComplete();
  };

  // ── Build the chat history that's been said so far ──
  const history: ChatTurn[] = [];
  history.push({
    role: "jarvis",
    text: "Good evening, sir. Before we begin — what habit are you trying to build, or break?",
  });

  if (idx >= 1) {
    history.push({ role: "user", text: state.habitTyped });
    history.push({
      role: "jarvis",
      text:
        "Thirty minutes is a fine target. May I suggest we start at ten? Easier to keep than to restart.",
    });
  }
  if (idx >= 2) {
    history.push({ role: "user", text: "Ten is fine." });
    history.push({
      role: "jarvis",
      text:
        "Quite. When you miss a day — would you have me gentle, neutral, or rather more direct? One voice; the register changes.",
    });
  }
  if (idx >= 3) {
    history.push({
      role: "user",
      text:
        state.register === "gentle"
          ? "Gentle, please."
          : state.register === "direct"
          ? "Direct."
          : "Neutral.",
    });
    history.push({ role: "jarvis", text: "Noted. How often shall I check in?" });
  }
  if (idx >= 4) {
    history.push({
      role: "user",
      text:
        state.frequency === "weekdays"
          ? "Weekdays only."
          : state.frequency === "custom"
          ? "Custom — I'll set the days."
          : "Daily.",
    });
    history.push({
      role: "jarvis",
      text:
        "Excellent. Now — who's witnessing this with you? I'll cc them on the daily reminder.",
    });
  }
  if (idx >= 5) {
    history.push({ role: "user", text: "Jaanvi and Mike — looks right." });
    history.push({
      role: "jarvis",
      text:
        "Splendid. One last thing, sir — may I place this on your Calendar, and reach you by email on a missed day?",
    });
  }

  // ── Render the right input mode for the current step ──

  if (step === "habit") {
    return (
      <OnboardingChat
        history={history}
        inputMode="typed"
        inputValue={habitDraft}
        onInputChange={setHabitDraft}
        placeholder="What habit?"
        onSend={() => {
          patch({ habitTyped: habitDraft });
          advance();
        }}
      />
    );
  }

  if (step === "reframe") {
    return (
      <OnboardingChat
        history={history}
        inputMode="choices"
        choices={[
          { value: "accept", label: "Ten is fine." },
          { value: "override", label: "Keep it at thirty." },
        ]}
        selectedChoice={reframeChoice}
        onChoiceSelect={setReframeChoice}
        onChoiceContinue={() => {
          patch({
            habitFinal: reframeChoice === "override" ? state.habitTyped : "Read 10 minutes",
          });
          advance();
        }}
      />
    );
  }

  if (step === "register") {
    return (
      <section className="ds-viewport flex flex-col p-5 min-h-[100dvh]">
        <div className="flex-1 flex flex-col gap-1 pb-4">
          {history.map((turn, i) => {
            const prev = history[i - 1];
            const grouped = prev?.role === turn.role;
            return (
              <div
                key={i}
                className={
                  "flex w-full " +
                  (turn.role === "jarvis" ? "justify-start" : "justify-end") +
                  (grouped ? " mt-1" : " mt-3")
                }
              >
                <div
                  className={
                    "max-w-[85%] px-4 py-3 rounded-lg " +
                    (turn.role === "jarvis"
                      ? "bg-paper-deep text-ink ds-jarvis-quote text-body-lg rounded-bl-sm"
                      : "bg-brass-tint text-ink text-body rounded-br-sm")
                  }
                >
                  {turn.text}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-5 bg-paper-deep rounded-lg p-5">
          <span className="ds-caps text-caps">Register</span>
          <RegisterSlider
            value={state.register}
            onChange={(r) => patch({ register: r })}
          />
          <Button size="md" fullWidth onClick={advance}>
            Continue
          </Button>
        </div>
      </section>
    );
  }

  if (step === "frequency") {
    return (
      <OnboardingChat
        history={history}
        inputMode="choices"
        choices={[
          { value: "daily",    label: "Daily" },
          { value: "weekdays", label: "Weekdays" },
          { value: "custom",   label: "Custom" },
        ]}
        selectedChoice={freqChoice}
        onChoiceSelect={setFreqChoice}
        onChoiceContinue={() => {
          patch({ frequency: (freqChoice as DemoState["frequency"]) ?? "daily" });
          advance();
        }}
      />
    );
  }

  if (step === "circle") {
    return (
      <OnboardingChat
        history={history}
        inputMode="choices"
        choices={[
          { value: "confirm", label: "Yes — Jaanvi and Mike." },
          { value: "later",   label: "I'll choose later." },
        ]}
        selectedChoice={circleConfirm}
        onChoiceSelect={setCircleConfirm}
        onChoiceContinue={advance}
      />
    );
  }

  if (step === "consent") {
    return (
      <OnboardingChat
        history={history}
        inputMode="choices"
        choices={[
          { value: "yes", label: "Yes — please go ahead." },
          { value: "no",  label: "Not yet." },
        ]}
        selectedChoice={consentChoice}
        onChoiceSelect={setConsentChoice}
        onChoiceContinue={() => {
          patch({ consentGiven: consentChoice === "yes" });
          onComplete();
        }}
      />
    );
  }

  return null;
}
