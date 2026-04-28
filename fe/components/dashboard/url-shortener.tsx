"use client";

import { useState, useRef, useEffect } from "react";
import { animate } from "animejs";
import {
  Link2,
  Wand2,
  Loader2,
  Copy,
  Check,
  ExternalLink,
  Download,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QRCode } from "@/components/ui/qr-code";
import { GlassCard } from "@/components/glass-card";
import { createShortUrl, ShortUrl } from "@/lib/api";

interface UrlShortenerProps {
  onLinkCreated: (link: ShortUrl) => void;
}

export function UrlShortener({ onLinkCreated }: UrlShortenerProps) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ShortUrl | null>(null);
  const [copied, setCopied] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);
  const copyBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (result && resultRef.current) {
      animate(resultRef.current, {
        opacity: [0, 1],
        translateY: [24, 0],
        scale: [0.96, 1],
        duration: 700,
        ease: "outExpo",
      });
    }
  }, [result]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const link = await createShortUrl(originalUrl, customAlias || undefined);
      setResult(link);
      onLinkCreated(link);
      setOriginalUrl("");
      setCustomAlias("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create short URL");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.shortUrl);
    setCopied(true);

    if (copyBtnRef.current) {
      animate(copyBtnRef.current, {
        scale: [1, 1.2, 1],
        rotate: [0, 10, 0],
        duration: 400,
        ease: "outExpo",
      });
    }

    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!result) return;

    const link = document.createElement("a");
    link.href = result.qrCodeDataUrl;
    link.download = `${result.shortCode}-qr.png`;
    link.click();
  };

  return (
    <GlassCard variant="glow" className="p-6 sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600">
          <Wand2 className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Shorten a URL</h2>
          <p className="text-sm text-slate-400">Transform long links instantly</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="originalUrl" className="text-slate-300">
            Original URL
          </Label>
          <div className="relative">
            <Link2 className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <Input
              id="originalUrl"
              type="url"
              placeholder="https://example.com/your-long-url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required
              className="border-white/10 bg-slate-900/72 pl-10 text-white placeholder:text-slate-500 focus:border-cyan-400/70 focus:ring-cyan-500/20"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="customAlias" className="text-slate-300">
            Custom Alias{" "}
            <span className="text-slate-500">(optional)</span>
          </Label>
          <Input
            id="customAlias"
            type="text"
            placeholder="my-custom-link"
            value={customAlias}
            onChange={(e) => setCustomAlias(e.target.value)}
            className="border-white/10 bg-slate-900/72 text-white placeholder:text-slate-500 focus:border-cyan-400/70 focus:ring-cyan-500/20"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-400">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={loading || !originalUrl}
          className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 py-5 text-base font-semibold text-white shadow-[0_16px_40px_rgba(56,189,248,0.24)] hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-5 w-5" />
              Shorten URL
            </>
          )}
        </Button>
      </form>

      {/* Result */}
      {result && (
        <div
          ref={resultRef}
          className="mt-6 rounded-2xl border border-cyan-400/16 bg-gradient-to-r from-cyan-500/10 to-indigo-500/12 p-4 opacity-0"
        >
          <div className="mb-2 text-sm font-medium text-cyan-400">
            Your short link is ready!
          </div>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-slate-900/78 px-4 py-3">
            <span className="truncate font-mono text-lg font-semibold text-white">
              {result.shortUrl}
            </span>
            <div className="flex items-center gap-2">
              <button
                ref={copyBtnRef}
                onClick={handleCopy}
                className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check className="h-5 w-5 text-green-400" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </button>
              <a
                href={result.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                title="Open in new tab"
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-500 truncate">
            Original: {result.originalUrl}
          </p>

          <div className="mt-4 rounded-2xl border border-white/8 bg-slate-950/42 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-white">QR Code</p>
                <p className="mt-1 text-xs text-slate-400">
                  Scan or download to open this short link quickly
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleDownloadQr}
                className="border-white/10 bg-slate-900/70 text-slate-200 hover:bg-slate-800"
              >
                <Download className="mr-2 h-4 w-4" />
                Download QR
              </Button>
            </div>

            <div className="mt-4 flex justify-center rounded-xl border border-white/8 bg-white p-4">
              <QRCode
                value={result.shortUrl}
                size={160}
                fgColor="#020617"
                bgColor="#ffffff"
                className="h-40 w-40"
              />
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
