import * as React from "react";
import { cn } from "../../lib/cn";

export type ChatRole = "jarvis" | "user";

export interface ChatBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  role: ChatRole;
  children: React.ReactNode;
  /** If true, no top margin — used when several bubbles from the same role group. */
  grouped?: boolean;
}

/* OnboardingChat bubble.
 *
 * Two voices only — Jarvis (serif, paper-deep, left-aligned) and User
 * (sans, brass-tint, right-aligned). The serif/sans split is the
 * fingerprint of who's speaking; the agent must not invert it. */
export const ChatBubble = React.forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ role, children, grouped, className, ...rest }, ref) => {
    const isJarvis = role === "jarvis";
    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full",
          isJarvis ? "justify-start" : "justify-end",
          grouped ? "mt-1" : "mt-3",
          className
        )}
        {...rest}
      >
        <div
          className={cn(
            "max-w-[85%] px-4 py-3 rounded-lg",
            isJarvis
              ? "bg-paper-deep text-ink ds-jarvis-quote text-body-lg rounded-bl-sm"
              : "bg-brass-tint text-ink text-body rounded-br-sm"
          )}
        >
          {children}
        </div>
      </div>
    );
  }
);

ChatBubble.displayName = "ChatBubble";
