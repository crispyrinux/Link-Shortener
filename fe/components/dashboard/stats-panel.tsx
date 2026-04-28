"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";
import {
  BarChart3,
  MousePointerClick,
  Link2,
  Calendar,
  X,
  ExternalLink,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/glass-card";
import { UrlStats } from "@/lib/api";

interface StatsPanelProps {
  stats: UrlStats;
  onClose: () => void;
}

export function StatsPanel({ stats, onClose }: StatsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (panelRef.current) {
      animate(panelRef.current, {
        opacity: [0, 1],
        translateY: [30, 0],
        scale: [0.95, 1],
        duration: 600,
        ease: "outExpo",
      });
    }

    if (countRef.current) {
      const counter = { value: 0 };

      animate(counter, {
        value: stats.clickCount,
        duration: 1200,
        ease: "outExpo",
        onUpdate: () => {
          if (countRef.current) {
            countRef.current.textContent = Math.round(counter.value).toString();
          }
        },
      });
    }
  }, [stats.clickCount]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <GlassCard
      ref={panelRef}
      variant="glow"
      className="relative p-6 opacity-0"
    >
      <Button
        size="sm"
        variant="ghost"
        onClick={onClose}
        className="absolute right-4 top-4 text-slate-400 hover:bg-white/10 hover:text-white"
      >
        <X className="h-4 w-4" />
      </Button>

      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
          <BarChart3 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Link Analytics</h2>
          <p className="text-sm text-slate-400">Performance overview</p>
        </div>
      </div>

      {/* Main stats card */}
      <div className="mb-6 rounded-2xl border border-purple-400/18 bg-gradient-to-r from-purple-500/16 to-pink-500/14 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-purple-400">
              <MousePointerClick className="h-5 w-5" />
              <span className="text-sm font-medium">Total Clicks</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span
                ref={countRef}
                className="text-5xl font-bold text-white"
              >
                0
              </span>
              <TrendingUp className="h-6 w-6 text-green-400" />
            </div>
          </div>
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 opacity-50 blur-xl" />
        </div>
      </div>

      {/* Details */}
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-xl border border-white/8 bg-slate-950/42 p-4">
          <Link2 className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-slate-400">Short Code</div>
            <div className="mt-1 font-mono text-lg font-semibold text-white">
              {stats.shortCode}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-white/8 bg-slate-950/42 p-4">
          <ExternalLink className="mt-0.5 h-5 w-5 shrink-0 text-indigo-400" />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-slate-400">
              Original URL
            </div>
            <a
              href={stats.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block truncate text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              {stats.originalUrl}
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-white/8 bg-slate-950/42 p-4">
          <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-pink-400" />
          <div>
            <div className="text-sm font-medium text-slate-400">Created</div>
            <div className="mt-1 text-white">{formatDate(stats.createdAt)}</div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
