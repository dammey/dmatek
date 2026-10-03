"use client";

import { useEffect, useState } from "react";
import { api } from "./api";

export type StorefrontSettings = {
  address?: string;
  returnsPolicy?: string;
  businessAccountReviewTime?: string;
  deliveryTimesAndFees?: string;
  podAreas?: string;
};

/** The subset of Admin > Settings that fills `[ ... TO CONFIRM ]` placeholders
 * on the storefront. Until a value is set in Admin, the bracketed placeholder
 * stays visible — nothing here is invented. */
export function useSettings(): StorefrontSettings {
  const [settings, setSettings] = useState<StorefrontSettings>({});

  useEffect(() => {
    api
      .get<{ settings: StorefrontSettings }>("/content")
      .then(({ settings }) => setSettings(settings))
      .catch(() => {});
  }, []);

  return settings;
}
