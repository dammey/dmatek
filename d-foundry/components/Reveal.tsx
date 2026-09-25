"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode, type Ref } from "react";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  variant?: "rise" | "up" | "pill" | "deal" | "mask";
  className?: string;
  style?: CSSProperties;
  delayMs?: number;
};

/** Fades/rises/masks content into place as it enters the viewport. */
export default function Reveal({ children, as: Tag = "div", variant = "rise", className = "", delayMs = 0, ...rest }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as unknown as Ref<HTMLElement>}
      data-rv={variant}
      className={`${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delayMs}ms`, ...rest.style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
