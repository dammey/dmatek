"use client";

import useScrollProgress from "@/hooks/useScrollProgress";

export default function ScrollProgressBar() {
  const scroll = useScrollProgress();

  return (
    <div
      aria-hidden="true"
      className="fixed left-0 top-0 z-[120] h-[3px] rounded-r-full"
      style={{
        width: `${scroll * 100}%`,
        background: "linear-gradient(90deg, #28705A, #D4A637)",
      }}
    />
  );
}
