/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";
// A port of the design's logic class (DMatek Assurance.dc.html). The contact
// form posts to the shared enquiry backend instead of the prototype's
// simulated send.

import React from "react";
import Markup from "./AssuranceMarkup";
import { track } from "@/lib/analytics";
import { isLite } from "@/lib/lite";
import { postEnquiry } from "@/lib/postEnquiry";
import "./assurance.css";

const EVENTS = [
  { m: 20, t: "18:20", ok: true, title: "Updates installed after everyone went home", note: "Done outside working hours, so nobody was interrupted." },
  { m: 75, t: "19:15", ok: true, title: "A scam email was held back", note: "It never reached the staff inboxes." },
  { m: 140, t: "20:20", ok: true, title: "Backup finished and checked", note: "A test restore confirmed the copy works." },
  { m: 215, t: "21:35", ok: true, title: "A sign-in from another country was stopped", note: "The second sign-in check blocked it." },
  { m: 330, t: "23:30", ok: true, title: "A firewall setting was tightened", note: "Recorded in the change log." },
  { m: 410, t: "00:50", ok: true, title: "The file server was filling up", note: "Space cleared before it caused trouble." },
  { m: 500, t: "02:20", ok: false, title: "The branch office power backup reported a weak battery", note: "Needs you: approve a replacement." },
  { m: 600, t: "04:00", ok: true, title: "Printers and laptops updated their software", note: "Rolled out in the quiet hours." },
  { m: 690, t: "05:30", ok: true, title: "A staff account was locked out", note: "Helpdesk reset it first thing." },
  { m: 780, t: "07:00", ok: true, title: "Final morning check: all systems normal", note: "The summary was ready before staff arrived." },
];
// The design's data points at "cover-bN"; the list rows are "asr-bN".
const CH = [{"t":"Someone in the business owns IT decisions","id":"cover-b1","h":"IT direction and spending plans"},{"t":"Backups are tested, not just taken","id":"cover-b8","h":"Keep working through disruption"},{"t":"Staff sign in with a second check (MFA)","id":"cover-b7","h":"Safer logins and access"},{"t":"Computers and phones are updated and monitored","id":"cover-b3","h":"Your outsourced IT team"},{"t":"There is a recovery plan someone has read","id":"cover-b8","h":"Keep working through disruption"},{"t":"Security gaps have been checked in the last year","id":"cover-b6","h":"Find and close security gaps"},{"t":"IT and security rules are written down","id":"cover-b2","h":"IT records, policies and compliance advice"},{"t":"Someone answers when IT breaks","id":"cover-b4","h":"Help when something breaks"}].map((c) => ({ ...c, id: c.id.replace("cover-", "asr-") }));
const MAILS = [{"from":"accounts@dmatek-payments-support.com","subject":"Urgent: your invoice payment failed","body":"Your payment could not be processed. Click the link and re-enter your bank details within 1 hour or your account will be suspended.","scam":true,"why":"Pressure to act in one hour, a sender address that is not a real company domain, and a request for bank details are the classic signs."},{"from":"Chinedu (Operations), usual internal address","subject":"Team meeting moved to 3pm Thursday","body":"Hi all, the weekly team meeting is moving to 3pm on Thursday, same room. No action needed.","scam":false,"why":"A familiar sender, no links, and nothing is asked of you."},{"from":"Managing Director (a free webmail address)","subject":"Quick favour, keep this between us","body":"I am in a meeting and cannot talk. Please buy five gift cards and send me the codes. I will repay you today. Do not tell anyone.","scam":true,"why":"Fraudsters copy the boss’s name and ask for secret, urgent payments. A real manager would not ask this by email."},{"from":"IT Helpdesk <mail-login-verify.co>","subject":"Your mailbox is 98% full","body":"Sign in here now to keep your account: http://mail-login-verify.co/secure","scam":true,"why":"The link goes to an unfamiliar website. Check the real address before you click anything that asks you to sign in."},{"from":"Amaka (Finance), usual internal address","subject":"Calendar invite: budget review, Friday 10am","body":"A calendar invite from a colleague you work with. The details match what was discussed at last week’s meeting.","scam":false,"why":"It comes from a colleague, fits what you already expected and asks you to do nothing risky."}];

