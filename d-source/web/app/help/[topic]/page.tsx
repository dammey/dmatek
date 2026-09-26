import Link from "next/link";
import { notFound } from "next/navigation";
import HelpActions from "@/components/HelpActions";

const TOPICS: Record<string, { title: string; paras: string[]; list?: { k: string; v: string }[] }> = {
  delivery: {
    title: "Delivery",
    paras: ["We deliver anywhere in Nigeria.", "After you order, we call to confirm the delivery date and any set-up you’ve booked."],
    list: [{ k: "Where", v: "Nationwide" }, { k: "Times and fees", v: "[ DELIVERY TIMES AND FEES TO CONFIRM ]" }, { k: "Business orders", v: "Delivered to each of your sites, as set out in the quote." }],
  },
  payment: {
    title: "Payment",
    paras: ["Pay the way that suits you."],
    list: [{ k: "Card", v: "Paystack or Flutterwave" }, { k: "Bank transfer", v: "Details sent after you order" }, { k: "USSD", v: "From any bank on your phone" }, { k: "Pay on delivery", v: "Pay when it arrives. [ AREAS TO CONFIRM ]" }, { k: "Business invoice", v: "Approved business accounts pay on 30-day invoice." }],
  },
  install: {
    title: "Installation and set-up",
    paras: ["Installed by D’Matek engineers, for home kits and business orders."],
    list: [{ k: "Free", v: "TV wall mounting · laptop and phone set-up and data transfer · Office in a Box" }, { k: "Paid add-on", v: "Other installation, quoted before we start" }, { k: "Site surveys", v: "Free, before we specify anything" }],
  },
  returns: { title: "Returns", paras: ["[ RETURNS POLICY TO CONFIRM ]", "If something isn’t right, contact us first and we’ll tell you what happens next."] },
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
    list: [{ k: "Phone", v: "[ PHONE TO BE ADDED ]" }, { k: "Email", v: "[ EMAIL TO BE ADDED ]" }, { k: "WhatsApp", v: "[ WHATSAPP NUMBER TO BE ADDED ]" }, { k: "Address", v: "[ ADDRESS TO BE ADDED ]" }],
  },
};

export default async function HelpTopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic } = await params;
  const t = TOPICS[topic];
  if (!t) notFound();

  return (
    <main style={{ background: "#FFFFFF", color: "#06382E" }}>
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(28px,5vh,56px) clamp(18px,3vw,40px)", display: "grid", gridTemplateColumns: "220px minmax(0,1fr)", gap: 32 }}>
        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {Object.keys(TOPICS).map((id) => (
            <Link key={id} href={`/help/${id}`} style={{ padding: "8px 0", fontWeight: id === topic ? 800 : 600, borderBottom: id === topic ? "2px solid #D4A637" : "2px solid transparent" }}>
              {TOPICS[id].title}
            </Link>
          ))}
        </nav>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: "clamp(30px,4vw,44px)", letterSpacing: "-0.04em", marginBottom: 20 }}>{t.title}</h1>
          {t.paras.map((p) => (
            <p key={p} style={{ fontSize: 16, lineHeight: 1.7, color: "#3A4A44", marginBottom: 14 }}>
              {p}
            </p>
          ))}
          {t.list && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 20 }}>
              {t.list.map((row) => (
                <div key={row.k} style={{ display: "grid", gridTemplateColumns: "140px minmax(0,1fr)", gap: 12, fontSize: 14.5 }}>
                  <span style={{ color: "#5E6E68" }}>{row.k}</span>
                  <span>{row.v}</span>
                </div>
              ))}
            </div>
          )}
          <HelpActions topic={topic} />
        </div>
      </section>
    </main>
  );
}
