"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "./api";
import { PROMISE } from "./promises";

/** Store settings published from Admin › Settings (GET /content › settings).
 * Until they load, or where a field is blank, the README values are used. */
type Raw = Partial<Record<"feeLagos" | "feeAbuja" | "feeOther" | "times" | "pod" | "returns" | "phone" | "email" | "whatsapp" | "address" | "sla" | "invoiceDays" | "reviewTime", string>>;

export type StoreSettings = {
  phone: string;
  email: string;
  whatsapp: string;
  whatsappHref: string;
  delivery: string;
  pod: string;
  returns: string;
  address: string;
  reviewTime: string;
  fees: { lagos: string; abuja: string; other: string };
};

const intl = (n: string) => n.replace(/\D/g, "").replace(/^0/, "234");

function resolve(r: Raw): StoreSettings {
  const wa = r.whatsapp || r.phone || PROMISE.phone;
  return {
    phone: r.phone || PROMISE.phone,
    email: r.email || PROMISE.email,
    whatsapp: wa,
    whatsappHref: `https://wa.me/${intl(wa)}`,
    delivery: r.times || PROMISE.delivery,
    pod: r.pod || "Available, subject to terms and conditions",
    returns: r.returns || "7 days",
    address: r.address || "[ ADDRESS TO CONFIRM ]",
    reviewTime: r.reviewTime || "[ REVIEW TIME TO CONFIRM ]",
    fees: { lagos: r.feeLagos || "[ FEE ]", abuja: r.feeAbuja || "[ FEE ]", other: r.feeOther || "[ FEE ]" },
  };
}

const Ctx = createContext<StoreSettings>(resolve({}));

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [s, setS] = useState<StoreSettings>(() => resolve({}));
  useEffect(() => {
    api
      .get<{ settings?: Raw }>("/content")
      .then((c) => c.settings && setS(resolve(c.settings)))
      .catch(() => {});
  }, []);
  return <Ctx.Provider value={s}>{children}</Ctx.Provider>;
}

export const useStore = () => useContext(Ctx);

/** Inline setting value for server components, e.g. <StoreText k="phone" />. */
export function StoreText({ k }: { k: "phone" | "email" | "whatsapp" | "delivery" | "pod" | "returns" | "address" | "reviewTime" }) {
  return <>{useStore()[k]}</>;
}

/** WhatsApp link to the published number. */
export function WhatsAppLink({ children, style, className }: { children?: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  const s = useStore();
  return (
    <a href={s.whatsappHref} style={style} className={className}>
      {children ?? s.whatsapp}
    </a>
  );
}
