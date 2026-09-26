"use client";

import Link from "next/link";
import Reveal from "@/components/Reveal";

type WorkTeaserCardProps = {
  id: string;
  sector: string;
  title: string;
  problem: string;
  tenure: string;
};

export default function WorkTeaserCard({ id, sector, title, problem, tenure }: WorkTeaserCardProps) {
  return (
    <Reveal
      as={Link}
      href={`/work#${id}`}
      className="flex flex-col gap-3.5 rounded-[clamp(26px,3vw,40px)] p-[clamp(28px,3vw,38px)] shadow-[0_14px_40px_rgba(6,56,46,0.08)] transition-transform hover:-translate-y-1.5 hover:shadow-[0_28px_60px_rgba(6,56,46,0.16)]"
      style={{ background: "linear-gradient(160deg,#EFEADC,#E8E2D0)" }}
    >
      <span
        className="self-start rounded-[4px] px-4 py-2 text-[11px] font-bold tracking-[0.16em] text-forest"
        style={{ background: "rgba(212,166,55,0.3)" }}
      >
        {sector}
      </span>
      <span className="text-[23px] font-extrabold leading-[1.18] tracking-[-0.02em] text-forest">{title}</span>
      <span className="text-[15px] leading-[1.65] text-ink">{problem}</span>
      <span className="mt-1.5 text-[12.5px] font-bold tracking-[0.1em] text-progress">{tenure}</span>
    </Reveal>
  );
}
