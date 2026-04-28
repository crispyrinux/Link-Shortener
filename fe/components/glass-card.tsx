"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glow" | "subtle";
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-[1.75rem] border border-white/12 bg-slate-950/62 shadow-[0_22px_70px_rgba(2,6,23,0.5)] backdrop-blur-xl before:absolute before:inset-0 before:bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02)_38%,rgba(255,255,255,0))] before:pointer-events-none",
          variant === "glow" &&
            "after:absolute after:-inset-px after:-z-10 after:rounded-[1.85rem] after:bg-[linear-gradient(135deg,rgba(34,211,238,0.32),rgba(59,130,246,0.2)_36%,rgba(139,92,246,0.3)_68%,rgba(217,70,239,0.18))] after:blur-md",
          variant === "subtle" &&
            "border-white/10 bg-slate-950/46 shadow-[0_16px_48px_rgba(2,6,23,0.35)]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";
