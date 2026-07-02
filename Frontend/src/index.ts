/* Jarvis Habit Guru — Design System
 * Public surface for the Claude Design agent.
 *
 * Voice & pillar rules are baked into the component shapes — see CLAUDE.md
 * for the full spec, and ./README.md for the runtime conventions header. */

/* Atoms */
export { Button } from "./components/atoms/Button";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./components/atoms/Button";

export { Tick } from "./components/atoms/Tick";
export type { TickProps } from "./components/atoms/Tick";

export { Avatar } from "./components/atoms/Avatar";
export type { AvatarProps, AvatarSize } from "./components/atoms/Avatar";

export { StatusDot } from "./components/atoms/StatusDot";
export type { StatusDotProps, Status } from "./components/atoms/StatusDot";

export { StreakChip } from "./components/atoms/StreakChip";
export type { StreakChipProps } from "./components/atoms/StreakChip";

/* Molecules */
export { JarvisMessage } from "./components/molecules/JarvisMessage";
export type { JarvisMessageProps, JarvisTone } from "./components/molecules/JarvisMessage";

export { NudgeCard } from "./components/molecules/NudgeCard";
export type { NudgeCardProps } from "./components/molecules/NudgeCard";

export { HabitDayDot } from "./components/molecules/HabitDayDot";
export type { HabitDayDotProps, DayState } from "./components/molecules/HabitDayDot";

export { ChatBubble } from "./components/molecules/ChatBubble";
export type { ChatBubbleProps, ChatRole } from "./components/molecules/ChatBubble";

export { ChoiceChipRow } from "./components/molecules/ChoiceChipRow";
export type { ChoiceChipRowProps, ChoiceOption } from "./components/molecules/ChoiceChipRow";

export { DotCalendar } from "./components/molecules/DotCalendar";
export type { DotCalendarProps } from "./components/molecules/DotCalendar";

export { RegisterSlider } from "./components/molecules/RegisterSlider";
export type { RegisterSliderProps, Register } from "./components/molecules/RegisterSlider";

export { DaySelector } from "./components/molecules/DaySelector";
export type { DaySelectorProps, DayKey } from "./components/molecules/DaySelector";

export { CircleMemberRow } from "./components/molecules/CircleMemberRow";
export type { CircleMemberRowProps } from "./components/molecules/CircleMemberRow";

export { WitnessLine } from "./components/molecules/WitnessLine";
export type { WitnessLineProps } from "./components/molecules/WitnessLine";

export { CircleCheers } from "./components/molecules/CircleCheers";
export type { CircleCheersProps, CheerNote } from "./components/molecules/CircleCheers";

/* Organisms */
export { CheckInScreen } from "./components/organisms/CheckInScreen";
export type { CheckInScreenProps } from "./components/organisms/CheckInScreen";

export { GroupView } from "./components/organisms/GroupView";
export type { GroupViewProps, CircleMember } from "./components/organisms/GroupView";

export { OnboardingChat } from "./components/organisms/OnboardingChat";
export type { OnboardingChatProps, ChatTurn } from "./components/organisms/OnboardingChat";

export { MilestoneScreen } from "./components/organisms/MilestoneScreen";
export type { MilestoneScreenProps } from "./components/organisms/MilestoneScreen";

export { HabitDashboard } from "./components/organisms/HabitDashboard";
export type { HabitDashboardProps } from "./components/organisms/HabitDashboard";

/* Helpers (exposed so designs can reuse the deterministic tint logic) */
export { initials, tintFor } from "./lib/names";
