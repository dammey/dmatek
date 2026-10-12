/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
"use client";
// A port of the design's logic class (DMatek IleMesh.dc.html). The contact
// form posts to the shared enquiry backend (/api/contact) instead of the
// prototype's simulated send.

import React from "react";
import Markup from "./IleMeshMarkup";
import { track } from "@/lib/analytics";
import { isLite } from "@/lib/lite";
import { postEnquiry } from "@/lib/postEnquiry";
import "./ilemesh.css";

// The design's data points at "cover-bN"; the list rows are "ile-bN".
const fix = (id) => id.replace("cover-", "ile-");
const ZONES = [{"title":"Gate and perimeter","x":225,"y":418,"id":"cover-b1","desc":"Cameras, recorders and storage planned and installed to cover your site.","items":["Security cameras for your property","Network cameras with clear pictures","Recorders that store your camera footage","Storage for your camera recordings"]},{"title":"Doors and entry","x":400,"y":458,"id":"cover-b4","desc":"Control who comes in with cards, smart locks, intercoms and visitor records.","items":["Controlling who can open which doors","Key cards and tags for doors and rooms","Electronic door locks","See and speak to visitors at the gate"]},{"title":"Counting and spotting","x":515,"y":408,"id":"cover-b3","desc":"Cameras that count people, measure queues, map busy areas and read number plates.","items":["Cameras that spot events automatically","Counting people coming in and out","Knowing how full a space is","Seeing where people spend time"]},{"title":"Control room","x":640,"y":440,"id":"cover-b2","desc":"Control room viewing, plus regular checks and repairs for your security systems.","items":["Viewing your cameras from a control room","Keeping your cameras working","Watching over your site's security systems","Servicing your alarms, cameras and access systems"]},{"title":"Meeting rooms","x":785,"y":440,"id":"cover-b7","desc":"Screens, video call kit and smart boards ready for meetings and teaching.","items":["Meeting rooms ready to present and call","Video call equipment for meeting rooms","Touchscreen boards for classrooms and meetings"]},{"title":"Hotel rooms","x":560,"y":240,"id":"cover-b6","desc":"Rooms, TV, lifts and room power planned together for hotels.","items":["Technology planning for hotels","Rooms that adjust lights and AC for guests","Room power that switches off when guests leave","TV channels delivered over your network"]},{"title":"Sensors and building systems","x":855,"y":235,"id":"cover-b5","desc":"Sensors and controls that run and watch your building or home.","items":["Building systems that run on schedules","Connected sensors and devices for your site","Sensors for temperature, movement and room use","Your building's systems watched in one place"]},{"title":"Screens and sound","x":888,"y":312,"id":"cover-b8","desc":"Digital screens and speakers for notices, menus, announcements and music.","items":["Screens showing your notices and menus","Announcements and background music"]},{"title":"Power plant","x":1000,"y":452,"id":"cover-b9","desc":"Backup power designed from a measurement of what you use.","items":["Finding out what is using your power","Solar panels for your building","Inverters and batteries for power cuts","Planning backup power for key systems"]}].map((z) => ({ ...z, id: fix(z.id) }));
const PLACES = [{"name":"Hotel","line":"Rooms, TV, lifts and room power planned together, with cameras, door control and backup power.","links":[{"id":"cover-b6","label":"Hotel and room technology"},{"id":"cover-b4","label":"Doors, keys and visitors"},{"id":"cover-b1","label":"CCTV cameras and recording"},{"id":"cover-b9","label":"Solar, inverters and backup power"}]},{"name":"Estate","line":"Gates, visitor records, cameras and power that holds when the grid drops.","links":[{"id":"cover-b4","label":"Doors, keys and visitors"},{"id":"cover-b1","label":"CCTV cameras and recording"},{"id":"cover-b9","label":"Solar, inverters and backup power"},{"id":"cover-b5","label":"Smart buildings, homes and sensors"}]},{"name":"School","line":"Smart boards and sound for classrooms, with controlled entry and cameras.","links":[{"id":"cover-b7","label":"Meeting rooms and classrooms"},{"id":"cover-b4","label":"Doors, keys and visitors"},{"id":"cover-b1","label":"CCTV cameras and recording"},{"id":"cover-b8","label":"Screens and sound"}]},{"name":"Place of worship","line":"Sound, screens and cameras for services and events, with backup power.","links":[{"id":"cover-b8","label":"Screens and sound"},{"id":"cover-b1","label":"CCTV cameras and recording"},{"id":"cover-b9","label":"Solar, inverters and backup power"}]},{"name":"Office","line":"Meeting rooms that work, controlled entry and sensors that watch the building.","links":[{"id":"cover-b7","label":"Meeting rooms and classrooms"},{"id":"cover-b4","label":"Doors, keys and visitors"},{"id":"cover-b5","label":"Smart buildings, homes and sensors"},{"id":"cover-b1","label":"CCTV cameras and recording"}]}].map((p) => ({ ...p, links: p.links.map((l) => ({ ...l, id: fix(l.id) })) }));
const SYS = [["Security cameras", true], ["Door access", true], ["Network and Wi-Fi", true], ["Emergency lighting", true], ["Air conditioning", false], ["Lifts and general sockets", false]];

