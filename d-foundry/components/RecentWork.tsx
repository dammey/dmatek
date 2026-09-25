"use client";

const FEATS = [
  { n: "01", title: "Reorder in one tap", body: "Spots when a customer is running low from their order history, and offers their usual." },
  { n: "02", title: "Subscriptions", body: "Scheduled deliveries that keep coming without a new order." },
  { n: "03", title: "Recycling for points", body: "Customers book a pickup for their empties by material and earn points for it." },
];

const CASES = [
  { client: "Omatek", body: "Website revamp, with company email on D’Matek Cloud." },
  { client: "Valour and Valiant", body: "New website, with business email on D’Matek Cloud." },
];

const DROPLET_URL = "https://web-gamma-fawn-29.vercel.app/";

export default function RecentWork() {
  return (
    <section id="droplet" data-screen-label="Recent work" style={{ background: "#1A1A1A", color: "#F5F1E8", padding: "clamp(72px,12vh,140px) clamp(18px,3vw,40px)", overflow: "hidden" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(32px,5vh,56px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 24, flexWrap: "wrap" }}>
          <h2 data-rv="rise" style={{ margin: 0, fontWeight: 800, fontSize: "clamp(56px,9vw,160px)", lineHeight: 0.85, letterSpacing: "-.06em" }}>
            Shipped, <span style={{ fontFamily: "var(--font-instrument),serif", fontStyle: "italic", fontWeight: 400, letterSpacing: "-.02em", color: "#D4A637" }}>and running.</span>
          </h2>
          <span style={{ fontFamily: "var(--font-plex-mono),monospace", fontSize: 12, letterSpacing: ".12em", color: "#BDB6A6" }}>04 &middot; RECENT WORK</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,340px),1fr))", gap: "clamp(24px,4vw,64px)", alignItems: "end" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <span style={{ alignSelf: "flex-start", background: "#D4A637", color: "#06382E", borderRadius: 999, padding: "6px 12px", fontFamily: "var(--font-plex-mono),monospace", fontSize: 11, fontWeight: 600 }}>CASE STUDY &middot; LIVE</span>
            <span style={{ fontFamily: "var(--font-instrument),serif", fontStyle: "italic", fontSize: "clamp(72px,9vw,150px)", lineHeight: 0.8, letterSpacing: "-.03em" }}>Droplet</span>
            <p style={{ margin: 0, fontSize: 18, lineHeight: 1.55, color: "#D9D3C4", maxWidth: "40ch" }}>
              Water on demand for Blessed Water. Customers order and reorder in a few taps, keep deliveries coming on a subscription, and book recycling pickups that earn points.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a href="/work/droplet" className="df-outline-btn" style={{ border: "2px solid #F5F1E8", color: "#F5F1E8", borderRadius: 999, padding: "12px 20px", fontWeight: 700, fontSize: 15, whiteSpace: "nowrap" }}>
                Read the case study &rarr;
              </a>
              <a href={DROPLET_URL} target="_blank" rel="noopener" className="df-gold-btn" style={{ background: "#D4A637", color: "#06382E", borderRadius: 999, padding: "14px 22px", fontWeight: 700, fontSize: 15, whiteSpace: "nowrap" }}>
                Visit Droplet &#8599;
              </a>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #444" }}>
            {FEATS.map((f) => (
              <div key={f.n} data-rv="up" style={{ display: "grid", gridTemplateColumns: "48px minmax(0,1fr)", gap: 12, padding: "16px 0", borderBottom: "1px solid #444" }}>
                <span style={{ fontFamily: "var(--font-plex-mono),monospace", fontSize: 12, color: "#D4A637" }}>{f.n}</span>
                <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 20, letterSpacing: "-.02em" }}>{f.title}</span>
                  <span style={{ fontSize: 15, lineHeight: 1.5, color: "#BDB6A6" }}>{f.body}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(12,minmax(0,1fr))", gap: "clamp(12px,1.6vw,24px)", alignItems: "start" }}>
          <div data-rv="mask" style={{ gridColumn: "1 / span 8", position: "relative", borderRadius: 24, overflow: "hidden", background: "#F5F8FB", boxShadow: "0 40px 80px rgba(0,0,0,.45)" }}>
            <img loading="lazy" src="/assets/droplet-dash.jpg" alt="Droplet customer home: reorder prompt, usual order and subscription" style={{ display: "block", width: "100%", height: "auto" }} />
          </div>
          <div data-rv="deal" style={{ gridColumn: "8 / span 5", marginTop: "clamp(40px,8vw,140px)", position: "relative", borderRadius: 20, overflow: "hidden", background: "#F5F8FB", boxShadow: "0 40px 80px rgba(0,0,0,.5)", border: "6px solid #1A1A1A" }}>
            <img loading="lazy" src="/assets/droplet-shop.jpg" alt="Droplet shop with products and delivery zones" style={{ display: "block", width: "100%", height: "auto" }} />
          </div>
          <div data-rv="deal" style={{ gridColumn: "3 / span 6", marginTop: "clamp(-120px,-6vw,-40px)", position: "relative", borderRadius: 20, overflow: "hidden", background: "#F5F8FB", boxShadow: "0 40px 80px rgba(0,0,0,.5)", border: "6px solid #1A1A1A" }}>
            <img loading="lazy" src="/assets/droplet-rec.jpg" alt="Droplet recycling pickup: materials, points and pickup address" style={{ display: "block", width: "100%", height: "auto" }} />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: "clamp(24px,4vh,48px)" }}>
          <span style={{ fontFamily: "var(--font-plex-mono),monospace", fontSize: 12, letterSpacing: ".12em", color: "#BDB6A6" }}>IN THE WORKS</span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,320px),1fr))", gap: 12 }}>
            {CASES.map((c) => (
              <div key={c.client} data-rv="pill" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap", border: "1.5px solid #444", borderRadius: 999, padding: "18px 26px" }}>
                <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontWeight: 800, fontSize: "clamp(20px,2vw,28px)", letterSpacing: "-.035em" }}>{c.client}</span>
                  <span style={{ fontSize: 14, color: "#BDB6A6" }}>{c.body}</span>
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-plex-mono),monospace", fontSize: 11, fontWeight: 600, color: "#D4A637", whiteSpace: "nowrap" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#D4A637" }} />
                  IN PROGRESS
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx global>{`
        .df-outline-btn:hover {
          background: #f5f1e8;
          color: #1a1a1a;
        }
        .df-gold-btn:hover {
          background: #f5f1e8;
          color: #06382e;
        }
      `}</style>
    </section>
  );
}
