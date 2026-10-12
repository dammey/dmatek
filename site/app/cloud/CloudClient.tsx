/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";
// A port of the design's logic class (DMatek Cloud Home v3.1 shared.dc.html).
// Window globals from the prototype (__c3S, __c2S, __c3, __c2, drills) are
// instance fields here, and DOM lookups are scoped to this page's root.

import React from "react";
import { JetBrains_Mono } from "next/font/google";
import { useRouter } from "next/navigation";
import Markup from "./CloudMarkup";
import { D_FOUNDRY_URL } from "@/lib/content/navigation";
import { enquiryHref } from "@/lib/enquiry";
import { isLite } from "@/lib/lite";
import "./cloud.css";

const jbm = JetBrains_Mono({ subsets: ["latin"], weight: ["300", "400", "500", "700"], variable: "--font-jbm", display: "swap" });

const SV = [{"code":"DNS","title":"Domains, DNS & SSL","ll":[30,-30],"line":"Domain registration, DNS management and SSL management.","gets":["Domain Registration","DNS Management","SSL Management"]},{"code":"WEB","title":"Websites & Hosting","ll":[28,60],"line":"Web hosting, managed hosting and website care.","gets":["Web Hosting","Managed Hosting","Reseller / White-label Hosting","Website Care & Management","Website Security","Website Backup & Recovery","CDN & DDoS Protection","Website Migration"]},{"code":"SRV","title":"Servers & Virtualisation","ll":[10,150],"line":"VPS, dedicated servers and virtualisation.","gets":["VPS Hosting","Dedicated Servers","Virtualisation","Application Hosting","Server Management","Colocation","Managed Databases","DevOps / CI-CD Infrastructure"]},{"code":"CLD","title":"Cloud Infrastructure","ll":[-25,100],"line":"AWS, Azure and Google Cloud, managed and migrated.","gets":["Cloud Infrastructure","Managed Cloud","Cloud Migration","Cloud Cost Optimisation"]},{"code":"STO","title":"Storage & Directory","ll":[-35,10],"line":"Cloud storage, file servers and directory services.","gets":["Cloud Storage & File Sync","NAS & File Servers","Directory Services"]},{"code":"MAIL","title":"Email & Productivity","ll":[-20,-80],"line":"Business email, Microsoft 365, Google Workspace and Zoho.","gets":["Business Email","Microsoft 365","Google Workspace","Zoho Workplace","Collaboration & Digital Workplace","Email Migration","Email Security","DMARC / SPF / DKIM Management","Email Archiving"]},{"code":"BAK","title":"Backup","ll":[15,-130],"line":"Backups for servers, endpoints, cloud, Microsoft 365 and Google Workspace.","gets":["Backup","Microsoft 365 Backup","Google Workspace Backup","Backup Verification","Immutable / Ransomware-resistant Backup"]},{"code":"RCV","title":"Recovery & Continuity","ll":[50,-170],"line":"Disaster recovery and continuity, and hosting for resilience.","gets":["Server Backup & Server Disaster Recovery","Cloud Disaster Recovery","Business Continuity Infrastructure","Disaster Recovery-as-a-Service","Nigerian Data-Residency Hosting","Private AI Assistant Hosting"]},{"code":"LINK","title":"Talk to us","ll":[-62,172],"line":"Tell us what you use today. We’ll book a free review with an engineer.","contact":1}];
const N2 = [{"code":"DNS1","title":"Domain Registration","full":"Domain Registration","short":"domain registration","pos":[0.553,1.8,-0.18],"line":"We register and renew the name people type to find you online.","gets":[],"g":0,"tag":"","st":"Delivered","domain":1,"backup":0,"status":0},{"code":"DNS2","title":"DNS Management","full":"DNS Management","short":"dns management","pos":[-0.544,2.199,0],"line":"We manage the settings that send your domain to your website and email.","gets":[],"g":0,"tag":"","st":"Delivered","domain":0,"backup":0,"status":0},{"code":"DNS3","title":"SSL Management","full":"SSL Management","short":"ssl management","pos":[0.074,1.11,0.18],"line":"We install and renew the certificate that shows visitors your site is secure.","gets":[],"g":0,"tag":"","st":"Delivered","domain":0,"backup":0,"status":0},{"code":"WEB1","title":"Web Hosting","full":"Web Hosting","short":"web hosting","pos":[-0.474,1.286,0.671],"line":"Space on a server where your website lives and stays online.","gets":[],"g":1,"tag":"","st":"Delivered","domain":0,"backup":0,"status":1},{"code":"WEB2","title":"Managed Hosting","full":"Managed Hosting (incl. managed WordPress)","short":"managed hosting","pos":[-1.348,1.593,0.851],"line":"We host your site and handle the updates and upkeep for you.","gets":[],"g":1,"tag":"","st":"Offered","domain":0,"backup":0,"status":0},{"code":"WEB3","title":"Reseller / White-label Hosting","full":"Reseller / White-label Hosting","short":"reseller / white-label hosting","pos":[-0.874,0.77,1.031],"line":"Web agencies host client sites with us and bill under their own name.","gets":[],"g":1,"tag":"","st":"Offered","domain":0,"backup":0,"status":0},{"code":"WEB4","title":"Website Care & Management","full":"Website Care & Management","short":"website care & management","pos":[-0.495,1.736,0.671],"line":"We keep your website updated, checked and in working order.","gets":[],"g":1,"tag":"","st":"Offered","domain":0,"backup":0,"status":0},{"code":"WEB5","title":"Website Security","full":"Website Security","short":"website security","pos":[-1.683,1.181,0.851],"line":"Scanning, hardening and monitoring to keep your website safe from hackers.","gets":[],"g":1,"tag":"","st":"Offered","domain":0,"backup":0,"status":0},{"code":"WEB6","title":"Website Backup & Recovery","full":"Website Backup & Recovery","short":"website backup & recovery","pos":[-0.244,0.934,1.031],"line":"Copies of your site are kept so it can be brought back if something breaks.","gets":[],"g":1,"tag":"","st":"Offered","domain":0,"backup":0,"status":0},{"code":"WEB7","title":"CDN & DDoS Protection","full":"CDN & DDoS Protection (Cloudflare)","short":"cdn & ddos protection","pos":[-1.147,1.95,0.671],"line":"Cloudflare serves your site quickly to visitors and blocks floods of fake traffic.","gets":[],"g":1,"tag":"","st":"Offered","domain":0,"backup":0,"status":0},{"code":"WEB8","title":"Website Migration","full":"Website Migration","short":"website migration","pos":[-1.349,0.649,0.851],"line":"We move your site, files and settings with as little downtime as possible.","gets":[],"g":1,"tag":"","st":"Offered","domain":0,"backup":0,"status":0},{"code":"SRV1","title":"VPS Hosting","full":"VPS Hosting","short":"vps hosting","pos":[0.597,0.771,-1.8],"line":"A virtual server for sites or apps that need more control than shared hosting.","gets":[],"g":2,"tag":"","st":"Offered","domain":0,"backup":0,"status":0},{"code":"SRV2","title":"Dedicated Servers","full":"Dedicated Servers","short":"dedicated servers","pos":[-0.277,1.079,-1.62],"line":"One server used only by your business, for heavy or sensitive work.","gets":[],"g":2,"tag":"","st":"Offered","domain":0,"backup":0,"status":0},{"code":"SRV3","title":"Virtualisation","full":"Virtualisation (Proxmox / Hyper-V / VMware)","short":"virtualisation","pos":[0.197,0.256,-1.44],"line":"One physical server runs several virtual servers using Proxmox, Hyper-V or VMware.","gets":[],"g":2,"tag":"","st":"Offered","domain":0,"backup":0,"status":0},{"code":"SRV4","title":"Application Hosting","full":"Application Hosting","short":"application hosting","pos":[0.576,1.221,-1.8],"line":"We run your business applications on servers we set up and maintain.","gets":[],"g":2,"tag":"","st":"Offered","domain":0,"backup":0,"status":0},{"code":"SRV5","title":"Server Management","full":"Server Management","short":"server management","pos":[-0.612,0.667,-1.62],"line":"Updates, monitoring, security and fixes for your servers, in the office or the cloud.","gets":[],"g":2,"tag":"","st":"Offered","domain":0,"backup":0,"status":0},{"code":"SRV6 · PLANNED","title":"Colocation","full":"Colocation","short":"colocation","pos":[0.827,0.419,-1.44],"line":"Planned. This is not available to order yet.","gets":[],"g":2,"tag":"PLANNED","st":"Future","domain":0,"backup":0,"status":0},{"code":"SRV7 · PLANNED","title":"Managed Databases","full":"Managed Databases","short":"managed databases","pos":[-0.076,1.436,-1.8],"line":"Planned. This is not available to order yet.","gets":[],"g":2,"tag":"PLANNED","st":"Future","domain":0,"backup":0,"status":0},{"code":"SRV8 · PLANNED","title":"DevOps / CI-CD Infrastructure","full":"DevOps / CI-CD Infrastructure","short":"devops / ci-cd infrastructure","pos":[-0.278,0.134,-1.62],"line":"Planned. This is not available to order yet.","gets":[],"g":2,"tag":"PLANNED","st":"Future","domain":0,"backup":0,"status":0},{"code":"CLD1","title":"Cloud Infrastructure","full":"Cloud Infrastructure (AWS / Azure / GCP)","short":"cloud infrastructure","pos":[1.603,0.257,1.234],"line":"We design and build your servers and services on the major cloud platforms.","gets":[],"g":3,"tag":"","st":"Offered","domain":0,"backup":0,"status":0},{"code":"CLD2","title":"Managed Cloud","full":"Managed Cloud","short":"managed cloud","pos":[0.583,0.625,1.414],"line":"We operate and maintain your cloud services so your team can focus on its work.","gets":[],"g":3,"tag":"","st":"Offered","domain":0,"backup":0,"status":0},{"code":"CLD3","title":"Cloud Migration","full":"Cloud Migration","short":"cloud migration","pos":[1.152,-0.373,1.594],"line":"We plan and move your servers, files and applications to the cloud.","gets":[],"g":3,"tag":"","st":"Offered","domain":0,"backup":0,"status":0},{"code":"CLD4 · DEV","title":"Cloud Cost Optimisation","full":"Cloud Cost Optimisation","short":"cloud cost optimisation","pos":[1.621,0.815,1.234],"line":"A review of your cloud usage to cut what you pay for and do not use.","gets":[],"g":3,"tag":"IN DEVELOPMENT","st":"In Development","domain":0,"backup":0,"status":0},{"code":"STO1","title":"Cloud Storage & File Sync","full":"Cloud Storage & File Sync (SharePoint, OneDrive, Drive, Nextcloud)","short":"cloud storage & file sync","pos":[-1.201,-0.257,-0.49],"line":"SharePoint, OneDrive, Google Drive or Nextcloud set up so everyone works on the same files.","gets":[],"g":4,"tag":"","st":"Offered","domain":0,"backup":0,"status":0},{"code":"STO2","title":"NAS & File Servers","full":"NAS & File Servers","short":"nas & file servers","pos":[-2.298,0.142,-0.31],"line":"A storage device or server where your team saves and shares files on site.","gets":[],"g":4,"tag":"","st":"Offered","domain":0,"backup":0,"status":0},{"code":"STO3","title":"Directory Services","full":"Directory Services (Active Directory / Entra ID)","short":"directory services","pos":[-1.68,-0.947,-0.13],"line":"Active Directory or Entra ID controls who can sign in and what they can open.","gets":[],"g":4,"tag":"","st":"Offered","domain":0,"backup":0,"status":0},{"code":"MAIL1","title":"Business Email","full":"Business Email","short":"business email","pos":[1.818,-0.771,-1.053],"line":"Addresses like name@yourcompany.com, set up and supported.","gets":[],"g":5,"tag":"","st":"Delivered","domain":0,"backup":0,"status":0},{"code":"MAIL2","title":"Microsoft 365","full":"Microsoft 365 (licensing, setup, management)","short":"microsoft 365","pos":[0.965,-0.472,-0.873],"line":"We buy the right licences, set up Outlook, Teams and Office, and can manage users for you.","gets":[],"g":5,"tag":"","st":"Offered","domain":0,"backup":0,"status":0},{"code":"MAIL3","title":"Google Workspace","full":"Google Workspace (licensing, setup, management)","short":"google workspace","pos":[1.426,-1.271,-0.693],"line":"We buy the licences, set up Gmail, Drive and Meet, and can manage users for you.","gets":[],"g":5,"tag":"","st":"Offered","domain":0,"backup":0,"status":0},{"code":"MAIL4","title":"Zoho Workplace","full":"Zoho Workplace (licensing, setup, management)","short":"zoho workplace","pos":[1.792,-0.336,-1.053],"line":"We buy the licences, set up Zoho Mail and its apps, and can manage users for you.","gets":[],"g":5,"tag":"","st":"Offered","domain":0,"backup":0,"status":0},{"code":"MAIL5","title":"Collaboration & Digital Workplace","full":"Collaboration & Digital Workplace (Teams, Meet, SharePoint)","short":"collaboration & digital workplace","pos":[0.645,-0.872,-0.873],"line":"Teams, Meet and SharePoint set up for chat, video calls and shared documents.","gets":[],"g":5,"tag":"","st":"Offered","domain":0,"backup":0,"status":0},{"code":"MAIL6","title":"Email Migration","full":"Email Migration","short":"email migration","pos":[2.032,-1.111,-0.693],"line":"We move mailboxes, old messages and contacts to your new email service.","gets":[],"g":5,"tag":"","st":"Offered","domain":0,"backup":0,"status":0},{"code":"MAIL7","title":"Email Security","full":"Email Security","short":"email security","pos":[1.162,-0.132,-1.053],"line":"Filtering and settings that stop harmful email before it reaches staff.","gets":[],"g":5,"tag":"","st":"Offered","domain":0,"backup":0,"status":0},{"code":"MAIL8","title":"DMARC / SPF / DKIM Management","full":"DMARC / SPF / DKIM Management","short":"dmarc / spf / dkim management","pos":[0.968,-1.384,-0.873],"line":"Records that prove your email is genuine and help keep it out of spam folders.","gets":[],"g":5,"tag":"","st":"Offered","domain":0,"backup":0,"status":0},{"code":"MAIL9 · DEV","title":"Email Archiving","full":"Email Archiving","short":"email archiving","pos":[2.222,-0.529,-0.693],"line":"Every email stored and searchable for records and disputes.","gets":[],"g":5,"tag":"IN DEVELOPMENT","st":"In Development","domain":0,"backup":0,"status":0},{"code":"BAK1","title":"Backup","full":"Backup (server, endpoint, cloud)","short":"backup","pos":[0.169,-1.286,1.037],"line":"Regular copies of your important data, kept safely so it can be restored.","gets":[],"g":6,"tag":"","st":"Delivered","domain":0,"backup":0,"status":0},{"code":"BAK2","title":"Microsoft 365 Backup","full":"Microsoft 365 Backup","short":"microsoft 365 backup","pos":[-0.798,-0.94,1.217],"line":"A separate copy of Outlook, OneDrive and SharePoint data in case of loss.","gets":[],"g":6,"tag":"","st":"Offered","domain":0,"backup":0,"status":0},{"code":"BAK3","title":"Google Workspace Backup","full":"Google Workspace Backup","short":"google workspace backup","pos":[-0.264,-1.874,1.397],"line":"A separate copy of Gmail and Drive data in case of loss or deletion.","gets":[],"g":6,"tag":"","st":"Offered","domain":0,"backup":0,"status":0},{"code":"BAK4","title":"Backup Verification","full":"Backup Verification","short":"backup verification","pos":[0.173,-0.767,1.037],"line":"We restore from your backups to check they work. Included with every backup service.","gets":[],"g":6,"tag":"","st":"Offered","domain":0,"backup":1,"status":0},{"code":"BAK5 · DEV","title":"Immutable / Ransomware-resistant Backup","full":"Immutable / Ransomware-resistant Backup","short":"immutable / ransomware-resistant backup","pos":[-1.202,-1.407,1.217],"line":"Backup copies locked so attackers cannot encrypt or erase them.","gets":[],"g":6,"tag":"IN DEVELOPMENT","st":"In Development","domain":0,"backup":0,"status":0},{"code":"RCV1","title":"Server Backup & Server Disaster Recovery","full":"Server Backup & Server Disaster Recovery","short":"server backup & server disaster recovery","pos":[0.479,-1.8,-0.18],"line":"Server backups plus a written plan to bring them back after a breakdown.","gets":[],"g":7,"tag":"","st":"Offered","domain":0,"backup":0,"status":0},{"code":"RCV2","title":"Cloud Disaster Recovery","full":"Cloud Disaster Recovery","short":"cloud disaster recovery","pos":[-0.449,-1.47,0],"line":"If your office systems fail, they can run from the cloud while you recover.","gets":[],"g":7,"tag":"","st":"Offered","domain":0,"backup":0,"status":0},{"code":"RCV3","title":"Business Continuity Infrastructure","full":"Business Continuity Infrastructure","short":"business continuity infrastructure","pos":[0.06,-2.358,0.18],"line":"Standby systems and links set up so work can continue during a failure.","gets":[],"g":7,"tag":"","st":"Offered","domain":0,"backup":0,"status":0},{"code":"RCV4 · DEV","title":"Disaster Recovery-as-a-Service","full":"Disaster Recovery-as-a-Service (DRaaS)","short":"disaster recovery-as-a-service","pos":[0.472,-1.31,-0.18],"line":"Your systems copied to standby servers, ready to run if yours fail.","gets":[],"g":7,"tag":"IN DEVELOPMENT","st":"In Development","domain":0,"backup":0,"status":0},{"code":"RCV5 · PLANNED","title":"Nigerian Data-Residency Hosting","full":"Nigerian Data-Residency Hosting","short":"nigerian data-residency hosting","pos":[-0.825,-1.914,0],"line":"Planned. This is not available to order yet.","gets":[],"g":7,"tag":"PLANNED","st":"Future","domain":0,"backup":0,"status":0},{"code":"RCV6 · PLANNED","title":"Private AI Assistant Hosting","full":"Private AI Assistant Hosting","short":"private ai assistant hosting","pos":[0.752,-2.187,0.18],"line":"Planned. This is not available to order yet.","gets":[],"g":7,"tag":"PLANNED","st":"Future","domain":0,"backup":0,"status":0},{"code":"LINK","title":"Talk to us","short":"this","pos":[2.3,-1.4,0],"line":"Tell us what you use today. We’ll book a free review with an engineer.","contact":1,"alt":1,"g":-1,"tag":"","gets":[]}];
const LINKS = [[0,1],[1,2],[3,4],[3,6],[4,5],[5,6],[5,8],[6,7],[7,8],[7,10],[8,9],[9,10],[11,12],[11,14],[12,13],[13,14],[13,16],[14,15],[15,16],[15,18],[16,17],[17,18],[19,20],[19,22],[20,21],[21,22],[23,24],[24,25],[26,27],[26,29],[27,28],[28,29],[28,31],[29,30],[30,31],[30,33],[31,32],[32,33],[33,34],[35,36],[35,38],[36,37],[37,38],[38,39],[40,41],[40,43],[41,42],[42,43],[42,45],[43,44],[44,45],[46,0],[46,23]];
const SVL = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0],[8,0],[8,4],[8,6]];
const DRILL = ["Locate last night’s snapshot", "Spin up an isolated restore environment", "Restore files and database", "Verify checksums and open the app", "Report sent to your team"];
const vec = ([la, lo]) => { const a = (la * Math.PI) / 180, b = (lo * Math.PI) / 180; return [Math.cos(a) * Math.sin(b), -Math.sin(a), Math.cos(a) * Math.cos(b)]; };

