"use client";

import Link from "next/link";
import { useState } from "react";
import { animate } from "animejs";
import {
  BarChart3,
  Check,
  Clock,
  Copy,
  ExternalLink,
  Inbox,
  Link2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/glass-card";
import { ShortUrl } from "@/lib/api";

interface RecentLinksProps {
  links: ShortUrl[];
}

export function RecentLinks({ links }: RecentLinksProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (link: ShortUrl) => {
    await navigator.clipboard.writeText(link.shortUrl);
    setCopiedId(link.id);

    const btn = document.getElementById(`copy-btn-${link.id}`);
    if (btn) {
      animate(btn, {
        scale: [1, 1.12, 1],
        duration: 280,
        ease: "outExpo",
      });
    }

    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (links.length === 0) {
    return (
      <GlassCard className="p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/8 bg-slate-900/65">
          <Inbox className="h-8 w-8 text-slate-500" />
        </div>
        <h3 className="text-lg font-semibold text-white">No links yet</h3>
        <p className="mt-2 text-slate-400">
          Create your first short link to see it here
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
          <Clock className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Recent Links</h2>
          <p className="text-sm text-slate-400">
            {links.length} link{links.length !== 1 ? "s" : ""} created
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {links.map((link) => (
          <div
            key={link.id}
            className="rounded-2xl border border-white/8 bg-slate-950/42 p-4 transition-all hover:border-cyan-400/18 hover:bg-slate-900/52"
          >
            <div className="flex flex-col gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Link2 className="h-4 w-4 shrink-0 text-cyan-400" />
                  <a
                    href={link.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate font-mono text-sm font-semibold text-cyan-300 transition-colors hover:text-cyan-200"
                  >
                    {link.shortUrl}
                  </a>
                </div>
                <p className="mt-2 truncate text-sm text-slate-300">
                  {link.originalUrl}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span>Created {formatDate(link.createdAt)}</span>
                  <span>
                    {link.clickCount} click{link.clickCount !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  id={`copy-btn-${link.id}`}
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCopy(link)}
                  className="border border-white/10 bg-slate-900/70 text-slate-200 hover:bg-white/10 hover:text-white"
                >
                  {copiedId === link.id ? (
                    <Check className="h-4 w-4 text-emerald-300" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copiedId === link.id ? "Copied" : "Copy Link"}
                </Button>

                <Button
                  asChild
                  size="sm"
                  variant="ghost"
                  className="border border-white/10 bg-slate-900/70 text-slate-200 hover:bg-white/10 hover:text-white"
                >
                  <a href={link.shortUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Open Link
                  </a>
                </Button>

                <Button
                  asChild
                  size="sm"
                  variant="ghost"
                  className="border border-cyan-400/18 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/18 hover:text-white"
                >
                  <Link href={`/dashboard/stats/${encodeURIComponent(link.shortCode)}`}>
                    <BarChart3 className="h-4 w-4" />
                    Stats
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