export default class AssuranceClient extends React.Component {
  state = { tm: 0, play: false, started: false, ck: [false, false, false, false, false, false, false, false], mi: 0, ans: null, right: 0, name: "", contact: "", where: "", need: "", status: "idle", tried: false, ref: "" };

  componentDidMount() {
    // The night autoplays once when it scrolls into view, except in lite /
    // reduced-motion mode, where the visitor drives it.
    const ns = this.root.querySelector("#night-stage");
    if (!isLite() && ns && "IntersectionObserver" in window) {
      this._io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting && !this.state.started) { this.setState({ started: true }); this.startPlay(); this._io.disconnect(); } }), { threshold: 0.5 });
      this._io.observe(ns);
    }
    this._click = (e) => {
      const a = e.target.closest && e.target.closest("a[data-open]");
      if (!a) return;
      const d = document.getElementById(a.getAttribute("data-open"));
      if (d) d.open = true;
    };
    this.root.addEventListener("click", this._click);
  }
  componentWillUnmount() {
    clearInterval(this._tick);
    this._io?.disconnect();
    this.root?.removeEventListener("click", this._click);
  }
  startPlay() {
    clearInterval(this._tick);
    if (this.state.tm >= 840) this.setState({ tm: 0 });
    this.setState({ play: true });
    this._tick = setInterval(() => { const t = this.state.tm + 6; if (t >= 840) { clearInterval(this._tick); this.setState({ tm: 840, play: false }); } else this.setState({ tm: t }); }, 70);
  }
  answer(isScam) {
    const s = this.state;
    if (s.ans !== null) return;
    const m = MAILS[s.mi];
    this.setState({ ans: isScam, right: s.right + (isScam === m.scam ? 1 : 0) });
  }
  submit = async (e) => {
    e?.preventDefault?.();
    const s = this.state;
    this.setState({ tried: true });
    if (!s.name.trim() || !s.contact.trim()) {
      this.root.querySelector(!s.name.trim() ? "#f-name" : "#f-contact")?.focus();
      return;
    }
    this.setState({ status: "sending" });
    try {
      const ref = await postEnquiry({ name: s.name, contact: s.contact, location: s.where, message: s.need, problem: "Technology Health Check", source: "assurance_contact" });
      this.setState({ status: "sent", ref });
    } catch {
      this.setState({ status: "error" });
    }
  };
  onStart = () => {
    if (this._started) return;
    this._started = true;
    track("form_start", { form: "assurance", source: "assurance_contact" });
  };

  renderVals() {
    const s = this.state, eN = s.tried && !s.name.trim(), eC = s.tried && !s.contact.trim(), ok = "rgba(245,241,232,0.18)", bad = "#F2C879";
    const n = s.ck.filter(Boolean).length, score = Math.round((n / 8) * 100);
    const gaps = []; const seen = {};
    CH.forEach((c, i) => { if (!s.ck[i] && !seen[c.id] && gaps.length < 3) { seen[c.id] = 1; gaps.push({ id: c.id, label: c.h }); } });
    const m = MAILS[Math.min(s.mi, 4)], done = s.mi >= 5, asked = s.ans !== null;
    const correct = asked && s.ans === m.scam;
    const tm = s.tm, ph = Math.sin((Math.PI * tm) / 840), mix = (a, b) => Math.round(a + (b - a) * ph), clk = (18 * 60 + tm) % 1440;
    const evSeen = EVENTS.filter((x) => x.m <= tm), shownE = evSeen.slice().reverse().slice(0, 4);
    const field = (k) => (e) => { this.onStart(); this.setState({ [k]: e.target.value }); };
    return {
      skyFill: "rgb(" + mix(15, 1) + "," + mix(90, 12) + "," + mix(72, 9) + ")", starO: Math.min(1, ph * 1.6), orbX: 70 + (1060 * tm) / 840, orbY: 322 - 306 * ph, orbFill: ph < 0.35 ? "#D4A637" : "#F5F1E8",
      officeO: Math.max(0.12, 1 - ph * 1.1), cityO: Math.min(1, ph * 1.5), cloudO: Math.max(0, 1 - ph * 1.8),
      tm, clock: String(Math.floor(clk / 60)).padStart(2, "0") + ":" + String(clk % 60).padStart(2, "0"),
      playIcon: s.play ? "❚❚" : tm >= 840 ? "↻" : "▶", playAria: s.play ? "Pause" : "Play the night",
      togglePlay: () => { if (this.state.play) { clearInterval(this._tick); this.setState({ play: false }); } else this.startPlay(); },
      onScrub: (e) => { clearInterval(this._tick); this.setState({ tm: +e.target.value, play: false, started: true }); },
      nHandled: evSeen.filter((x) => x.ok).length, nNeeds: evSeen.filter((x) => !x.ok).length, noEvents: evSeen.length === 0, isEnd: tm >= 840,
      shown: shownE.map((x) => ({ time: x.t, title: x.title, note: x.note, tag: x.ok ? "HANDLED" : "NEEDS YOU", col: x.ok ? "#3DFFA8" : "#F2C879", edge: x.ok ? "rgba(61,255,168,0.3)" : "rgba(242,200,121,0.6)", bg: x.ok ? "rgba(61,255,168,0.05)" : "rgba(242,200,121,0.08)" })),
      ticked: n, score, ringOff: 440 - (440 * score) / 100,
      verdict: n === 8 ? "Strong foundations" : n >= 5 ? "A few gaps to close" : n >= 2 ? "Real gaps, and they can be fixed" : "Start by ticking what is true",
      checks: CH.map((c, i) => { const on = s.ck[i]; return { text: c.t, on, tick: on ? "✓" : "", edge: on ? "#D4A637" : "rgba(245,241,232,0.2)", bg: on ? "rgba(212,166,55,0.12)" : "transparent", box: on ? "#D4A637" : "rgba(245,241,232,0.5)", boxBg: on ? "#D4A637" : "transparent", toggle: () => this.setState((st) => ({ ck: st.ck.map((v, k) => (k === i ? !v : v)) })) }; }),
      hasGaps: n > 0 && n < 8, gaps,
      phOpen: !done, phDone: done, phN: Math.min(s.mi + 1, 5), phRight: s.right, mail: m, phAsk: !asked, phShow: asked,
      ansReal: () => this.answer(false), ansScam: () => this.answer(true),
      phResult: correct ? "Correct." : "Not quite.", phCol: correct ? "#1D8C61" : "#B3261E",
      phNext: () => this.setState((st) => ({ mi: st.mi + 1, ans: null })), phNextLabel: s.mi >= 4 ? "See my score" : "Next email",
      phScore: s.right, phVerdict: s.right >= 4 ? "Sharp eyes. Real attacks are cleverer, so the whole team needs the same habits." : "Scams like these work because they look ordinary. A second pair of eyes and a few simple habits stop most of them.",
      phReset: () => this.setState({ mi: 0, ans: null, right: 0 }),
      vName: s.name, vContact: s.contact, vWhere: s.where, vNeed: s.need,
      onName: field("name"), onContact: field("contact"), onWhere: field("where"), onNeed: field("need"),
      eName: eN, eContact: eC, noErr: false, bName: eN ? bad : ok, bContact: eC ? bad : ok, bNone: ok,
      isIdle: s.status === "idle", isSending: s.status === "sending", isSent: s.status === "sent", isError: s.status === "error",
      refLine: s.ref ? ` Your reference is ${s.ref}.` : "",
      submit: this.submit, retry: () => this.setState({ status: "idle" }),
    };
  }

  render() {
    return (
      <div className="asr-root" ref={(el) => { this.root = el; }} style={{ fontFamily: "var(--font-manrope),'Manrope',system-ui,sans-serif", color: "#1A1A1A" }}>
        <Markup v={this.renderVals()} />
      </div>
    );
  }
}