export default class IleMeshClient extends React.Component {
  state = { night: false, tour: true, zone: 0, place: 0, grid: true, backup: false, name: "", contact: "", where: "", need: "", status: "idle", tried: false, ref: "" };

  componentDidMount() {
    // Reduced motion / lite: no autoplaying tour (README motion rules).
    if (isLite()) this.setState({ tour: false });
    this._tour = setInterval(() => { if (this.state.tour && !document.hidden) this.setState((st) => ({ zone: (st.zone + 1) % 9 })); }, 5200);
    this._click = (e) => {
      const a = e.target.closest && e.target.closest("a[data-open]");
      if (!a) return;
      const d = document.getElementById(a.getAttribute("data-open"));
      if (d) d.open = true;
    };
    this.root.addEventListener("click", this._click);
  }
  componentWillUnmount() {
    clearInterval(this._tour);
    this.root?.removeEventListener("click", this._click);
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
      const ref = await postEnquiry({ name: s.name, contact: s.contact, location: s.where, message: s.need, problem: "IléMesh", source: "ilemesh_contact" });
      this.setState({ status: "sent", ref });
    } catch {
      this.setState({ status: "error" });
    }
  };
  onStart = () => {
    if (this._started) return;
    this._started = true;
    track("form_start", { form: "ilemesh", source: "ilemesh_contact" });
  };

  renderVals() {
    const s = this.state, eN = s.tried && !s.name.trim(), eC = s.tried && !s.contact.trim(), ok = "rgba(245,241,232,0.18)", bad = "#F2C879";
    const z = ZONES[s.zone], pl = PLACES[s.place];
    const field = (k) => (e) => { this.onStart(); this.setState({ [k]: e.target.value }); };
    return {
      zones: ZONES.map((q, i) => { const on = i === s.zone; return { n: i + 1, x: q.x, y: q.y, label: `Point ${i + 1}: ${q.title}`, fill: on ? "#D4A637" : "#F5F1E8", ink: "#06382E", pick: () => { if (this.state.zone !== i || this.state.tour) this.setState({ zone: i, tour: false }); } }; }),
      skyBg: s.night ? "radial-gradient(120% 100% at 20% 0%,#052A22,#031A15 60%,#021410)" : "radial-gradient(120% 100% at 20% 0%,#0B4B3D,#06382E 55%,#042A22)",
      nightO: s.night ? 1 : 0, dimO: s.night ? 0.5 : 0,
      nightLabel: s.night ? "Day view" : "Night view", toggleNight: () => this.setState((st) => ({ night: !st.night })),
      tourLabel: s.tour ? "Pause tour" : "Play tour", toggleTour: () => this.setState((st) => ({ tour: !st.tour })),
      zone: { n: s.zone + 1, title: z.title, desc: z.desc, items: z.items, id: z.id },
      places: PLACES.map((q, i) => ({ name: q.name, on: i === s.place, bg: i === s.place ? "#06382E" : "transparent", ink: i === s.place ? "#F5F1E8" : "#06382E", pick: () => this.setState({ place: i }) })),
      place: pl,
      systems: SYS.map(([name, crit]) => { const on = s.grid || (s.backup && crit); const st = s.grid ? "ON · GRID POWER" : s.backup ? (crit ? "ON · BACKUP POWER" : "OFF · SHED TO SAVE POWER") : "OFF"; return { name, status: st, dot: on ? "#3DFFA8" : "#FF6B5B", edge: on ? "#28705A" : "rgba(255,107,91,0.45)", bg: on ? "rgba(61,255,168,0.06)" : "rgba(255,107,91,0.06)" }; }),
      gridLabel: s.grid ? "Cut the grid" : "Restore the grid", toggleGrid: () => this.setState((st) => ({ grid: !st.grid })),
      backupLabel: s.backup ? "Backup power: designed" : "Backup power: none", backup: s.backup, toggleBackup: () => this.setState((st) => ({ backup: !st.backup })),
      bkInk: s.backup ? "#06382E" : "#D4A637", bkBg: s.backup ? "#D4A637" : "transparent",
      gridMsg: s.grid ? "The grid is on and everything runs. Cut it, then switch on backup power to see the difference a design makes." : s.backup ? "Backup power carries what has to stay on. The rest is shed to save power. Which systems get backup is decided at the survey." : "With no backup, everything stops. Switch on backup power to see the difference.",
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
      <div className="ile-root" ref={(el) => { this.root = el; }} style={{ fontFamily: "var(--font-manrope),'Manrope',system-ui,sans-serif", color: "#1A1A1A" }}>
        <Markup v={this.renderVals()} />
      </div>
    );
  }
}
