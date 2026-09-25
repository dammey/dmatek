"use client";

const STAGES = [
  { num: "1", n: "CUSTOMER PROJECT", title: "Solve it for one client", body: "Built around a specific problem, with the people who live with it every day." },
  { num: "2", n: "REUSABLE SOLUTION", title: "Keep what repeats", body: "The parts every client needs become platforms we maintain and reuse." },
  { num: "3", n: "PRODUCT", title: "Ship it to many", body: "Some platforms become products of their own, like QADPAY and Droplet." },
];

export default function Process() {
  return (
    <section data-screen-label="Process" style={{ background: "#28705A", color: "#F5F1E8", padding: "clamp(72px,12vh,140px) clamp(18px,3vw,40px)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(40px,6vh,72px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 24, flexWrap: "wrap" }}>
          <h2 data-rv="rise" style={{ margin: 0, fontWeight: 800, fontSize: "clamp(44px,7vw,120px)", lineHeight: 0.9, letterSpacing: "-.055em", maxWidth: "14ch" }}>
            One client, then a platform, <span style={{ fontFamily: "var(--font-instrument),serif", fontStyle: "italic", fontWeight: 400, letterSpacing: "-.02em", color: "#F5D98A" }}>then a product.</span>
          </h2>
          <span style={{ fontFamily: "var(--font-plex-mono),monospace", fontSize: 12, letterSpacing: ".12em" }}>03 &middot; HOW A PROJECT GROWS</span>
        </div>
        <div data-rv="mask" style={{ position: "relative", aspectRatio: "16/9", borderRadius: 32, overflow: "hidden", background: "#06382E" }}>
          <img src="/assets/dmatek-team.jpg" alt="The D’Matek team working through a plan" loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 25%" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))", gap: "clamp(16px,2vw,28px)" }}>
          {STAGES.map((st) => (
            <div key={st.num} data-rv="deal" style={{ display: "flex" }}>
              <div className="df-stage-card" style={{ display: "flex", flexDirection: "column", gap: 14, background: "#06382E", borderRadius: 32, padding: "clamp(24px,3vw,40px)", transition: "transform .5s cubic-bezier(.34,1.56,.64,1)" }}>
                <span style={{ fontWeight: 800, fontSize: "clamp(90px,10vw,160px)", lineHeight: 0.8, letterSpacing: "-.07em", color: "#D4A637" }}>{st.num}</span>
                <span style={{ fontFamily: "var(--font-plex-mono),monospace", fontSize: 12, letterSpacing: ".12em", color: "#F5D98A" }}>{st.n}</span>
                <span style={{ fontWeight: 800, fontSize: "clamp(24px,2.2vw,32px)", letterSpacing: "-.035em" }}>{st.title}</span>
                <span style={{ fontSize: 16, lineHeight: 1.55, color: "#D9E5DE" }}>{st.body}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx global>{`
        .df-stage-card:hover {
          transform: translateY(-10px) rotate(-1deg);
        }
      `}</style>
    </section>
  );
}
