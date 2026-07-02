import * as React from "react";
import { GroupView } from "../../components/organisms/GroupView";
import type { DemoState } from "../types";

export interface Day14GroupViewProps {
  state: DemoState;
}

/* Beat 9 — Group view, after the user's tap broadcast.
 *
 * Jaanvi already done; Mike pending; Arjun (you) — done if state.todayKept,
 * else still pending. The status changes coherently with what the user just did. */
export function Day14GroupView({ state }: Day14GroupViewProps) {
  return (
    <GroupView
      jarvisCopy={
        state.todayKept
          ? "The circle, sir — Jaanvi has shown today, and now so have you. Mike has yet to."
          : "The circle is gathered. Jaanvi has shown today; Mike and you are yet to."
      }
      members={[
        {
          name: "Jaanvi",
          status: "done",
          kept: 9,
          missed: 1,
          lastUpdate: "Just now",
        },
        {
          name: "Mike",
          status: "pending",
          kept: 11,
          missed: 3,
        },
        {
          name: "Arjun",
          status: state.todayKept ? "done" : "pending",
          kept: state.todayKept ? 13 : 12,
          missed: 2,
          isSelf: true,
          lastUpdate: state.todayKept ? "A moment ago" : undefined,
        },
      ]}
    />
  );
}
