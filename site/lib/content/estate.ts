// Connected Estate: Internet-Ready Homes, from one home to a whole estate.
// Source: D'Matek Portfolio, "Internet-Ready Homes" (customer-facing).
// The separate internet-infrastructure business concept is an internal
// proposal; its projections (uptime, speeds, conversion rates, market size,
// supplier names, warranty periods) are NOT published here.

export const IRH_PATH = "/infrastructure/internet-ready-homes";

export const irh = {
  name: "Internet-Ready Homes",
  tag: "Network pre-wiring for residential developments",
  concept:
    "Internet connectivity is now as essential to a home as electricity. Just as every modern building is wired for power during construction, D’Matek installs professional network cabling at the same stage, so homes are ready for how people live today: streaming, remote work, smart devices and reliable whole-home Wi-Fi.",
  problems: [
    "Single Wi-Fi routers cannot cover larger homes, leaving dead zones in bedrooms and upper floors.",
    "Wi-Fi extenders are unreliable and cut connection speeds significantly.",
    "Running cables after a building is finished means cutting into finished walls: expensive, messy and disruptive.",
    "Unlike commercial buildings, residential developments rarely plan for structured network cabling.",
    "Homeowners are left to find their own inadequate, unattractive fixes after moving in.",
  ],
  install: [
    "Professional Cat6 / Cat6a structured cabling throughout the home",
    "Dedicated network (LAN) ports in bedrooms, living areas, kitchen and study",
    "A central network cabinet for clean, organised cable management",
    "Full testing and certification of every cable run",
    "Infrastructure that supports gigabit speeds today and higher speeds for years to come",
  ],
  installNote:
    "Smaller homes may only need a single well-placed access point. Larger homes benefit most, which is exactly where extenders struggle and where pre-installed wiring makes the biggest difference.",
  processIntro:
    "The process fits into the construction schedule, running alongside electrical work rather than after it, so it adds no delay to project completion.",
  stages: [
    { n: "Planning", when: "Pre-construction", what: "Review architectural drawings, design the network layout, and mark cable routes and port locations room by room." },
    { n: "Rough-in", when: "Wall framing, alongside electrical", what: "Install conduits and cable trays before plastering begins, timed with the electrical rough-in." },
    { n: "Cable pull", when: "After plastering, before painting", what: "Pull cables through the conduits and install wall boxes at each network point." },
    { n: "Termination", when: "Finishing stage", what: "Fit wall plates, terminate all cables in the central cabinet, and organise with a professional patch panel." },
    { n: "Testing and handover", when: "Pre-handover", what: "Certify every cable run, document the full system, and hand over a ready-to-use network. The homeowner simply plugs in a router." },
  ],
  duration: "Typical duration: 2–3 days per unit during rough-in, plus 1 day for termination and testing after painting.",
  why: [
    {
      h: "Marketing and sales advantage",
      pts: [
        "Market units as “Internet-Ready Homes”, a tangible, modern differentiator in a crowded property market.",
        "Appeal directly to remote workers, young professionals and tech-conscious families.",
        "Give sales teams a concrete feature to show, not just describe.",
        "Reduce post-handover complaints about connectivity and Wi-Fi coverage.",
      ],
    },
    {
      h: "Practical and timing advantages",
      pts: [
        "Installed with minimal disruption, during a phase when the site is already open for wiring work.",
        "No re-entry into finished units and no cutting into completed walls.",
        "A standardised approach across every unit in the development, for consistent quality.",
        "One point of contact for the whole development’s network infrastructure, from first unit to last.",
      ],
    },
    {
      h: "A long-term infrastructure partner",
      pts: [
        "We work directly with project managers and architects to fit into existing construction workflows.",
        "A volume-friendly approach for multi-unit developments, from small blocks to large estates.",
        "The same approach scales from a single home to a whole estate network, with us staying on to manage it if you want.",
        "A single infrastructure partner for this project and the projects that follow.",
      ],
    },
  ],
};

/** One product at different scales: the same approach from a single home to
 * a whole estate. What D'Matek does after deployment is set by the contract. */
export const irhScale = {
  h: "From one home to a whole estate",
  intro:
    "Think of it as structured cabling, from a single home up to a whole estate. The estate version is the same idea, only bigger and more involved, with more to plan and more ways to work together. What happens after deployment depends on what the developer or estate agrees with us.",
  levels: [
    { n: "In the home", t: "Structured cabling to every room that needs a port, finished at a central cabinet." },
    { n: "Across the estate", t: "Structured cabling for the whole estate: the network that carries internet from a central point to every home, planned before roads and finishes go in." },
  ],
  models: [
    { h: "Deploy and hand over", t: "We design and build it, test it, document it and hand it over to the developer or estate management." },
    { h: "Deploy and stay on", t: "We stay on to manage the network after handover, as an add-on to the estate." },
    { h: "Deploy for a telco", t: "We build the estate network for a telecoms operator that wants to serve the estate, including areas where fibre has not arrived yet." },
  ],
  who: [
    { h: "Developers", t: "A tangible feature to sell, and no cutting into finished walls later." },
    { h: "Telecoms operators", t: "A way to serve estates and areas they may not cover yet." },
    { h: "Homeowners", t: "A connected home from day one, including where fibre has not reached." },
  ],
};
