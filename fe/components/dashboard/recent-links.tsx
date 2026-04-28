"use client";

import { useState, useRef } from "react";
import { animate } from "animejs";
import {
  Link2,
  Copy,
  Check,
  BarChart3,
  ExternalLink,
  Clock,
  Inbox,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { QRCode } from "@/components/ui/qr-code";
import { GlassCard } from "@/components/glass-card";
import { ShortUrl, UrlStats, getStats } from "@/lib/api";

interface RecentLinksProps {
  links: ShortUrl[];
  onViewStats: (stats: UrlStats) => void;
}

export function RecentLinks({ links, onViewStats }: RecentLinksProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loadingStats, setLoadingStats] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCopy = async (link: ShortUrl) => {
    await navigator.clipboard.writeText(link.shortUrl);
    setCopiedId(link.id);

    const btn = document.getElementById(`copy-btn-${link.id}`);
    if (btn) {
      animate(btn, {
        scale: [1, 1.2, 1],
        duration: 300,
        ease: "outExpo",
      });
    }

    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleViewStats = async (shortCode: string) => {
    setLoadingStats(shortCode);
    setError(null);

    try {
      const stats = await getStats(shortCode);
      onViewStats(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch stats");
    } finally {
      setLoadingStats(null);
    }
  };

  const handleDownloadQr = (link: ShortUrl) => {
    const downloadLink = document.createElement("a");
    downloadLink.href = link.qrCodeDataUrl;
    downloadLink.download = `${link.shortCode}-qr.png`;
    downloadLink.click();
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

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {links.map((link) => (
          <div
            key={link.id}
            className="group rounded-2xl border border-white/8 bg-slate-950/42 p-4 transition-all hover:border-cyan-400/18 hover:bg-slate-900/52"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 flex-1 gap-4">
                <div className="shrink-0 rounded-xl bg-white p-2">
                  <QRCode
                    value={link.shortUrl}
                    size={80}
                    fgColor="#020617"
                    bgColor="#ffffff"
                    className="h-16 w-16 sm:h-20 sm:w-20"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Link2 className="h-4 w-4 shrink-0 text-cyan-400" />
                    <span className="truncate font-mono font-medium text-white">
                      {link.shortCode}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm text-slate-400">
                    {link.originalUrl}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span>{formatDate(link.createdAt)}</span>
                    <span>
                      {link.clickCount} click{link.clickCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadQr(link)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                  title="Download QR code"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  id={`copy-btn-${link.id}`}
                  onClick={() => handleCopy(link)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                  title="Copy to clipboard"
                >
                  {copiedId === link.id ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
                <a
                  href={link.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                  title="Open link"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleViewStats(link.shortCode)}
                  disabled={loadingStats === link.shortCode}
                  className="text-slate-400 hover:bg-white/10 hover:text-white"
                >
                  <BarChart3 className="mr-1 h-4 w-4" />
                  {loadingStats === link.shortCode ? "Loading..." : "Stats"}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
