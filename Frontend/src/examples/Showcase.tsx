/* Live preview of every component, mounted in realistic Day-14 demo state.
 *
 * Used for visual sanity-checking AND as the source-of-truth usage examples
 * that /design-sync's prompt-md generation reads from.
 *
 * Every literal here is in Jarvis's voice — these examples are reference
 * material for both engineers and the design agent. Do not paraphrase. */

import * as React from "react";
import {
  Avatar,
  Button,
  CheckInScreen,
  ChoiceChipRow,
  ChatBubble,
  CircleCheers,
  CircleMemberRow,
  DaySelector,
  DotCalendar,
  GroupView,
  HabitDashboard,
  HabitDayDot,
  JarvisMessage,
  MilestoneScreen,
  NudgeCard,
  OnboardingChat,
  RegisterSlider,
  StatusDot,
  StreakChip,
  Tick,
  type DayState,
  type DayKey,
  type Register,
} from "..";

const DAY14_HISTORY: DayState[] = [
  "kept", "kept", "missed", "kept", "kept", "kept", "kept",
  "kept", "kept", "missed", "kept", "kept", "kept", "today",
];

const SUNDAY_OFF: DayKey[] = ["M", "T", "W", "Th", "F", "Sa"];

export function Showcase() {
  const [register, setRegister] = React.useState<Register>("neutral");
  const [days, setDays] = React.useState<DayKey[]>(SUNDAY_OFF);
  const [habit, setHabit] = React.useState("Read 30 minutes");

  return (
    <main className="bg-paper min-h-screen pb-24">
      <h1 className="text-display-lg ds-jarvis-quote text-center py-10">
        Jarvis · Design System
      </h1>

      {/* ─── Atoms ────────────────────────────────────────────── */}
      <Section title="Atoms">
        <Row label="Button">
          <Button>Mark today's rep done</Button>
          <Button variant="ghost">Carry on</Button>
          <Button variant="text">Skip</Button>
          <Button leadingIcon={<Tick />}>One tap ✓</Button>
        </Row>

        <Row label="Avatar">
          <Avatar name="Arjun Iyer" />
          <Avatar name="Jaanvi" status="done" />
          <Avatar name="Mike" status="pending" />
          <Avatar name="A" status="missed" size="lg" />
        </Row>

        <Row label="StatusDot">
          <span className="flex items-center gap-2">
            <StatusDot status="done" /> done
          </span>
          <span className="flex items-center gap-2">
            <StatusDot status="pending" /> pending
          </span>
          <span className="flex items-center gap-2">
            <StatusDot status="missed" /> missed
          </span>
        </Row>

        <Row label="StreakChip — NFR5 contract (two numbers, always)">
          <StreakChip kept={12} missed={2} />
          <StreakChip kept={12} missed={2} verbose />
          <StreakChip kept={1} missed={0} size="sm" />
        </Row>
      </Section>

      {/* ─── Molecules ────────────────────────────────────────── */}
      <Section title="Molecules">
        <Row label="JarvisMessage">
          <div className="max-w-md">
            <JarvisMessage eyebrow="Good morning">
              Today's promise — ten minutes with the book. The circle awaits your tick.
            </JarvisMessage>
          </div>
        </Row>

        <Row label="HabitDayDot · the resilience vocabulary">
          <HabitDayDot state="kept" label="M" />
          <HabitDayDot state="kept" label="T" />
          <HabitDayDot state="missed" label="W" />
          <HabitDayDot state="kept" label="T" />
          <HabitDayDot state="kept" label="F" />
          <HabitDayDot state="today" label="S" />
          <HabitDayDot state="future" label="S" />
        </Row>

        <Row label="DotCalendar — last 14 days (12 kept, 2 missed)">
          <div className="w-72">
            <DotCalendar days={DAY14_HISTORY} />
          </div>
        </Row>

        <Row label="DaySelector — Task Days">
          <div className="w-80">
            <DaySelector value={days} onChange={setDays} />
          </div>
        </Row>

        <Row label="RegisterSlider — Gentle ↔ Neutral ↔ Direct">
          <div className="w-72">
            <RegisterSlider value={register} onChange={setRegister} />
          </div>
        </Row>

        <Row label="ChoiceChipRow">
          <div className="w-72 flex flex-col gap-3">
            <ChoiceChipRow
              options={[
                { value: "daily",    label: "Daily" },
                { value: "weekdays", label: "Weekdays" },
                { value: "custom",   label: "Custom" },
              ]}
              value="daily"
              onSelect={() => {}}
            />
          </div>
        </Row>

        <Row label="ChatBubble — onboarding chat">
          <div className="w-80 flex flex-col gap-1">
            <ChatBubble role="jarvis">
              Good evening, sir. Before we begin — what habit are you trying to build, or break?
            </ChatBubble>
            <ChatBubble role="user">Read 30 minutes a day.</ChatBubble>
            <ChatBubble role="jarvis">
              Thirty minutes is a fine target. May I suggest we start at ten? Easier to keep than to restart.
            </ChatBubble>
          </div>
        </Row>

        <Row label="CircleMemberRow">
          <div className="w-80 flex flex-col gap-2">
            <CircleMemberRow name="Jaanvi" status="done" kept={9} missed={1} lastUpdate="Just now" />
            <CircleMemberRow name="Mike"   status="pending" kept={11} missed={3} />
            <CircleMemberRow name="Arjun"  status="pending" kept={12} missed={2} isSelf />
          </div>
        </Row>

        <Row label="NudgeCard · open state · Witness fires here">
          <div className="w-80">
            <NudgeCard
              habit="Read 10 minutes"
              jarvisNote="A quiet ten minutes will do it, sir. The book is waiting on the shelf."
              partners={["Jaanvi", "Mike"]}
              state="open"
            />
          </div>
        </Row>

        <Row label="NudgeCard · kept state">
          <div className="w-80">
            <NudgeCard
              habit="Read 10 minutes"
              partners={["Jaanvi", "Mike"]}
              state="kept"
            />
          </div>
        </Row>

        <Row label="CircleCheers · close-of-day">
          <div className="w-80">
            <CircleCheers
              notes={[
                { name: "Jaanvi", note: "noted your tick today." },
                { name: "Mike",   note: "saw the book is winning." },
              ]}
            />
          </div>
        </Row>
      </Section>

      {/* ─── Organisms ────────────────────────────────────────── */}
      <Section title="Organisms — mobile screens">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
          <PhoneFrame label="CheckInScreen · Day 14 morning">
            <CheckInScreen
              greeting="Good morning, sir. Day fourteen — and a quiet, unflashy one to begin."
              habit="Read 10 minutes"
              jarvisNote="The book waits on the shelf. Ten minutes will do."
              partners={["Jaanvi", "Mike"]}
              state="open"
            />
          </PhoneFrame>

          <PhoneFrame label="GroupView · circle today">
            <GroupView
              jarvisCopy="The circle is gathered. Jaanvi has shown; Mike is yet to."
              members={[
                { name: "Jaanvi", status: "done",    kept: 9,  missed: 1, lastUpdate: "Just now" },
                { name: "Mike",   status: "pending", kept: 11, missed: 3 },
                { name: "Arjun",  status: "pending", kept: 12, missed: 2, isSelf: true },
              ]}
            />
          </PhoneFrame>

          <PhoneFrame label="HabitDashboard · 12 kept, 2 missed">
            <HabitDashboard
              habit="Read 10 minutes"
              history={DAY14_HISTORY}
              taskDays={SUNDAY_OFF}
              jarvisNote="Twelve kept, two missed. The book is winning — quietly, but it is winning."
            />
          </PhoneFrame>

          <PhoneFrame label="OnboardingChat · typed habit input">
            <OnboardingChat
              history={[
                { role: "jarvis", text: "Good evening, sir. Before we begin — what habit are you trying to build, or break?" },
              ]}
              inputMode="typed"
              inputValue={habit}
              onInputChange={setHabit}
              onSend={() => {}}
            />
          </PhoneFrame>

          <PhoneFrame label="OnboardingChat · choice mode">
            <OnboardingChat
              history={[
                { role: "jarvis", text: "Good evening, sir. Before we begin — what habit are you trying to build, or break?" },
                { role: "user",   text: "Read 30 minutes a day." },
                { role: "jarvis", text: "Thirty minutes is a fine target. May I suggest we start at ten? Easier to keep than to restart." },
                { role: "user",   text: "Ten is fine." },
                { role: "jarvis", text: "Quite. How often shall I check in?" },
              ]}
              inputMode="choices"
              choices={[
                { value: "daily",    label: "Daily" },
                { value: "weekdays", label: "Weekdays" },
                { value: "custom",   label: "Custom" },
              ]}
              selectedChoice="daily"
              onChoiceSelect={() => {}}
              onChoiceContinue={() => {}}
            />
          </PhoneFrame>

          <PhoneFrame label="MilestoneScreen · Day 21 identity">
            <MilestoneScreen
              day={21}
              identityLine="You are no longer someone trying to read. You are a reader."
              closingLine="With respect, sir — the practice has done its quiet work."
              cheers={[
                { name: "Jaanvi", note: "saw twenty-one days." },
                { name: "Mike",   note: "noted the milestone." },
              ]}
              continueLabel="Carry on"
              onContinue={() => {}}
            />
          </PhoneFrame>
        </div>
      </Section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="max-w-5xl mx-auto px-6 py-10 border-t border-paper-edge first:border-t-0">
      <h2 className="ds-caps text-caps-lg text-brass mb-6">{title}</h2>
      <div className="flex flex-col gap-8">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-body-sm text-ink-soft font-medium">{label}</span>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </div>
  );
}

function PhoneFrame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-body-sm text-ink-soft font-medium">{label}</span>
      <div className="border border-paper-edge rounded-lg shadow-card overflow-hidden bg-paper" style={{ width: 390 }}>
        {children}
      </div>
    </div>
  );
}
