/* Hash-based routing hook.
 *
 * Chosen per App Structure LLD §Public routes — hash routing survives
 * iOS Safari PWA install and doesn't need server-side rewrites. */

import { useEffect, useSyncExternalStore } from "react";

export type Route =
  | "/"
  | "/onboarding"
  | "/today"
  | "/circle"
  | "/habit"
  | "/close"
  | "/chat"
  | "/settings";

const listeners = new Set<() => void>();

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function getRoute(): Route {
  const raw = window.location.hash.slice(1) || "/";
  return raw as Route;
}

function notify() {
  for (const l of listeners) l();
}

if (typeof window !== "undefined") {
  window.addEventListener("hashchange", notify);
}

export function useRoute(): Route {
  return useSyncExternalStore(subscribe, getRoute, () => "/");
}

export function navigate(to: Route): void {
  if (window.location.hash === "#" + to) return;
  window.location.hash = to;
}

/* Redirect side-effect. Use inside a component when a state condition
 * requires a route change (e.g. authenticated → /today). */
export function useRedirect(condition: boolean, to: Route): void {
  useEffect(() => {
    if (condition) navigate(to);
  }, [condition, to]);
}
