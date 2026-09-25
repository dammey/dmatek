"use client";

const SERVICES = [
  "Custom software development",
  "Web development and web applications",
  "Business application development",
  "System integration",
  "Automation and integration work",
  "Digital solution development",
  "QADPAY: D’Matek-owned fintech venture",
];

export default function Services() {
  return (
    <section data-screen-label="Services" style={{ background: "#F5F1E8", color: "#06382E", padding: "clamp(72px,12vh,140px) clamp(18px,3vw,40px)" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", flexDirection: "column", gap: "clamp(32px,5vh,56px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 24, flexWrap: "wrap" }}>
          <h2 data-rv="rise" style={{ margin: 0, fontWeight: 800, fontSize: "clamp(56px,10vw,180px)", lineHeight: 0.85, letterSpacing: "-.06em" }}>
            What we <span style={{ fontFamily: "var(--font-instrument),serif", fontStyle: "italic", fontWeight: 400, letterSpacing: "-.02em", color: "#28705A" }}>build.</span>
          </h2>
          <span style={{ fontFamily: "var(--font-plex-mono),monospace", fontSize: 12, letterSpacing: ".12em", color: "#28705A" }}>02 &middot; SERVICES</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {SERVICES.map((name, i) => (
            <div key={name} data-rv="pill">
              <div
                className="df-service-row"
                style={{ display: "flex", alignItems: "center", gap: 20, border: "2px solid #06382E", borderRadius: 999, padding: "clamp(14px,2vh,22px) clamp(20px,3vw,36px)", transition: "background .3s,color .3s,transform .4s cubic-bezier(.34,1.56,.64,1)" }}
              >
                <span style={{ fontFamily: "var(--font-plex-mono),monospace", fontSize: 13, fontWeight: 600 }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ flex: 1, fontWeight: 700, fontSize: "clamp(20px,2.6vw,40px)", letterSpacing: "-.035em", lineHeight: 1.1 }}>{name}</span>
                <span style={{ fontSize: "clamp(20px,2vw,30px)", color: "#D4A637" }}>&#8599;</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx global>{`
        .df-service-row:hover {
          background: #06382e;
          color: #f5f1e8;
          transform: rotate(-1.2deg) scale(1.01);
        }
      `}</style>
    </section>
  );
}
