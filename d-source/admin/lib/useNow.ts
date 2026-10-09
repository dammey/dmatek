import { useSyncExternalStore } from "react";

let now = Date.now();
const subs = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;

function subscribe(cb: () => void) {
  subs.add(cb);
  if (!timer)
    timer = setInterval(() => {
      now = Date.now();
      subs.forEach((s) => s());
    }, 30_000);
  return () => {
    subs.delete(cb);
    if (!subs.size && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

/** The current time, refreshed every 30 seconds, so due/overdue labels stay live. */
export function useNow() {
  return useSyncExternalStore(subscribe, () => now, () => now);
}
