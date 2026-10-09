/** Requests (enquiries): types, tag colours and reply-due labels as in
 * "DSource Admin v3.dc.html". Times are Lagos time (WAT, UTC+1). */

export type Enquiry = { id: string; type: string; from_name: string | null; from_contact: string | null; message: string; done: boolean; created_at: string };

export const REQUEST_TYPES = ["Sourcing request", "Business sourcing", "Return / failed inspection", "Repair collection", "Pilot interest", "WhatsApp order", "General"];

const TC: Record<string, [string, string]> = {
  "Sourcing request": ["#D9F0E3", "#1F7A5A"],
  "Business sourcing": ["#06382E", "#D4A637"],
  "Return / failed inspection": ["#FDE7E4", "#9E1B32"],
  "Repair collection": ["#DCEBFF", "#1B4A8A"],
  "Pilot interest": ["#FFF1CC", "#7A5B00"],
  "WhatsApp order": ["#DCF8C6", "#1F5E2E"],
  General: ["#EFEADC", "#06382E"],
};
export const requestTag = (type: string) => TC[type] ?? TC.General;

const WAT = 60 * 60 * 1000;
const lagosHour = (t: number) => new Date(t + WAT).getUTCHours();
/** The moment the 1-hour clock starts: when it was sent if 8am–8pm, else the next 8am. */
function clockStart(sent: number) {
  const h = lagosHour(sent);
  if (h >= 8 && h < 20) return sent;
  const d = new Date(sent + WAT);
  if (h >= 20) d.setUTCDate(d.getUTCDate() + 1);
  d.setUTCHours(8, 0, 0, 0);
  return d.getTime() - WAT;
}

export function requestDue(e: Enquiry, now: number): [string, string] {
  if (e.done) return ["Replied", "#1F7A5A"];
  const sent = new Date(e.created_at).getTime();
  if (e.type === "Sourcing request") {
    const start = clockStart(sent);
    if (now < start) return ["Sent after 8pm · answer from 8am", "#7A5B00"];
    const left = 60 - Math.floor((now - start) / 60000);
    return left >= 0 ? [`Reply due in ${left} min · 8am–8pm`, left < 15 ? "#9E1B32" : "#1F7A5A"] : [`Overdue by ${-left} min`, "#9E1B32"];
  }
  if (e.type === "Business sourcing") {
    const left = 1440 - Math.floor((now - sent) / 60000);
    return [`Reply due in ${Math.floor(left / 60)}h (24h promise)`, "#1F7A5A"];
  }
  if (e.type === "Return / failed inspection") return ["Within the 7-day return window", "#7A5B00"];
  return ["", "#5E6E68"];
}

export function when(iso: string, now: number) {
  const t = new Date(iso).getTime();
  const m = Math.floor((now - t) / 60000);
  if (m < 60) return `${Math.max(1, m)} min ago`;
  const days = Math.floor((now + WAT) / 86400000) - Math.floor((t + WAT) / 86400000);
  if (days === 0) return `${Math.floor(m / 60)}h ago`;
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}
