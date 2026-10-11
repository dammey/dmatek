# D'Matek — every update to build (latest versions)
11 October 2026 · Read with `README.md` and `CLAUDE_CODE_PROMPT.txt`

The files in this folder are the **latest working versions**, and they include every change below. If the repository was built from an earlier handoff (D'Foundry only, or main site v3–v3.5), use this list to update it to the designs here.

| Site | Latest file | Replaces |
|---|---|---|
| Main site, dmatek.ng | `Dmatek Website v3.6.dc.html` | v3, v3.1–v3.5 |
| dmatek.ng/infrastructure | `DMatek Infrastructure Hero shared.dc.html` | Infrastructure Hero |
| dmatek.ng/cloud | `DMatek Cloud Home v3.1 shared.dc.html` | Cloud Home v1–v3.1 |
| dmatek.ng/ilemesh | `DMatek IleMesh.dc.html` | **new build** |
| dmatek.ng/assurance | `DMatek Assurance.dc.html` | **new build** |
| source.dmatek.ng | `DSource v11.1.dc.html` | DSource v5–v11 |
| foundry.dmatek.ng | `DFoundry Hero v2.dc.html` + `Droplet Case Study.dc.html` | DFoundry Hero, Home |

---

## 1. Main site (`Dmatek Website v3.6`)

**Structure and navigation**
- The Businesses page is now called **Services**.
- Nav links go to the real pages: `/infrastructure`, `/cloud`, `/ilemesh` and `/assurance` on the main site, D'Source and D'Foundry on their subdomains.
- Insights is hidden from the nav and footer.
- The shared header and footer, the WhatsApp button (07058071768) and the email hello@dmatek.ng are used everywhere.

**Home page**
- **Hero:** "Solving what matters." stays as the headline. The new subline is "One technology partner. The right specialists. One team accountable for the result."
- **CTAs:** "Tell us what you need →" is the primary and "Explore solutions →" the secondary.
- **New: situation finder,** "What are you trying to achieve?", in three steps:
  1. Six photo tiles plus four pills.
  2. An overview of the situation, with an "Depends on an assessment" note.
  3. A checklist of needs.
  - It then opens the enquiry with the environment and needs already filled in.
  - It mentions no internal business names.
- **"Technology is rarely one problem"** moved from the home page to About.
- **Hotel section:** now six of six specialists. The counters show their final values first.
- **New: "Six specialists. Try one."** tiles linking to each business's demo.
- **Proof:** the placeholder cards are hidden. A "Case studies are coming soon" line shows until a case is approved.
- **Motion is calmer:** the orbit is the main moving piece, the hero line draws in once and then stays still, the marquee is slowed to 70s, and only one shape drifts.
- **Side line:** it sits further from the text, and its nodes centre on each section label.

**Services**
- **Order:** the hero ("One partner. The specialists your problem requires." with three paragraphs), then the relationship diagram, then How every project runs.
- **Diagram:**
  - six tiles, each with an icon and a verb label
  - clicking a tile expands it into a full profile: role, typical problems, how it works with the others, what's available now, and next step
  - a round "−" close button shrinks it back into its tile
  - the tiles fly in when you arrive on the page

**Solutions**
- **Heading:** "Find the right solution."
- **Order:** "Start with where you work" first, then "Or start with what you need".
- **Environments:** only the four ready ones show: Hospitality, Education, Real Estate and Enterprise. The others are hidden.
- **Pilot labels:** removed.

**Environment pages**
- **New template:** customer's world, then 5 problems, then 6 solutions, then 5 delivery steps, then the next step.
- **Hospitality:** client-supplied copy.
- **Education, Real Estate and Enterprise:** draft copy, awaiting sign-off.
- **Removed:** the duplicate "How it works" row.
- **Opening effect:** the hero photo slowly zooms in on arrival.

**Work**
- The placeholder cases are replaced with a "Coming soon" panel showing the five-part case format and a "Discuss a similar project" button.
- Cases publish when set to `approved: true`.

**About:** gained "Technology is rarely one problem" and "We connect, build, equip, host, secure and run your technology."

**Contact and enquiry:** one shared form behind every enquiry button.
- **Fields:** name, organisation, phone or WhatsApp, email, environment, what you need, message, location.
- **States:** a success state with a reference number, and a failure state that keeps the input.

**Copy fixes**
- "One Contact, Many Solutions."
- The Infrastructure and Cloud lines were rewritten.
- "Get connected today" and "Get started now".
- "Devices affect".
- The repeated "One customer, six specialists" is removed.

**Polish**
- Eyebrow labels never wrap.
- Rings sit top-right on every page.
- Step grids are even: 6, 3 or 2 columns depending on width.
- Each page has one opening effect, which plays once.

## 2. Infrastructure (`/infrastructure`)
- **Rearranged:** the long list no longer comes straight after the tangle hero. The order is now the tangle hero, intro, diagram, coverage plan, failover demo, full list, projects, gold band, good to know, next steps and contact.
- **Hero:** the tangle moved down so the "% connected" counter isn't hidden under the header.
- **Diagram:** it draws itself and has Design, Build and Operate labels.
- **Coverage plan, rebuilt:**
  - draggable access points with +/− buttons
  - walls weaken the signal
  - a legend with swatches
  - a smooth signal map
  - marked "Illustration only"
- **Failover demo:** a larger red cut mark, and the backup line lights up.
- **Lists:** expandable, with + when closed and − when open.
- **Shared parts:** the main site's header, footer and WhatsApp button.

## 3. Cloud (`/cloud`)
- **Lives at `/cloud`** on the main site, on the same instance.
- **Sphere, rebuilt around the catalogue:**
  - eight groups: Domains, DNS & SSL; Websites & Hosting; Servers & Virtualisation; Cloud Infrastructure; Storage & Directory; Email & Productivity; Backup; Recovery & Continuity
  - clicking a group flies you into its cluster
  - clicking a service opens its detail panel
- **47 services,** with the catalogue's original names.
- **In-development services:** pale gold, labelled "DEV", with an "IN DEVELOPMENT" chip in the panel.
- **Planned services:** grey, labelled "PLANNED".
- **The animated D is back,** with the faint background words.
- **Removed:** "02 / RUN IT".
- **Kept:** the sector HUD at the bottom-left, and the sound toggle at the top-right.
- **New: "Lose a file. Get it back."** restore demo.
- **Full list:** collapsed under "Browse everything as a list".
- **Removed from the 3D scene:** the "Recent work" light, pending client permission.
- **Shared parts:** header, footer and WhatsApp button.

## 4. IléMesh (`/ilemesh`): new build
- **Lives at `/ilemesh`** on the main site.
- **One-stage hero:** a hotel and estate cutaway with nine numbered points.
- **The explanation card** sits inside the scene.
- **Guided tour:** it plays every 5.2 seconds and pauses when you pick a point, with Play and Pause buttons.
- **Day and Night toggle.**
- **Also on the page:**
  - the place chooser
  - the power-cut demo
  - the full list
  - contact
  - the shared header and footer

## 5. Assurance (`/assurance`): new build
- **Lives at `/assurance`** on the main site.
- **Hero, "one night":**
  - an office skyline with a shield watching over it
  - a clock you can drag from 18:00 to 08:00, which autoplays once when scrolled into view
  - ten example events tagged HANDLED or NEEDS YOU, with live counters
  - a "Monday morning" closing card
  - marked "Illustration only"
- **Also on the page:**
  - the start-here cards
  - the self-check score (checkbox rows fixed)
  - the scam test
  - the full list
  - good to know, what happens next, and contact

## 6. D'Source (`source.dmatek.ng`)
- **v11.1 is the latest storefront.**
- **"← Back to D'Matek"** link, with links to the main site's sections.
- **Contact:** the WhatsApp number and email.
- **Stays a separate site** on its own subdomain.

## 7. D'Foundry (`foundry.dmatek.ng`)
- **Hero v2 is the latest version.** It keeps all the original animations and design, with polish only.
- **Labels:** small headings never wrap, for example "D'FOUNDRY · BUILD IT".
- **WhatsApp:** button and number added.
- **Links:** "← Back to D'Matek", and the Droplet case study is linked.
- **Client names:** Valour and Valiant, and Droplet, need written permission before launch.
- **Stays a separate site** on its own subdomain.

## 8. Shared across all sites
- **Brand:**
  - Forest Green `#06382E`
  - Progress Green `#28705A`
  - Gold `#D4A637`, used for accents only
  - Cream `#F5F1E8`
  - Manrope
  - the D'Matek Line
- **Expandable lists:** + when closed, − when open.
- **Tracking:** every button that should be tracked has a `data-track` name. The list is in the README.
- **Accessibility:** reduced motion is respected and placeholders never show.
