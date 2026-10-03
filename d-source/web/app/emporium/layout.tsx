import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "D’Emporium · For home",
  description:
    "Genuine, warranty-backed devices for the home. Laptops, phones, Wi-Fi, TV & audio, power and security — delivered nationwide, with free set-up on TVs, laptops and phones.",
};

export default function EmporiumLayout({ children }: { children: React.ReactNode }) {
  return children;
}
