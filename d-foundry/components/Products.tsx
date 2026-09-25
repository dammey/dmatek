const DROPLET_URL = "https://web-gamma-fawn-29.vercel.app/";

export default function Products() {
  return (
    <section data-screen-label="Products" style={{ background: "#D4A637", color: "#06382E", padding: "clamp(72px,12vh,140px) clamp(18px,3vw,40px)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(32px,5vh,56px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 24, flexWrap: "wrap" }}>
          <h2 data-rv="rise" style={{ margin: 0, fontWeight: 800, fontSize: "clamp(56px,9vw,160px)", lineHeight: 0.85, letterSpacing: "-.06em" }}>
            Our own <span style={{ fontFamily: "var(--font-instrument),serif", fontStyle: "italic", fontWeight: 400, letterSpacing: "-.02em" }}>products.</span>
          </h2>
          <span style={{ fontFamily: "var(--font-plex-mono),monospace", fontSize: 12, letterSpacing: ".12em" }}>05 &middot; PRODUCTS</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,420px),1fr))", gap: "clamp(20px,3vw,40px)" }}>
          <div data-rv="deal" style={{ display: "flex", flexDirection: "column", gap: 18, background: "#06382E", color: "#F5F1E8", borderRadius: 36, padding: "clamp(20px,2.4vw,32px)" }}>
            <div style={{ position: "relative", aspectRatio: "16/10", borderRadius: 24, overflow: "hidden", background: "#0B4B3D" }}>
              <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontFamily: "var(--font-plex-mono),monospace", fontSize: 12, letterSpacing: ".14em", color: "#D4A637" }}>IN THE FOUNDRY &middot; COMING SOON</div>
            </div>
            <span style={{ alignSelf: "flex-start", background: "#D4A637", color: "#06382E", borderRadius: 999, padding: "6px 12px", fontFamily: "var(--font-plex-mono),monospace", fontSize: 11, fontWeight: 600 }}>PRODUCT 01 &middot; IN DEVELOPMENT</span>
            <span style={{ fontWeight: 800, fontSize: "clamp(56px,7vw,110px)", lineHeight: 0.85, letterSpacing: "-.065em" }}>QADPAY</span>
            <p style={{ margin: 0, fontSize: 17, lineHeight: 1.55, color: "#D9E5DE", maxWidth: "44ch" }}>A D&rsquo;Matek-owned fintech product, currently in development at D&rsquo;Foundry.</p>
          </div>
          <div data-rv="deal" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 18, background: "#F5F1E8", borderRadius: 36, padding: "clamp(24px,3vw,40px)", minHeight: "clamp(320px,40vw,520px)" }}>
            <span style={{ alignSelf: "flex-start", background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "6px 12px", fontFamily: "var(--font-plex-mono),monospace", fontSize: 11, fontWeight: 600 }}>PRODUCT 02 &middot; LIVE</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <span style={{ fontFamily: "var(--font-instrument),serif", fontStyle: "italic", fontSize: "clamp(80px,11vw,180px)", lineHeight: 0.8, letterSpacing: "-.03em" }}>Droplet</span>
              <p style={{ margin: 0, fontSize: 17, lineHeight: 1.55, color: "#28705A", maxWidth: "40ch" }}>Water on demand, built for Blessed Water and live in Lagos and Ibadan.</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <a href={DROPLET_URL} target="_blank" rel="noopener" style={{ background: "#06382E", color: "#F5F1E8", borderRadius: 999, padding: "14px 22px", fontWeight: 700, fontSize: 15, whiteSpace: "nowrap" }}>
                  Visit Droplet &#8599;
                </a>
                <a href="/work/droplet" style={{ border: "2px solid #06382E", borderRadius: 999, padding: "12px 20px", fontWeight: 700, fontSize: 15, whiteSpace: "nowrap" }}>
                  Read the case study &#8593;
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
