"use client";

import Link from "next/link";
import Reveal from "@/components/Reveal";

type EnvironmentCardProps = {
  id: string;
  sol: string;
  name: string;
  headline: string;
};

export default function EnvironmentCard({ id, sol, name, headline }: EnvironmentCardProps) {
  return (
    <Reveal
      as={Link}
      href={`/solutions/${id}`}
      className="flex flex-col gap-2.5 rounded-[clamp(24px,3vw,36px)] p-[clamp(24px,2.6vw,32px)] shadow-[0_12px_32px_rgba(6,56,46,0.07)] transition-transform hover:-translate-y-1.5 hover:shadow-[0_24px_50px_rgba(6,56,46,0.14)]"
      style={{ background: "linear-gradient(160deg,#EFEADC,#E8E2D0)" }}
    >
      <span className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-bold tracking-[0.16em] text-progress">{sol}</span>
        <span className="font-extrabold text-gold">&rarr;</span>
      </span>
      <span className="text-[23px] font-extrabold tracking-[-0.02em] text-forest">{name}</span>
      <span className="text-[15px] leading-[1.55] text-ink">{headline}</span>
    </Reveal>
  );
}
