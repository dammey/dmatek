import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import HelpActions from "@/components/HelpActions";
import SettingsValue from "@/components/SettingsValue";

type Row = { k: string; v: React.ReactNode };

const TOPICS: Record<string, { title: string; paras: React.ReactNode[]; list?: Row[] }> = {
  delivery: {
    title: "Delivery",
    paras: ["We deliver anywhere in Nigeria.", "After you order, we call to confirm the delivery date and any set-up you’ve booked."],
    list: [
      { k: "Where", v: "Nationwide" },
      { k: "Times and fees", v: <SettingsValue field="deliveryTimesAndFees" placeholder="[ DELIVERY TIMES AND FEES TO CONFIRM ]" /> },
      { k: "Business orders", v: "Delivered to each of your sites, as set out in the quote." },
    ],
  },
  payment: {
    title: "Payment",
    paras: ["Pay the way that suits you."],
    list: [
      { k: "Card", v: "Paystack or Flutterwave" },
      { k: "Bank transfer", v: "Details sent after you order" },
      { k: "USSD", v: "From any bank on your phone" },
      { k: "Pay on delivery", v: <SettingsValue field="podAreas" placeholder="Pay when it arrives. [ AREAS TO CONFIRM ]" prefix="Pay when it arrives. " /> },
      { k: "Business invoice", v: "Approved business accounts pay on 30-day invoice." },
    ],
  },
  install: {
    title: "Installation and set-up",
    paras: ["Installed by D’Matek engineers, for home kits and business orders."],
    list: [{ k: "Free", v: "TV wall mounting · laptop and phone set-up and data transfer · Office in a Box" }, { k: "Paid add-on", v: "Other installation, quoted before we start" }, { k: "Site surveys", v: "Free, before we specify anything" }],
  },
  returns: {
    title: "Returns",
    paras: [<SettingsValue key="r" field="returnsPolicy" placeholder="[ RETURNS POLICY TO CONFIRM ]" />, "If something isn’t right, contact us first and we’ll tell you what happens next."],
  },
  warranty: {
    title: "Warranty and repairs",
    paras: ["Every device is genuine and warranty-backed.", "For repairs, we collect it from you, or you send it to us by courier."],
  },
  biz: {
    title: "Business accounts",
    paras: ["Business accounts are approved after a check. Approved accounts order against a PO and pay on 30-day invoice."],
    list: [{ k: "Quotes", v: "Within 4 working hours" }, { k: "Pricing", v: "Volume pricing on larger orders" }, { k: "Site surveys", v: "Free" }],
  },
  contact: {
    title: "Contact us",
    paras: ["Tell us in your own words. You don’t need to know which technology it needs."],
    list: [
      { k: "Phone", v: "0705 807 1768" },
      { k: "Email", v: "hello@dmatek.ng" },
      { k: "WhatsApp", v: "0705 807 1768" },
      { k: "Address", v: <SettingsValue field="address" placeholder="[ ADDRESS TO BE ADDED ]" /> },
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const { topic } = await params;
  const t = TOPICS[topic];
  if (!t) return {};
  const firstStringPara = t.paras.find((p): p is string => typeof p === "string");
  return { title: t.title, description: firstStringPara };
}

export default async function HelpTopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const t = TOPICS[topic];
  if (!t) notFound();

  return (
    <main style={{ background: "#FFFFFF", color: "#06382E" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "18px clamp(18px,3vw,40px) 0", display: "flex", gap: 6, alignItems: "center", fontSize: 13, color: "#5E6E68" }}>
        <Link href="/" style={{ fontSize: 13, fontWeight: 600, color: "#5E6E68" }}>
          D’Source
        </Link>
        <span style={{ color: "#B9B3A6" }}>›</span>
        <span style={{ fontWeight: 700, color: "#06382E" }}>Help</span>
      </div>
      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "clamp(28px,5vh,56px) clamp(18px,3vw,40px) clamp(56px,8vh,96px)" }}>
        <h1 style={{ margin: "0 0 12px", fontWeight: 800, fontSize: "clamp(40px,5.6vw,84px)", lineHeight: 0.95, letterSpacing: "-0.05em" }}>How can we help?</h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(20px,3vw,48px)", alignItems: "flex-start", marginTop: 24 }}>
          <nav style={{ flex: "0 1 260px", minWidth: "min(100%,200px)", display: "flex", flexDirection: "column", gap: 4, position: "sticky", top: 130 }}>
            {Object.keys(TOPICS).map((id) => {
              const active = id === topic;
              return (
                <Link
                  key={id}
                  href={`/help/${id}`}
                  style={{
                    textAlign: "left",
                    borderLeft: `3px solid ${active ? "#D4A637" : "transparent"}`,
                    background: active ? "#F5F1E8" : "transparent",
                    color: "#06382E",
                    padding: "12px 16px",
                    fontSize: 15,
                    fontWeight: active ? 800 : 600,
                    borderRadius: "0 12px 12px 0",
                  }}
                >
                  {TOPICS[id].title}
                </Link>
              );
            })}
          </nav>
          <article style={{ flex: "1 1 520px", minWidth: 0, maxWidth: 760, display: "flex", flexDirection: "column", gap: 16 }}>
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: "clamp(28px,3.2vw,44px)", letterSpacing: "-0.04em" }}>{t.title}</h2>
            {t.paras.map((p, i) => (
              <p key={i} style={{ margin: 0, fontSize: 17, lineHeight: 1.7, color: "#3A4A44" }}>
                {p}
              </p>
            ))}
            {t.list && (
              <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #EEEAE2" }}>
                {t.list.map((row) => (
                  <div key={row.k} style={{ display: "grid", gridTemplateColumns: "minmax(120px,200px) minmax(0,1fr)", gap: 14, padding: "14px 0", borderBottom: "1px solid #EEEAE2", fontSize: 15 }}>
                    <span style={{ fontWeight: 800 }}>{row.k}</span>
                    <span style={{ color: "#3A4A44", lineHeight: 1.55 }}>{row.v}</span>
                  </div>
                ))}
              </div>
            )}
            <HelpActions topic={topic} />
          </article>
        </div>
      </section>
    </main>
  );
}
