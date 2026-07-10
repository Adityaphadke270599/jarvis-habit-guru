import type { FastifyInstance } from "fastify";
import { ensureJarvisCalendar, createEvent, NotGrantedError } from "./calendar.js";

/* Delivery HTTP surface — just enough to prove the calendar path end-to-end.
 *
 * Real production surface will be event-driven (per orchestration.md's event
 * bus), not HTTP-triggered. These endpoints exist so we can validate the OAuth
 * → token store → Calendar API path without needing the whole orchestrator. */

export async function deliveryRoutes(app: FastifyInstance) {
  /* One-shot: ensure the Jarvis calendar exists and create a test event on it.
   * Useful for the smallest-end-to-end demo. */
  app.post("/delivery/calendar/test-event", async (req, reply) => {
    if (!req.session.userId) return reply.code(401).send({ error: "sign-in required" });

    try {
      const calendarId = await ensureJarvisCalendar(req.session.userId);
      const now = new Date();
      const inAnHour = new Date(now.getTime() + 60 * 60 * 1000);
      const event = await createEvent({
        userId: req.session.userId,
        summary: "Today's promise — 10 minutes with the book",
        description: "Your circle is watching. A quiet ten minutes will do it, sir.",
        start: now,
        end: inAnHour,
        correlationId: "test-event",
      });
      return reply.send({
        calendarId,
        eventId: event.id,
        htmlLink: event.htmlLink,
      });
    } catch (err) {
      if (err instanceof NotGrantedError) {
        return reply.code(403).send({ error: "calendar.events not granted", grantUrl: "/auth/google/grant?scope=calendar" });
      }
      req.log.error({ err }, "test-event failed");
      return reply.code(500).send({ error: "delivery failed" });
    }
  });
}
