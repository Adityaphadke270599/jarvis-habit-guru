import { google, calendar_v3 } from "googleapis";
import { db } from "../lib/db.js";
import { makeOAuthClient } from "../auth/google.js";
import { loadGoogleCredentials, userHasScope } from "../auth/tokens.js";

/* Delivery — Google Calendar adapter.
 *
 * Every Jarvis-created event lands on a per-user secondary calendar ("Jarvis —
 * Habit Guru") per ADR-0005. Every event also carries an
 * extendedProperties.private.createdBy = "jarvis" tag as defense-in-depth.
 *
 * The mutating helpers (update, delete — later) MUST verify both invariants
 * before touching an event. Ownership check is enforced in code, not by
 * prompt instruction. */

const CALENDAR_SUMMARY = "Jarvis — Habit Guru";
const CALENDAR_DESCRIPTION =
  "Your daily promises live here. Jarvis creates and updates events on this calendar only.";
const CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar.events";

async function calendarClientForUser(userId: string): Promise<calendar_v3.Calendar> {
  if (!(await userHasScope(userId, CALENDAR_SCOPE))) {
    throw new NotGrantedError("calendar.events not granted");
  }
  const credentials = await loadGoogleCredentials(userId);
  if (!credentials) throw new NotGrantedError("no google credentials on file");

  const auth = makeOAuthClient();
  auth.setCredentials(credentials);
  return google.calendar({ version: "v3", auth });
}

/* Get-or-create the user's Jarvis calendar. Idempotent — safe to call any time. */
export async function ensureJarvisCalendar(userId: string): Promise<string> {
  const existing = await db.jarvisCalendar.findUnique({ where: { userId } });
  if (existing) return existing.calendarId;

  const calendar = await calendarClientForUser(userId);
  const { data } = await calendar.calendars.insert({
    requestBody: {
      summary:     CALENDAR_SUMMARY,
      description: CALENDAR_DESCRIPTION,
      timeZone:    "UTC",   // events set their own timezone; this is fallback only
    },
  });
  if (!data.id) throw new Error("calendar create returned no id");

  await db.jarvisCalendar.create({ data: { userId, calendarId: data.id } });
  return data.id;
}

interface CreateEventArgs {
  userId: string;
  summary: string;
  description?: string;
  start: Date;
  end: Date;
  /* Correlates this event with the domain object that caused it (e.g. Promise.id).
   * Persisted in extendedProperties.private so we can find it later without
   * scanning descriptions. */
  correlationId?: string;
}

/* Create an event on the Jarvis calendar with the provenance tag. */
export async function createEvent(args: CreateEventArgs): Promise<calendar_v3.Schema$Event> {
  const calendar = await calendarClientForUser(args.userId);
  const calendarId = await ensureJarvisCalendar(args.userId);

  const { data } = await calendar.events.insert({
    calendarId,
    requestBody: {
      summary:     args.summary,
      description: args.description,
      start:       { dateTime: args.start.toISOString() },
      end:         { dateTime: args.end.toISOString() },
      extendedProperties: {
        private: {
          createdBy: "jarvis",
          ...(args.correlationId ? { correlationId: args.correlationId } : {}),
        },
      },
    },
  });
  return data;
}

/* Verify an event was created by Jarvis (correct calendar + correct tag).
 * Every mutating operation must call this before proceeding — per ADR-0005. */
export async function assertOwnedByJarvis(userId: string, eventId: string): Promise<calendar_v3.Schema$Event> {
  const calendar = await calendarClientForUser(userId);
  const calendarId = await ensureJarvisCalendar(userId);

  let event: calendar_v3.Schema$Event;
  try {
    const { data } = await calendar.events.get({ calendarId, eventId });
    event = data;
  } catch {
    throw new NotOwnedError("event not found on the Jarvis calendar");
  }
  if (event.extendedProperties?.private?.createdBy !== "jarvis") {
    throw new NotOwnedError("event exists but wasn't created by jarvis");
  }
  return event;
}

export class NotGrantedError extends Error {
  constructor(msg: string) { super(msg); this.name = "NotGrantedError"; }
}

export class NotOwnedError extends Error {
  constructor(msg: string) { super(msg); this.name = "NotOwnedError"; }
}
