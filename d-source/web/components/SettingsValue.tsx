"use client";

import { useSettings, type StorefrontSettings } from "@/lib/useSettings";

/** Renders a live Admin > Settings value in place of its bracketed
 * placeholder once one has been saved, keeping the placeholder visible
 * until then. `prefix`/`suffix` wrap the resolved value only (not the
 * placeholder), matching copy like "Pay when it arrives. [ AREAS TO CONFIRM ]". */
export default function SettingsValue({
  field,
  placeholder,
  prefix = "",
  suffix = "",
}: {
  field: keyof StorefrontSettings;
  placeholder: string;
  prefix?: string;
  suffix?: string;
}) {
  const settings = useSettings();
  const value = settings[field];
  return <>{value ? `${prefix}${value}${suffix}` : placeholder}</>;
}
