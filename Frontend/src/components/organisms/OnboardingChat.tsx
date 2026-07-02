import * as React from "react";
import { cn } from "../../lib/cn";
import { ChatBubble, type ChatRole } from "../molecules/ChatBubble";
import { ChoiceChipRow, type ChoiceOption } from "../molecules/ChoiceChipRow";
import { Button } from "../atoms/Button";

export interface ChatTurn {
  role: ChatRole;
  /** Bubble copy. */
  text: string;
}

export interface OnboardingChatProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "inputMode"> {
  /** Past turns, oldest first. The component renders them in order. */
  history: ChatTurn[];

  /** Input mode for the CURRENT question:
   *  - "typed"     → text field + send button (used for habit capture, F14.2)
   *  - "choices"   → button MCQ (frequency, register, circle confirm, consent)
   *  - "none"      → no input (system is computing / transitioning)
   */
  inputMode: "typed" | "choices" | "none";

  /** When inputMode = "typed". */
  inputValue?: string;
  onInputChange?: (v: string) => void;
  onSend?: () => void;
  placeholder?: string;

  /** When inputMode = "choices". */
  choices?: ChoiceOption[];
  selectedChoice?: string | null;
  onChoiceSelect?: (v: string) => void;
  /** If provided, a "Continue" button appears below the choices. */
  onChoiceContinue?: () => void;
}

/* OnboardingChat — beat 0 of the demo arc, F14 in the PRD.
 *
 * Two input modes:
 *   - typed for the habit (the GenAI-craft signal)
 *   - choices for everything else (frequency, register, circle, consent)
 *
 * This same chat container is reused for the day-N retrospective probe
 * (F16.3, F16.4) — Jarvis asks one question, user replies in chat. */
export const OnboardingChat = React.forwardRef<HTMLDivElement, OnboardingChatProps>(
  (
    {
      history,
      inputMode,
      inputValue = "",
      onInputChange,
      onSend,
      placeholder = "Type your habit…",
      choices,
      selectedChoice,
      onChoiceSelect,
      onChoiceContinue,
      className,
      ...rest
    },
    ref
  ) => (
    <section
      ref={ref}
      className={cn("ds-viewport flex flex-col p-5 min-h-[100dvh]", className)}
      {...rest}
    >
      <div className="flex-1 flex flex-col gap-1 overflow-y-auto pb-4">
        {history.map((turn, i) => {
          const prev = history[i - 1];
          const grouped = prev?.role === turn.role;
          return (
            <ChatBubble key={i} role={turn.role} grouped={grouped}>
              {turn.text}
            </ChatBubble>
          );
        })}
      </div>

      {inputMode === "typed" && (
        <div className="mt-4 flex items-end gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => onInputChange?.(e.target.value)}
            placeholder={placeholder}
            rows={2}
            className={cn(
              "flex-1 resize-none px-4 py-3 rounded-lg bg-paper-deep",
              "text-body text-ink placeholder:text-ink-faint",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-brass",
              "border border-paper-edge"
            )}
          />
          <Button
            size="md"
            onClick={onSend}
            disabled={!inputValue.trim()}
          >
            Send
          </Button>
        </div>
      )}

      {inputMode === "choices" && choices && (
        <div className="mt-4 flex flex-col gap-3">
          <ChoiceChipRow
            options={choices}
            value={selectedChoice ?? null}
            onSelect={onChoiceSelect}
            layout="stack"
          />
          {onChoiceContinue && (
            <Button
              size="md"
              fullWidth
              onClick={onChoiceContinue}
              disabled={!selectedChoice}
            >
              Continue
            </Button>
          )}
        </div>
      )}
    </section>
  )
);

OnboardingChat.displayName = "OnboardingChat";