class Cloud extends React.Component {
  state = { bk: 0, bkp: 0, focus: -1, list: false, mode: "home", svc: -1, panel: null, sound: false, domain: "", checked: "", narrow: false, lite: false };
  S = null; // sphere engine state (prototype: window.__c3S)
  S2 = null; // inside-network state (prototype: window.__c2S)
  _stop3 = null;
  _stop2 = null;
  _offs = [];

  q = (sel) => this.root?.querySelector(sel);
  qa = (sel) => (this.root ? Array.from(this.root.querySelectorAll(sel)) : []);

  componentDidMount() {
    const lite = isLite();
    this._r = () => {
      this.setState({ narrow: window.innerWidth < 760 });
      // The sphere only runs where it is shown (not on phones or in lite mode).
      if (!this._stop3 && !lite && window.innerWidth >= 760) this.engine();
    };
    this.setState({ lite });
    this._r();
    window.addEventListener("resize", this._r);
    // "Most customers start here" cards and list chips open their full-list row.
    const onClick = (e) => {
      const a = e.target.closest && e.target.closest("a[data-open]");
      if (!a) return;
      const d = document.getElementById(a.getAttribute("data-open"));
      if (d) for (let p = d; p; p = p.parentElement) if (p.tagName === "DETAILS") p.open = true;
    };
    this.root.addEventListener("click", onClick);
    this._offs.push(() => this.root?.removeEventListener("click", onClick));
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this._r);
    clearInterval(this._bkt);
    if (this._stop3) this._stop3();
    if (this._stop2) this._stop2();
    this._offs.forEach((f) => f());
  }
  enterSvc(i, from) {
    const S = this.S;
    if (!S || S.busy) return;
    if (SV[i].contact) { this.openPanel({ kind: "contact", svc: i }, from); return; }
    S.busy = true; S.warpFrom = S.mode; S.target = i; S.warpT0 = performance.now(); S.mode = "warp";
    if (S.A) S.A.whoosh();
    this.setState({ mode: "warp", panel: null });
    const id = setTimeout(() => {
      S.mode = "inside"; S.svc = i; S.busy = false;
      this.setState({ mode: "inside", svc: i, focus: -1, list: false }, () => {
        this.net2();
        const l = this.q('[data-c3="inside"]');
        if (l && l.animate) l.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, easing: "ease-out" });
      });
    }, 1150);
    this._offs.push(() => clearTimeout(id));
  }
  backHome() {
    const S = this.S;
    if (!S) return;
    if (this._stop2) this._stop2();
    S.mode = "home"; S.svc = -1; S.returnT0 = performance.now(); S.hover = -1;
    if (S.A) S.A.blip(520, 0.18, 0.04);
    this.setState({ mode: "home", svc: -1, panel: null, focus: -1, list: false });
  }
  openPanel(pnl, ev) {
    const S = this.S;
    const r = this.q('[data-c3="root"]')?.getBoundingClientRect() ?? { left: 0, top: 0 };
    const x = (ev && ev.clientX != null ? ev.clientX : innerWidth / 2) - r.left, y = (ev && ev.clientY != null ? ev.clientY : innerHeight / 2) - r.top;
    if (S && S.A) S.A.chime();
    this.setState({ panel: pnl });
    setTimeout(() => {
      const h = this.q('[data-c3="holo"]');
      if (h && h.animate && !this.state.lite) h.animate([{ clipPath: "circle(0px at " + x + "px " + y + "px)" }, { clipPath: "circle(150% at " + x + "px " + y + "px)" }], { duration: 750, easing: "cubic-bezier(.7,0,.2,1)", fill: "backwards" });
      h?.querySelector("button")?.focus({ preventScroll: true });
    }, 16);
  }
  closePanel() {
    const h = this.q('[data-c3="holo"]');
    const S = this.S;
    if (S && S.A) S.A.blip(440, 0.12, 0.035);
    if (h && h.animate) {
      const a = h.animate([{ opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(1.03)" }], { duration: 280, easing: "ease-in", fill: "forwards" });
      a.onfinish = () => this.setState({ panel: null });
      setTimeout(() => { if (this.state.panel) this.setState({ panel: null }); }, 400);
    } else this.setState({ panel: null });
  }
  go2(i) {
    const S = this.S2 || (this.S2 = {});
    S.focus = i; S.flash = performance.now();
    this.setState({ focus: i, list: false });
    setTimeout(() => {
      const p = this.q('[data-cl="panel"]');
      if (p && p.animate) p.animate([{ transform: "translateX(48px)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 650, delay: 380, easing: "cubic-bezier(.2,.7,.2,1)", fill: "backwards" });
    }, 20);
  }
  shut2() { const S = this.S2 || (this.S2 = {}); S.focus = -1; this.setState({ focus: -1 }); }

  // Inside a group: a 3D network of its services.
  net2() {
    if (this._stop2) this._stop2();
    const S = (this.S2 = { focus: -1, hover: -1, flash: 0 });
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cv = this.q('[data-cl="net"]');
    if (!cv) return;
    const ctx = cv.getContext("2d");
    let W = 0, H = 0, dpr = 1;
    const resize = () => { dpr = Math.min(2, window.devicePixelRatio || 1); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize(); window.addEventListener("resize", resize);
    let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const pts = [];
    for (let i = 0; i < 170; i++) pts.push([(rnd() - 0.5) * 3.6, (rnd() - 0.5) * 2.6, (rnd() - 0.5) * 2.2]);
    const svc = N2.map((n) => n.pos);
    const all = pts.concat(svc), base = pts.length;
    const grp = this.state.svc, mem = N2.map((n) => n.g === grp || !!n.alt), gm = N2.filter((n) => n.g === grp), GC = gm.length ? [0, 1, 2].map((k) => gm.reduce((t, n) => t + n.pos[k], 0) / gm.length) : [0, 0, 0];
    const edges = [];
    const d2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
    all.forEach((p, i) => { const near = all.map((q, j) => [j, d2(p, q)]).filter((x) => x[0] !== i).sort((a, b) => a[1] - b[1]).slice(0, i >= base ? 4 : 2); near.forEach(([j]) => { if (!edges.some((e) => (e[0] === i && e[1] === j) || (e[0] === j && e[1] === i))) edges.push([i, j, 0]); }); });
    LINKS.forEach(([a, b]) => edges.push([base + a, base + b, 1]));
    const pk = []; for (let i = 0; i < 70; i++) pk.push({ e: Math.floor(rnd() * edges.length), t: rnd(), v: 0.004 + rnd() * 0.008 });
    const cam = { x: 0, y: 0, z: 0, zoom: 1, off: 0, yaw: 0, pitch: 0 };
    let drift = 0, mx = 0.5, my = 0.5;
    const onMove = (e) => { mx = e.clientX / innerWidth; my = e.clientY / innerHeight; };
    window.addEventListener("mousemove", onMove, { passive: true });
    const onKey = (e) => {
      if (e.key === "Escape" && !this.state.panel) { if (S.focus >= 0) this.shut2(); else this.backHome(); }
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") { const ids = N2.map((n, i) => i).filter((i) => mem[i]), cur = ids.indexOf(S.focus), rt = e.key === "ArrowRight"; this.go2(ids[cur < 0 ? (rt ? 0 : ids.length - 1) : (cur + (rt ? 1 : -1) + ids.length) % ids.length]); }
    };
    window.addEventListener("keydown", onKey);
    const P = new Array(all.length);
    const proj = (p, o) => {
      let x = p[0] - cam.x, y = p[1] - cam.y, z = p[2] - cam.z;
      const cy = Math.cos(cam.yaw), sy = Math.sin(cam.yaw); const x2 = x * cy - z * sy; z = x * sy + z * cy; x = x2;
      const cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch); const y2 = y * cp - z * sp; z = y * sp + z * cp; y = y2;
      z *= cam.zoom; const den = 2.6 - z; if (den < 0.25) { o.v = false; return o; }
      const s = (2.6 / den) * cam.zoom;
      o.X = W / 2 + cam.off + x * s * W * 0.3; o.Y = H / 2 + y * s * H * 0.34; o.s = s; o.z = z; o.v = true; return o;
    };
    for (let i = 0; i < all.length; i++) P[i] = {};
    const domNodes = () => this.qa('[data-cl="node"]');
    let dn = domNodes(), lastScan = 0, lastMs = 0, raf = 0;
    const frame = (now) => {
      if (W === 0 || H === 0 || cv.width !== Math.round(cv.clientWidth * dpr) || cv.height !== Math.round(cv.clientHeight * dpr)) resize();
      if (W === 0 || H === 0) return;
      const f = S.focus;
      if (!reduce) drift = Math.sin(now / 9000) * 0.22;
      const tgt = f >= 0 ? N2[f].pos : GC;
      const k = 0.055;
      cam.x += (tgt[0] - cam.x) * k; cam.y += (tgt[1] - cam.y) * k; cam.z += (tgt[2] - cam.z) * k;
      cam.zoom += ((f >= 0 ? 2.4 : 1.15) - cam.zoom) * k;
      cam.off += ((f >= 0 && W > 900 ? -W * 0.2 : 0) - cam.off) * k;
      cam.yaw += (drift + (mx - 0.5) * 0.5 - cam.yaw) * 0.05; cam.pitch += ((my - 0.5) * 0.3 - cam.pitch) * 0.05;
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < all.length; i++) proj(all[i], P[i]);
      const hv = S.hover;
      for (const [a, b, svcE] of edges) {
        const A = P[a], B = P[b]; if (!A.v || !B.v) continue;
        if (svcE && !(mem[a - base] && mem[b - base])) continue;
        const depth = Math.max(0, Math.min(1, (A.s + B.s) / 2 / 1.6));
        const hot = svcE && (f >= 0 || hv >= 0) && (a === base + (f >= 0 ? f : hv) || b === base + (f >= 0 ? f : hv));
        ctx.strokeStyle = svcE ? "rgba(212,166,55," + (hot ? 0.85 : 0.28 * depth + 0.08).toFixed(3) + ")" : "rgba(40,112,90," + (0.32 * depth + 0.05).toFixed(3) + ")";
        ctx.lineWidth = svcE ? (hot ? 1.8 : 1) : 0.7;
        ctx.beginPath(); ctx.moveTo(A.X, A.Y); ctx.lineTo(B.X, B.Y); ctx.stroke();
      }
      for (let i = 0; i < base; i++) { const A = P[i]; if (!A.v) continue; const r = Math.max(0.6, 1.6 * A.s); ctx.fillStyle = "rgba(169,187,179," + Math.min(0.9, 0.25 + 0.35 * A.s).toFixed(3) + ")"; ctx.beginPath(); ctx.arc(A.X, A.Y, r, 0, 6.283); ctx.fill(); }
      ctx.fillStyle = "#FFF3C9";
      for (const q of pk) {
        if (!reduce) { q.t += q.v; if (q.t > 1) { q.t = 0; q.e = Math.floor(Math.random() * edges.length); } }
        const [a, b] = edges[q.e], A = P[a], B = P[b]; if (!A.v || !B.v) continue;
        const X = A.X + (B.X - A.X) * q.t, Y = A.Y + (B.Y - A.Y) * q.t, r = Math.max(0.8, (1.8 * (A.s + B.s)) / 2);
        ctx.globalAlpha = 0.9; ctx.shadowColor = "#D4A637"; ctx.shadowBlur = 10; ctx.beginPath(); ctx.arc(X, Y, r, 0, 6.283); ctx.fill();
      }
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      for (let i = 0; i < N2.length; i++) {
        const A = P[base + i]; if (!A.v || !mem[i]) continue;
        const ph = ((now / 1000 + i * 0.37) % 2) / 2;
        ctx.strokeStyle = "rgba(212,166,55," + ((1 - ph) * 0.5).toFixed(3) + ")"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(A.X, A.Y, 10 + ph * 26 * Math.min(1.6, A.s), 0, 6.283); ctx.stroke();
      }
      if (f >= 0) { const A = P[base + f], age = (now - S.flash) / 900; if (A.v && age < 1) { ctx.strokeStyle = "rgba(255,243,201," + (1 - age).toFixed(3) + ")"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(A.X, A.Y, 20 + age * Math.max(W, H) * 0.5, 0, 6.283); ctx.stroke(); } }
      if (now - lastScan > 800) { dn = domNodes(); lastScan = now; }
      dn.forEach((el) => {
        const i = +el.getAttribute("data-i"), A = P[base + i];
        if (!A || !A.v) { el.style.opacity = "0"; el.style.pointerEvents = "none"; return; }
        const sc = Math.max(0.7, Math.min(1.5, A.s));
        el.style.left = "0"; el.style.top = "0";
        if (!el.__w) el.__w = el.offsetWidth || 180;
        const flip = A.X + (el.__w - 16) * sc > W - 16;
        el.style.flexDirection = flip ? "row-reverse" : "row";
        const ox = flip ? el.__w - 16 : 16;
        el.style.transform = "translate(" + (A.X - ox).toFixed(1) + "px," + (A.Y - 24).toFixed(1) + "px) scale(" + sc.toFixed(3) + ")";
        el.style.transformOrigin = ox + "px 24px";
        const dim = f >= 0 && i !== f ? 0.35 : 1;
        el.style.opacity = String(Math.min(1, 0.35 + 0.5 * A.s) * dim);
        el.style.zIndex = String(5 + Math.round(A.s * 10));
        el.style.pointerEvents = "auto";
      });
      if (now - lastMs > 1100) { lastMs = now; this.qa('[data-cl="ms"]').forEach((el) => { const b = +el.getAttribute("data-base") || 20; el.textContent = String(Math.max(1, Math.round(b + (Math.random() - 0.5) * b * 0.35))); }); }
    };
    const loop = (now) => { raf = requestAnimationFrame(loop); frame(now); };
    const kick = () => { resize(); frame(performance.now()); };
    const k1 = setTimeout(kick, 0), k2 = setTimeout(kick, 300);
    let ro = null; if ("ResizeObserver" in window) { ro = new ResizeObserver(kick); ro.observe(cv); }
    raf = requestAnimationFrame(loop);
    const timers = [];
    this._drill2 = () => this.drill(timers, "cl", "#6F8A80", "#D4A637", "#021A15", null);
    this._stop2 = () => { cancelAnimationFrame(raf); clearTimeout(k1); clearTimeout(k2); if (ro) ro.disconnect(); window.removeEventListener("resize", resize); window.removeEventListener("mousemove", onMove); window.removeEventListener("keydown", onKey); timers.forEach((t) => { clearTimeout(t); clearInterval(t); }); this._stop2 = null; };
  }

  // The restore drill animation shared by the sphere panel and the inside panel.
  drill(timers, ns, idle, tickInk, doneInk, A) {
    timers.forEach((t) => { clearTimeout(t); clearInterval(t); }); timers.length = 0;
    const steps = this.qa(`[data-${ns}="step"]`), ticks = this.qa(`[data-${ns}="tick"]`);
    const bar = this.q(`[data-${ns}="bar"]`), clock = this.q(`[data-${ns}="clock"]`), done = this.q(`[data-${ns}="done"]`);
    steps.forEach((s, i) => { s.style.color = idle; ticks[i].textContent = ""; ticks[i].style.background = "transparent"; });
    if (bar) bar.style.width = "0%";
    if (done) done.style.opacity = "0";
    const t0 = Date.now();
    const clk = setInterval(() => { const fr = Math.min(1, (Date.now() - t0) / (steps.length * 900)); const sec = Math.round(fr * 252); if (clock) clock.textContent = "00:" + String(Math.floor(sec / 60)).padStart(2, "0") + ":" + String(sec % 60).padStart(2, "0"); if (fr >= 1) clearInterval(clk); }, 60);
    timers.push(clk);
    steps.forEach((s, i) => {
      timers.push(setTimeout(() => { s.style.color = "#F5F1E8"; ticks[i].textContent = "•"; ticks[i].style.color = tickInk; ticks[i].style.borderColor = tickInk; A?.blip(700 + i * 80, 0.06, 0.03); }, i * 900));
      timers.push(setTimeout(() => { ticks[i].textContent = "✓"; ticks[i].style.background = "#D4A637"; ticks[i].style.color = doneInk; if (bar) bar.style.width = ((i + 1) / steps.length) * 100 + "%"; if (i === steps.length - 1) { if (done) done.style.opacity = "1"; A?.chime(); } }, i * 900 + 700));
    });
  }

  // The home sphere: nine groups on a rotating mesh, warp into a group.
  engine() {
    if (this._stop3) this._stop3();
    const S = (this.S = { mode: "home", svc: -1, hover: -1, shover: -1, busy: false, items: 0, rx: -0.18, ry: 0.5, vx: 0, vy: 0.0016, warpT0: 0, worldT0: 0, returnT0: 0, target: -1 });
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cv = this.q('[data-c3="cv"]');
    if (!cv) return;
    const ctx = cv.getContext("2d");
    let W = 0, H = 0, dpr = 1;
    const resize = () => { dpr = Math.min(2, window.devicePixelRatio || 1); W = cv.clientWidth; H = cv.clientHeight; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    // Ambient sound, off until the visitor turns it on.
    const A = (S.A = { on: false, ctx: null });
    A.start = () => {
      try {
        if (!A.ctx) {
          const C = (A.ctx = new (window.AudioContext || window.webkitAudioContext)());
          A.master = C.createGain(); A.master.gain.value = 0; A.master.connect(C.destination);
          [[55, 0.035, "sine"], [55.6, 0.03, "sine"], [110.3, 0.012, "triangle"]].forEach(([f, v, t]) => { const o = C.createOscillator(), g = C.createGain(); o.type = t; o.frequency.value = f; g.gain.value = v; o.connect(g); g.connect(A.master); o.start(); });
          const buf = C.createBuffer(1, C.sampleRate * 2, C.sampleRate), d = buf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; A.buf = buf;
          const n = C.createBufferSource(); n.buffer = buf; n.loop = true; const lp = C.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 380; const ng = C.createGain(); ng.gain.value = 0.014; n.connect(lp); lp.connect(ng); ng.connect(A.master); n.start();
        }
        A.ctx.resume(); A.master.gain.setTargetAtTime(1, A.ctx.currentTime, 0.5); A.on = true;
      } catch {}
    };
    A.stop = () => { if (A.ctx) A.master.gain.setTargetAtTime(0, A.ctx.currentTime, 0.2); A.on = false; };
    A.blip = (f = 880, d = 0.08, v = 0.04) => { if (!A.on) return; const C = A.ctx, o = C.createOscillator(), g = C.createGain(), t = C.currentTime; o.type = "sine"; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 1.5, t + d); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d); o.connect(g); g.connect(A.master); o.start(t); o.stop(t + d + 0.03); };
    A.whoosh = () => { if (!A.on) return; const C = A.ctx, n = C.createBufferSource(), t = C.currentTime; n.buffer = A.buf; const bp = C.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 1.6; bp.frequency.setValueAtTime(180, t); bp.frequency.exponentialRampToValueAtTime(3200, t + 0.95); const g = C.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.3, t + 0.45); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.15); n.connect(bp); bp.connect(g); g.connect(A.master); n.start(t); n.stop(t + 1.2); };
    A.chime = () => { A.blip(660, 0.25, 0.045); setTimeout(() => A.blip(990, 0.3, 0.035), 90); };
    // Sphere mesh.
    const fib = []; const NP = 230, ga = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < NP; i++) { const y = 1 - (i / (NP - 1)) * 2, r = Math.sqrt(1 - y * y), th = ga * i; fib.push([Math.cos(th) * r, y, Math.sin(th) * r]); }
    const sv = SV.map((s) => vec(s.ll)), all = fib.concat(sv), base = fib.length;
    const d2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
    const edges = [], seen = new Set();
    all.forEach((p, i) => all.map((q, j) => [j, d2(p, q)]).filter((x) => x[0] !== i).sort((a, b) => a[1] - b[1]).slice(0, i >= base ? 4 : 3).forEach(([j]) => { const k = i < j ? i + "-" + j : j + "-" + i; if (!seen.has(k)) { seen.add(k); edges.push([i, j, 0]); } }));
    SVL.forEach(([a, b]) => edges.push([base + a, base + b, 1]));
    let sd = 7; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
    const pk = []; for (let i = 0; i < 80; i++) pk.push({ e: Math.floor(rnd() * edges.length), t: rnd(), v: 0.005 + rnd() * 0.01 });
    const stars = []; for (let i = 0; i < 260; i++) stars.push({ a: rnd() * 6.283, d: rnd(), s: 0.3 + rnd() * 0.7 });
    const P = all.map(() => ({}));
    let drag = null;
    const onDown = (e) => { drag = { x: e.clientX, y: e.clientY }; cv.style.cursor = "grabbing"; };
    const onMoveP = (e) => { if (!drag || S.mode !== "home") return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag.x = e.clientX; drag.y = e.clientY; S.vy = dx * 0.0009; S.vx = dy * 0.0009; S.ry += dx * 0.005; S.rx = Math.max(-1.1, Math.min(1.1, S.rx + dy * 0.005)); };
    const onUp = () => { drag = null; cv.style.cursor = "grab"; };
    cv.addEventListener("pointerdown", onDown); window.addEventListener("pointermove", onMoveP); window.addEventListener("pointerup", onUp);
    const onKey = (e) => { if (e.key === "Escape" && this.state.panel) this.closePanel(); };
    window.addEventListener("keydown", onKey);
    const geo = () => { const narrow = W < 760; const R = Math.min(W, H) * 0.36; return { cx: narrow ? W * 0.5 : W * 0.6, cy: narrow ? H * 0.34 : H * 0.5, R }; };
    const proj = (p, o, g, sc, ox, oy) => {
      const cy = Math.cos(S.ry), sy = Math.sin(S.ry), cx = Math.cos(S.rx), sx = Math.sin(S.rx);
      const x1 = p[0] * cy + p[2] * sy, z1 = -p[0] * sy + p[2] * cy;
      const y2 = p[1] * cx - z1 * sx, z2 = p[1] * sx + z1 * cx;
      const pe = 3.2 / (3.2 - z2);
      o.X = g.cx + ox + x1 * g.R * pe * sc; o.Y = g.cy + oy + y2 * g.R * pe * sc; o.z = z2; o.pe = pe; return o;
    };
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    let lastMs = 0, lastScan = 0, hn = [];
    let visible = true;
    const place = (el, X, Y, op, active) => {
      el.style.left = "0"; el.style.top = "0";
      el.style.transform = "translate(" + X.toFixed(1) + "px," + Y.toFixed(1) + "px)";
      el.style.opacity = op.toFixed(3); el.style.pointerEvents = active ? "auto" : "none"; el.style.zIndex = String(6 + Math.round(op * 10));
      el.tabIndex = active ? 0 : -1;
      const tag = el.querySelector('[data-c3="tag"]'), ld = el.querySelector('[data-c3="leader"]');
      if (tag) { if (!tag.__w) tag.__w = tag.offsetWidth || 200; const flip = X + 26 + tag.__w > W - 12; tag.style.left = flip ? "auto" : "26px"; tag.style.right = flip ? "26px" : "auto"; if (ld) ld.style.transform = flip ? "rotate(-138deg)" : "rotate(-42deg)"; }
    };
    const frame = (now) => {
      if (W === 0 || H === 0 || cv.width !== Math.round(cv.clientWidth * dpr) || cv.height !== Math.round(cv.clientHeight * dpr)) resize();
      if (W === 0 || H === 0) return;
      const g = geo();
      ctx.clearRect(0, 0, W, H);
      if (now - lastScan > 700) { hn = this.qa('[data-c3="hnode"]'); lastScan = now; }
      const mode = S.mode;
      let wp = 0; if (mode === "warp") wp = Math.min(1, (now - S.warpT0) / 1150);
      if (mode === "warp") {
        const speed = 0.004 + ease(wp) * 0.05;
        const cx0 = W / 2, cy0 = H / 2, M = Math.hypot(W, H) * 0.6;
        ctx.lineCap = "round";
        for (const s of stars) {
          if (!reduce) { s.d += speed * s.s * (0.4 + s.d); if (s.d > 1) { s.d = 0.02; s.a = Math.random() * 6.283; } }
          const r1 = s.d * s.d * M, len = 4 + ease(wp) * 120 * s.d;
          const x1 = cx0 + Math.cos(s.a) * r1, y1 = cy0 + Math.sin(s.a) * r1, x2 = cx0 + Math.cos(s.a) * (r1 + len), y2 = cy0 + Math.sin(s.a) * (r1 + len);
          ctx.strokeStyle = s.s > 0.8 ? "rgba(61,255,168," + (0.25 + s.d * 0.6).toFixed(3) + ")" : "rgba(232,194,92," + (0.18 + s.d * 0.55).toFixed(3) + ")";
          ctx.lineWidth = 0.6 + s.d * 1.6;
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        }
      }
      if (mode === "home" || mode === "warp") {
        if (mode === "home" && !drag && !reduce) { S.ry += S.vy; S.rx += S.vx; S.vy += (0.0016 - S.vy) * 0.02; S.vx *= 0.94; S.rx += (-0.18 - S.rx) * 0.004; }
        let sc = 1, ox = 0, oy = 0, fade = 1;
        if (mode === "warp") { const e = ease(Math.min(1, wp / 0.7)); const T = P[base + S.target]; const tx = T.X != null ? T.X : g.cx, ty = T.Y != null ? T.Y : g.cy; sc = 1 + e * 9; ox = -(tx - g.cx) * e * 9 + (W / 2 - tx) * e; oy = -(ty - g.cy) * e * 9 + (H / 2 - ty) * e; fade = 1 - Math.min(1, wp / 0.6); }
        if (mode === "home" && S.returnT0) { const e = Math.min(1, (now - S.returnT0) / 900); sc = 3 - 2 * ease(e); fade = ease(e); if (e >= 1) S.returnT0 = 0; }
        for (let i = 0; i < all.length; i++) proj(all[i], P[i], g, sc, ox, oy);
        ctx.globalCompositeOperation = "lighter";
        const hv = S.hover;
        for (const [a, b, svcE] of edges) {
          const Ap = P[a], Bp = P[b], zf = ((Ap.z + Bp.z) / 2 + 1) / 2;
          const hot = svcE && hv >= 0 && (a === base + hv || b === base + hv);
          if (svcE) { ctx.strokeStyle = "rgba(61,255,168," + ((hot ? 0.95 : 0.18 + zf * 0.45) * fade).toFixed(3) + ")"; ctx.lineWidth = hot ? 2 : 1.1; }
          else { ctx.strokeStyle = "rgba(212,166,55," + ((0.04 + zf * zf * 0.3) * fade).toFixed(3) + ")"; ctx.lineWidth = 0.7; }
          ctx.beginPath(); ctx.moveTo(Ap.X, Ap.Y); ctx.lineTo(Bp.X, Bp.Y); ctx.stroke();
        }
        for (let i = 0; i < base; i++) { const Ap = P[i], zf = (Ap.z + 1) / 2; ctx.fillStyle = "rgba(232,194,92," + ((0.12 + zf * zf * 0.7) * fade).toFixed(3) + ")"; ctx.beginPath(); ctx.arc(Ap.X, Ap.Y, (0.6 + zf * 1.5) * Math.min(3, sc), 0, 6.283); ctx.fill(); }
        for (const q of pk) {
          if (!reduce) { q.t += q.v; if (q.t > 1) { q.t = 0; q.e = Math.floor(Math.random() * edges.length); } }
          const [a, b] = edges[q.e], Ap = P[a], Bp = P[b], zf = ((Ap.z + Bp.z) / 2 + 1) / 2; if (zf < 0.35) continue;
          ctx.fillStyle = "rgba(61,255,168," + (zf * 0.95 * fade).toFixed(3) + ")";
          ctx.beginPath(); ctx.arc(Ap.X + (Bp.X - Ap.X) * q.t, Ap.Y + (Bp.Y - Ap.Y) * q.t, 1 + zf * 1.4, 0, 6.283); ctx.fill();
        }
        for (let i = 0; i < SV.length; i++) {
          const Ap = P[base + i], zf = (Ap.z + 1) / 2, ph = ((now / 1000 + i * 0.31) % 1.8) / 1.8;
          const gr = ctx.createRadialGradient(Ap.X, Ap.Y, 0, Ap.X, Ap.Y, 22 * zf + 6);
          gr.addColorStop(0, "rgba(255,236,170," + ((0.4 + zf * 0.6) * fade).toFixed(3) + ")"); gr.addColorStop(1, "rgba(212,166,55,0)");
          ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(Ap.X, Ap.Y, 22 * zf + 6, 0, 6.283); ctx.fill();
          ctx.fillStyle = "rgba(255,244,210," + ((0.3 + zf * 0.7) * fade).toFixed(3) + ")"; ctx.beginPath(); ctx.arc(Ap.X, Ap.Y, 2.5 + zf * 3, 0, 6.283); ctx.fill();
          if (zf > 0.45 && !reduce) { ctx.strokeStyle = "rgba(212,166,55," + ((1 - ph) * 0.6 * zf * fade).toFixed(3) + ")"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(Ap.X, Ap.Y, 8 + ph * 30, 0, 6.283); ctx.stroke(); }
        }
        ctx.globalCompositeOperation = "source-over";
        const kept = [];
        hn.map((el) => ({ el, i: +el.getAttribute("data-i") })).sort((a, b) => (a.i === S.hover ? -1 : b.i === S.hover ? 1 : P[base + b.i].z - P[base + a.i].z)).forEach(({ el, i }) => {
          const Ap = P[base + i]; if (!Ap || Ap.X == null) return;
          const zf = (Ap.z + 1) / 2, front = Ap.z > -0.05, on = mode === "home" && W >= 760;
          place(el, Ap.X, Ap.Y, on ? (front ? Math.min(1, 0.25 + zf * 0.9) * fade : 0) : 0, on && front);
          const tag = el.querySelector('[data-c3="tag"]'), ld = el.querySelector('[data-c3="leader"]');
          if (!tag) return;
          const tw = tag.__w || 200, th = tag.offsetHeight || 44, flip = tag.style.left === "auto";
          const rx0 = flip ? Ap.X - 26 - tw : Ap.X + 26, ry0 = Ap.Y - 58;
          const hit = kept.some((k) => rx0 < k.x + k.w + 6 && rx0 + tw + 6 > k.x && ry0 < k.y + k.h + 4 && ry0 + th + 4 > k.y);
          const show = front && !hit;
          tag.style.opacity = show ? "1" : "0"; if (ld) ld.style.opacity = show ? "1" : "0";
          if (show) kept.push({ x: rx0, y: ry0, w: tw, h: th });
        });
      }
      const hud = this.q('[data-c3="hud"]');
      if (hud) hud.textContent = (mode === "inside" ? "INSIDE D’MATEK CLOUD" : mode === "warp" ? "TRAVELLING " + (wp * 100).toFixed(0) + "%" : "SECTOR " + String(Math.abs(Math.round(S.ry * 57.3)) % 360).padStart(3, "0")) + " · ROT " + S.rx.toFixed(2) + " / " + (S.ry % 6.283).toFixed(2) + " · " + all.length + " NODES";
      const eq = this.q('[data-c3="eq"]'); if (eq && A.on) Array.from(eq.children).forEach((b, i) => { b.style.height = (30 + Math.abs(Math.sin(now / (180 + i * 70))) * 70).toFixed(0) + "%"; });
      if (now - lastMs > 1100) { lastMs = now; this.qa('[data-c3="ms"]').forEach((el) => { const b = +el.getAttribute("data-base") || 20; el.textContent = String(Math.max(1, Math.round(b + (Math.random() - 0.5) * b * 0.35))); }); }
    };
    let raf = 0;
    // Pause the sphere while it is scrolled out of view (the inside view keeps its own loop).
    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      if (S.mode === "inside") { const hud = this.q('[data-c3="hud"]'); if (hud) hud.textContent = "INSIDE D’MATEK CLOUD · " + SV[S.svc]?.code; return; }
      if (!visible) return;
      try { frame(now); } catch {}
    };
    const kick = () => { resize(); try { frame(performance.now()); } catch {} };
    const k1 = setTimeout(kick, 0), k2 = setTimeout(kick, 300);
    let ro = null; if ("ResizeObserver" in window) { ro = new ResizeObserver(kick); ro.observe(cv); }
    let io = null; if ("IntersectionObserver" in window) { io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }); io.observe(cv); }
    raf = requestAnimationFrame(loop);
    const timers = [];
    this._drill3 = () => this.drill(timers, "c3", "#56646A", "#3DFFA8", "#030405", A);
    this._stop3 = () => { cancelAnimationFrame(raf); clearTimeout(k1); clearTimeout(k2); if (ro) ro.disconnect(); if (io) io.disconnect(); cv.removeEventListener("pointerdown", onDown); window.removeEventListener("pointermove", onMoveP); window.removeEventListener("pointerup", onUp); window.removeEventListener("keydown", onKey); timers.forEach((t) => { clearTimeout(t); clearInterval(t); }); if (A.ctx) try { A.ctx.close(); } catch {} this._stop3 = null; };
  }
  bkStart() {
    clearInterval(this._bkt);
    this.setState({ bk: 2, bkp: 0 });
    this._bkt = setInterval(() => { const p = this.state.bkp + 4; if (p >= 100) { clearInterval(this._bkt); this.setState({ bk: 3, bkp: 100 }); } else this.setState({ bkp: p }); }, 70);
  }
  send = (e) => {
    e.preventDefault();
    const note = String(new FormData(e.currentTarget).get("note") ?? "").trim();
    this.props.router.push(enquiryHref({ message: note ? `Cloud review. What we run today: ${note}` : "I’d like a free review of our email, hosting or backup.", source: "cloud_review" }));
  };
  backHomeQuiet() { const S = this.S; if (!S) return; S.mode = "home"; S.svc = -1; S.busy = false; this.setState({ mode: "home", svc: -1, panel: null }); }

  renderVals() {
    const s = this.state, S = () => this.S;
    const linksOf = (i) => SVL.filter((l) => l.includes(i)).map((l) => (l[0] === i ? l[1] : l[0]));
    const nodes = SV.map((n, i) => {
      const v = vec(n.ll);
      return {
        i, pulseO: i === 0 ? 1 : 0, code: n.code, num: String(i + 1).padStart(2, "0"), title: n.title,
        left: (60 + v[0] * 22).toFixed(1) + "%", top: (50 + v[1] * 30).toFixed(1) + "%",
        open: (e) => { e?.stopPropagation?.(); this.enterSvc(i, e); },
        openMobile: (e) => this.openPanel({ kind: "service", svc: i }, e),
        hover: () => { const x = S(); if (x) { x.hover = i; if (x.A) x.A.blip(1200, 0.05, 0.02); } },
        unhover: () => { const x = S(); if (x) x.hover = -1; },
      };
    });
    const sv = s.svc >= 0 ? SV[s.svc] : null;
    const pn = s.panel, ps = pn ? SV[pn.svc] : null;
    let p = { path: "", title: "", line: "", gets: [], cases: [] };
    if (pn && ps) {
      const base = { path: "D’MATEK CLOUD / " + ps.code + " / " + (pn.code || (pn.kind === "service" ? "OVERVIEW" : "CONTACT")), hasProblem: false, hasGets: false, gets: [], isStatus: false, isDomain: false, isDrill: false, isContact: false, showCta: true };
      if (pn.kind === "service") p = { ...base, title: ps.title, line: ps.line, hasProblem: !!ps.problem, problem: ps.problem || "", hasGets: !!ps.gets, gets: (ps.gets || []).map((t, k) => ({ t, code: "INCLUDED 0" + (k + 1) })), isStatus: !!ps.status, isDomain: !!ps.domain, isDrill: !!ps.drill, isContact: !!ps.contact, showCta: !ps.contact };
      else if (pn.kind === "contact") p = { ...base, title: ps.contact ? "Talk to us" : "Talk to an engineer about " + ps.title.toLowerCase(), line: "Tell us what you use today. We’ll book a free review with an engineer.", isContact: true, showCta: false };
    }
    // Example names only: no live registry lookup is connected, so the demo
    // never claims a real name is free or taken.
    const b = (s.checked || "").toLowerCase().replace(/[^a-z0-9-]/g, "");
    const results = b ? [".com.ng", ".ng", ".com", ".africa"].map((t) => ({ name: b + t, label: "ASK US", ink: "#A9BBB3" })) : [];
    const f2 = s.focus, F = f2 >= 0 ? N2[f2] : null, lk = (i) => LINKS.filter((l) => l.includes(i)).map((l) => (l[0] === i ? l[1] : l[0]));
    const vnodes = N2.map((n, i) => ({ i, grp: n.g, alt: !!n.alt, pulseO: i === 0 ? 1 : 0, code: n.code, title: n.title, left: (50 + n.pos[0] * 30).toFixed(1) + "%", top: (50 + n.pos[1] * 34).toFixed(1) + "%", core: n.alt ? "#F5F1E8" : n.st === "Future" ? "#8C9A9E" : n.st === "In Development" ? "#F2C879" : "#D4A637", halo: n.alt ? "rgba(245,241,232,.14)" : n.st === "Future" ? "rgba(140,154,158,.14)" : "rgba(212,166,55,.16)", glow: n.alt ? "rgba(245,241,232,.45)" : n.st === "Future" ? "rgba(140,154,158,.4)" : "rgba(212,166,55,.6)", codeInk: n.alt ? "#F5F1E8" : n.st === "Future" ? "#8C9A9E" : n.st === "In Development" ? "#F2C879" : "#D4A637", line: i === f2 ? "#D4A637" : "rgba(40,112,90,.7)", open: () => this.go2(i), hover: () => { if (this.S2) this.S2.hover = i; }, unhover: () => { if (this.S2) this.S2.hover = -1; } })).filter((v) => v.grp === s.svc || v.alt);
    const vnode = F ? { n: String(f2 + 1).padStart(2, "0"), code: F.code, title: F.full || F.title, tag: F.tag || "", hasTag: !!F.tag, line: F.line, short: F.short, hasProblem: !!F.problem, problem: F.problem || "", hasGets: !!(F.gets && F.gets.length), gets: F.gets || [], isDomain: !!F.domain, isBackup: !!F.backup, isStatus: !!F.status, isContact: !!F.contact, showCta: !F.contact, links: lk(f2).map((j) => ({ title: N2[j].title, go: () => this.go2(j) })) } : { links: [], gets: [] };
    // The list view shows each node's description (`line` is its border colour).
    vnodes.forEach((v) => { v.desc = N2[v.i].line; });
    return {
      foundryUrl: D_FOUNDRY_URL,
      vnodes, vnode, vopen: f2 >= 0, vintroO: f2 >= 0 || s.list ? 0 : 1, vclose: () => this.shut2(), vopenContact: () => this.go2(N2.length - 1), listOpen: s.list, listLabel: s.list ? "CLOSE LIST ×" : "LIST VIEW", toggleList: () => this.setState((st) => ({ list: !st.list })),
      nodes,
      showHome: s.mode !== "inside", homeO: s.mode === "home" ? 1 : 0,
      showInside: s.mode === "inside",
      narrow: s.narrow && s.mode === "home",
      svc: sv ? { num: String(s.svc + 1).padStart(2, "0"), code: sv.code, title: sv.title, line: sv.line, links: linksOf(s.svc).map((j) => ({ code: SV[j].code, title: SV[j].title, go: () => { this.backHomeQuiet(); setTimeout(() => this.enterSvc(j), 60); } })) } : { links: [] },
      back: (e) => { if (e && e.preventDefault) e.preventDefault(); if (s.mode === "inside") this.backHome(); },
      heroDisp: s.narrow ? "none" : "block",
      bkFiles: [["Payroll 2026.xlsx", "48 KB"], ["Client contracts.pdf", "2.1 MB"], ["Sales report.docx", "312 KB"], ["Staff list.csv", "9 KB"]].map(([name, size], i) => { const gone = i === 0 && s.bk === 1; const back = i === 0 && s.bk === 3; return { name, note: gone ? "DELETED" : back ? "RESTORED AND CHECKED" : i === 0 && s.bk === 2 ? "RESTORING…" : size, op: gone ? 0.35 : 1, dec: gone ? "line-through" : "none", dot: gone ? "#B3261E" : back ? "#1D8C61" : "#28705A", bg: back ? "rgba(29,140,97,0.14)" : gone ? "rgba(179,38,30,0.08)" : "transparent" }; }),
      bkStat: s.bk === 1 ? "FILE MISSING" : s.bk === 2 ? "RESTORING" : "ALL FILES PRESENT", bkStatCol: s.bk === 1 ? "#B3261E" : "#1D8C61",
      bkShowPts: s.bk === 1, bkShowBar: s.bk === 2, bkPct: s.bkp, bkBarLabel: "RESTORING FROM LAST NIGHT’S BACKUP, THEN CHECKING IT…",
      bkPts: [["Last night, 02:00", "VERIFIED"], ["Two nights ago, 02:00", "VERIFIED"], ["Last week, Sunday 02:00", "VERIFIED"]].map(([label, tag], i) => ({ label, tag, edge: i === 0 ? "#D4A637" : "rgba(245,241,232,0.2)", pick: () => this.bkStart() })),
      bkLabel: s.bk === 0 ? "Delete the payroll file" : s.bk === 1 ? "Choose a restore point below" : s.bk === 2 ? "Restoring…" : "Done",
      bkAction: () => { if (this.state.bk === 0) this.setState({ bk: 1 }); },
      bkCanReset: s.bk === 3, bkReset: () => { clearInterval(this._bkt); this.setState({ bk: 0, bkp: 0 }); },
      bkMsg: s.bk === 0 ? "Someone deletes the payroll file by mistake. It happens in every business. Press the button to see what happens next." : s.bk === 1 ? "The file is gone. Pick a restore point. Every one of them has been tested." : s.bk === 2 ? "The backup is being restored, then checked against the original." : "Back, and checked. We test restores before you ever need one, so you know the backup works.",
      hint: s.mode === "inside" ? "" : "DRAG TO TURN · CLICK A LIGHT TO ENTER",
      panelOpen: !!pn, p, closePanel: () => this.closePanel(),
      openContact: (e) => this.openPanel({ kind: "contact", svc: s.svc >= 0 && !SV[s.svc].contact ? s.svc : pn?.svc ?? 8 }, e),
      soundLabel: s.sound ? "SOUND ON" : "SOUND OFF", soundInk: s.sound ? "#3DFFA8" : "#8C9A9E", soundEdge: s.sound ? "rgba(61,255,168,.6)" : "rgba(140,154,158,.35)",
      toggleSound: () => { const x = S(); if (!x || !x.A) return; if (s.sound) x.A.stop(); else x.A.start(); this.setState({ sound: !s.sound }); },
      domain: s.domain, onDomain: (e) => this.setState({ domain: e.target.value }),
      onDomainKey: (e) => { if (e.key === "Enter") this.setState((st) => ({ checked: st.domain })); },
      checkDomain: () => this.setState((st) => ({ checked: st.domain || "yourbusiness" })),
      results, hasResults: results.length > 0,
      drill: DRILL, runDrill: () => { if (this.state.mode === "inside") this._drill2?.(); else this._drill3?.(); },
      status: [{ name: "Web hosting", base: 18 }, { name: "Email", base: 24 }, { name: "DNS", base: 6 }, { name: "Backups", base: 41 }],
      send: this.send,
    };
  }

  render() {
    return (
      <div className={`cl-root ${jbm.variable}`} data-lite={this.state.lite ? "1" : undefined} ref={(el) => { this.root = el; }} style={{ background: "#031A15", color: "#F5F1E8", fontFamily: "var(--font-manrope),'Manrope',system-ui,sans-serif" }}>
        <Markup v={this.renderVals()} />
      </div>
    );
  }
}

export default function CloudClient() {
  const router = useRouter();
  return <Cloud router={router} />;
}
