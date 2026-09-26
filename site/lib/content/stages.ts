// "How we work" six stages — Home's stage picker and About's #how section.
// Copy verbatim from Dmatek Website v3.4.dc.html (const stageData).

export type Stage = {
  id: string;
  num: string;
  name: string;
  body: string;
  value: string;
  photo: string;
  outcome: string;
  /** Optional per v3.4 photography — omit until a rights-cleared photo exists; falls back to the bracketed placeholder. */
  img?: string;
};

export const stages: Stage[] = [
  {
    id: "discover",
    num: "01",
    name: "Discover",
    body: "We start with what you’re trying to achieve, not with a box, a licence or a brand.",
    value: "TRUST",
    photo: "a first conversation on site",
    outcome: "What matters, named.",
  },
  {
    id: "understand",
    num: "02",
    name: "Understand",
    body: "We look at how the site, the people and the systems work today, and what has already been tried.",
    value: "LISTEN",
    photo: "a walk-through with notebooks out",
    img: "/assets/stage-understand.jpg",
    outcome: "The real problem, understood.",
  },
  {
    id: "solve",
    num: "03",
    name: "Solve",
    body: "We simplify it, then design the right answer, with options and trade-offs in plain language so the decision is yours.",
    value: "SIMPLIFY",
    photo: "drawings, floor plans, a whiteboard",
    img: "/assets/stage-design.jpg",
    outcome: "Simpler, and solved properly.",
  },
  {
    id: "deliver",
    num: "04",
    name: "Deliver",
    body: "We build, install and integrate across whichever specialists the job needs, then hand over with everything documented.",
    value: "SOLVE",
    photo: "work in progress on site",
    img: "/assets/stage-implement.jpg",
    outcome: "One team on site.",
  },
  {
    id: "support",
    num: "05",
    name: "Support",
    body: "We don’t disappear when installation is finished. Support, management and someone who knows your setup.",
    value: "WE STAY",
    photo: "a support visit",
    img: "/assets/stage-operate.jpg",
    outcome: "Someone accountable after handover.",
  },
  {
    id: "improve",
    num: "06",
    name: "Improve",
    body: "Needs change and businesses grow. We revisit what we built and make it better.",
    value: "IMPROVE",
    photo: "a review session with a client",
    img: "/assets/stage-optimise.jpg",
    outcome: "Better as you grow.",
  },
];

// Same six stages, shown as a compact process strip on the Businesses page.
export const pathSteps = stages.map((s, i) => ({
  step: "STEP " + String(i + 1).padStart(2, "0"),
  n: String(i + 1).padStart(2, "0"),
  name: s.name,
}));
