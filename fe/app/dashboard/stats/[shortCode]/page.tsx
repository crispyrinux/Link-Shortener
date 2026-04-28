"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  Calendar,
  Check,
  Clock3,
  Copy,
  Download,
  ExternalLink,
  Link2,
  PencilLine,
  Save,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { AnimatedBackground } from "@/components/animated-background";
import { GlassCard } from "@/components/glass-card";
import { Navbar } from "@/components/navbar";
import { QRCode } from "@/components/ui/qr-code";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CoreSpinLoader } from "@/components/ui/spinner";
import {
  deleteShortUrl,
  getStats,
  type UrlStats,
  updateShortUrl,
} from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

const QR_FG_COLOR = "#0b1533";
const QR_BG_COLOR = "#e8fbff";

export default function LinkStatsPage() {
  const params = useParams<{ shortCode: string }>();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const shortCode = decodeURIComponent(params.shortCode);

  const [link, setLink] = useState<UrlStats | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth");
    }
  }, [authLoading, router, user]);

  useEffect(() => {
    let isMounted = true;

    async function loadLinkStats() {
      if (!user) {
        return;
      }

      try {
        setPageLoading(true);
        setPageError(null);
        const stats = await getStats(shortCode);

        if (!isMounted) {
          return;
        }

        setLink(stats);
        setOriginalUrl(stats.originalUrl);
        setCustomAlias(stats.shortCode);
      } catch (loadError) {
        if (isMounted) {
          setPageError(
            loadError instanceof Error ? loadError.message : "Failed to load link stats"
          );
        }
      } finally {
        if (isMounted) {
          setPageLoading(false);
        }
      }
    }

    if (!authLoading && user) {
      void loadLinkStats();
    }

    return () => {
      isMounted = false;
    };
  }, [authLoading, shortCode, user]);

  const createdLabel = useMemo(() => {
    if (!link) {
      return "";
    }

    return new Date(link.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [link]);

  const updatedLabel = useMemo(() => {
    if (!link?.updatedAt) {
      return "";
    }

    return new Date(link.updatedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [link]);

  const handleCopyLink = async () => {
    if (!link) {
      return;
    }

    await navigator.clipboard.writeText(link.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDownloadQr = () => {
    if (!link) {
      return;
    }

    const downloadLink = document.createElement("a");
    downloadLink.href = link.qrCodeDataUrl;
    downloadLink.download = `${link.shortCode}-qr.png`;
    downloadLink.click();
  };

  const handleUpdateLink = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!link) {
      return;
    }

    setSaving(true);
    setEditError(null);

    try {
      const updated = await updateShortUrl(link.id, {
        originalUrl: originalUrl.trim(),
        customAlias: customAlias.trim(),
      });

      setLink(updated);
      setOriginalUrl(updated.originalUrl);
      setCustomAlias(updated.shortCode);
      router.replace(`/dashboard/stats/${encodeURIComponent(updated.shortCode)}`);
    } catch (updateError) {
      setEditError(
        updateError instanceof Error ? updateError.message : "Failed to update link"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLink = async () => {
    if (!link) {
      return;
    }

    setDeleting(true);
    setDeleteError(null);

    try {
      await deleteShortUrl(link.id);
      router.push("/dashboard");
    } catch (deleteError) {
      setDeleteError(
        deleteError instanceof Error ? deleteError.message : "Failed to delete link"
      );
      setDeleting(false);
    }
  };

  if (authLoading || pageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <AnimatedBackground />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <CoreSpinLoader />
          <p className="text-center text-sm text-slate-400">
            Preparing link insights and actions
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 pb-16 pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to dashboard
              </Link>
              <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                Link Stats
              </h1>
              <p className="mt-2 max-w-2xl text-slate-400">
                View analytics, customize the destination, refresh the alias, and
                manage the QR code in one focused page.
              </p>
            </div>

            {link && (
              <div className="rounded-2xl border border-cyan-400/14 bg-slate-950/68 px-4 py-3 backdrop-blur-xl">
                <div className="text-xs uppercase tracking-[0.28em] text-slate-500">
                  Active Alias
                </div>
                <div className="mt-1 font-mono text-lg font-semibold text-cyan-300">
                  {link.shortCode}
                </div>
              </div>
            )}
          </div>

          {pageError && (
            <div className="mb-8">
              <GlassCard className="flex items-center gap-3 border border-red-500/20 bg-red-500/10 p-4 text-red-200">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <p className="text-sm">{pageError}</p>
              </GlassCard>
            </div>
          )}

          {!link ? (
            <GlassCard className="p-8">
              <div className="text-white">The requested link could not be loaded.</div>
            </GlassCard>
          ) : (
            <>
              <div className="mb-8 grid gap-4 sm:grid-cols-3">
                <GlassCard className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/18">
                      <BarChart3 className="h-5 w-5 text-cyan-300" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {link.clickCount}
                      </div>
                      <div className="text-sm text-slate-400">Total Clicks</div>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/18">
                      <Calendar className="h-5 w-5 text-indigo-300" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{createdLabel}</div>
                      <div className="text-sm text-slate-400">Created</div>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/18">
                      <Clock3 className="h-5 w-5 text-purple-300" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {updatedLabel || "Just now"}
                      </div>
                      <div className="text-sm text-slate-400">Last Updated</div>
                    </div>
                  </div>
                </GlassCard>
              </div>

              <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
                <div className="space-y-8">
                  <GlassCard variant="glow" className="p-6">
                    <div className="mb-6 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600">
                        <Link2 className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Link Overview</h2>
                        <p className="text-sm text-slate-400">
                          Your public short link and its destination
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-2xl border border-cyan-400/14 bg-slate-900/72 p-4">
                        <div className="text-xs uppercase tracking-[0.28em] text-slate-500">
                          Short Link
                        </div>
                        <a
                          href={link.shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 block break-all font-mono text-lg font-semibold text-cyan-300 transition-colors hover:text-cyan-200"
                        >
                          {link.shortUrl}
                        </a>
                      </div>

                      <div className="rounded-2xl border border-white/8 bg-slate-950/52 p-4">
                        <div className="text-xs uppercase tracking-[0.28em] text-slate-500">
                          Original URL
                        </div>
                        <a
                          href={link.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 block break-all text-sm text-slate-200 transition-colors hover:text-white"
                        >
                          {link.originalUrl}
                        </a>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          onClick={handleCopyLink}
                          className="bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:from-cyan-400 hover:to-indigo-500"
                        >
                          {copied ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                          {copied ? "Copied" : "Copy Link"}
                        </Button>

                        <Button
                          asChild
                          variant="ghost"
                          className="border border-white/10 bg-slate-900/70 text-slate-200 hover:bg-white/10 hover:text-white"
                        >
                          <a href={link.shortUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                            Open Link
                          </a>
                        </Button>
                      </div>
                    </div>
                  </GlassCard>

                  <GlassCard className="p-6">
                    <div className="mb-6 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-600">
                        <PencilLine className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Edit Link</h2>
                        <p className="text-sm text-slate-400">
                          Update the destination or refresh the public alias
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleUpdateLink} className="space-y-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="stats-original-url"
                          className="text-xs font-medium uppercase tracking-[0.28em] text-slate-500"
                        >
                          Original URL
                        </label>
                        <Input
                          id="stats-original-url"
                          type="url"
                          value={originalUrl}
                          onChange={(event) => setOriginalUrl(event.target.value)}
                          className="h-12 rounded-xl border-white/10 bg-slate-950/72 text-white placeholder:text-slate-500 focus:border-cyan-400/70 focus:ring-cyan-500/20"
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="stats-short-alias"
                          className="text-xs font-medium uppercase tracking-[0.28em] text-slate-500"
                        >
                          Short Alias
                        </label>
                        <Input
                          id="stats-short-alias"
                          type="text"
                          value={customAlias}
                          onChange={(event) => setCustomAlias(event.target.value)}
                          className="h-12 rounded-xl border-white/10 bg-slate-950/72 font-mono text-white placeholder:text-slate-500 focus:border-cyan-400/70 focus:ring-cyan-500/20"
                        />
                      </div>

                      {editError && (
                        <div className="rounded-2xl border border-red-500/24 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                            <p>{editError}</p>
                          </div>
                        </div>
                      )}

                      <Button
                        type="submit"
                        disabled={saving || !originalUrl.trim() || !customAlias.trim()}
                        className="bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:from-cyan-400 hover:to-indigo-500"
                      >
                        <Save className="h-4 w-4" />
                        {saving ? "Saving Changes..." : "Save Changes"}
                      </Button>
                    </form>
                  </GlassCard>

                  <GlassCard className="border border-red-500/16 bg-red-500/8 p-6">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/18">
                        <ShieldAlert className="h-5 w-5 text-red-300" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Danger Zone</h2>
                        <p className="text-sm text-red-200/70">
                          Deleting the link will permanently remove this short URL
                        </p>
                      </div>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          className="border border-red-400/24 bg-red-500/10 text-red-200 hover:bg-red-500/18 hover:text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete Link
                        </Button>
                      </DialogTrigger>

                      <DialogContent
                        showCloseButton={false}
                        className="max-w-md rounded-[1.75rem] border border-cyan-400/14 bg-slate-950/92 p-0 shadow-[0_32px_90px_rgba(2,6,23,0.72)] backdrop-blur-2xl"
                      >
                        <div className="relative overflow-hidden rounded-[1.75rem] border border-white/6 bg-[linear-gradient(180deg,rgba(34,211,238,0.08),rgba(14,23,46,0.96)_28%,rgba(10,15,31,0.98))] p-6">
                          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
                          <DialogHeader className="text-left">
                            <DialogTitle className="text-xl text-white">
                              Delete this short link?
                            </DialogTitle>
                            <DialogDescription className="mt-2 text-sm leading-6 text-slate-400">
                              This action will remove <span className="font-mono text-cyan-200">{link.shortCode}</span> and
                              the stats tied to it from your dashboard. This cannot be undone.
                            </DialogDescription>
                          </DialogHeader>

                          <div className="mt-5 rounded-2xl border border-white/8 bg-slate-900/70 p-4">
                            <div className="text-xs uppercase tracking-[0.28em] text-slate-500">
                              Link to remove
                            </div>
                            <div className="mt-2 break-all font-mono text-sm font-semibold text-white">
                              {link.shortUrl}
                            </div>
                          </div>

                          {deleteError && (
                            <div className="mt-4 rounded-2xl border border-red-500/24 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                              <div className="flex items-start gap-3">
                                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                                <p>{deleteError}</p>
                              </div>
                            </div>
                          )}

                          <DialogFooter className="mt-6 sm:justify-end">
                            <DialogClose asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                className="border border-white/10 bg-slate-900/72 text-slate-200 hover:bg-white/10 hover:text-white"
                              >
                                Cancel
                              </Button>
                            </DialogClose>

                            <Button
                              type="button"
                              onClick={handleDeleteLink}
                              disabled={deleting}
                              className="bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-400 hover:to-pink-500"
                            >
                              <Trash2 className="h-4 w-4" />
                              {deleting ? "Deleting..." : "Delete Permanently"}
                            </Button>
                          </DialogFooter>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </GlassCard>
                </div>

                <div className="space-y-8">
                  <GlassCard variant="glow" className="p-6">
                    <div className="mb-6 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-fuchsia-500">
                        <Download className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">QR Code</h2>
                        <p className="text-sm text-slate-400">
                          Theme-matched QR with strong contrast for easier scanning
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[1.75rem] border border-cyan-400/16 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_44%),linear-gradient(180deg,rgba(14,23,46,0.95),rgba(7,11,24,0.98))] p-5">
                      <div className="rounded-[1.35rem] border border-cyan-300/14 bg-slate-950/60 p-4">
                        <div className="rounded-[1.25rem] border border-cyan-300/20 bg-[#08111f] p-4 shadow-[0_0_0_1px_rgba(34,211,238,0.05),0_0_32px_rgba(34,211,238,0.08)]">
                          <QRCode
                            value={link.shortUrl}
                            size={268}
                            fgColor={QR_FG_COLOR}
                            bgColor={QR_BG_COLOR}
                            className="h-full w-full"
                          />
                        </div>
                      </div>

                      <div className="mt-4 grid gap-2 sm:grid-cols-2">
                        <Button
                          type="button"
                          onClick={handleDownloadQr}
                          className="bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:from-cyan-400 hover:to-indigo-500"
                        >
                          <Download className="h-4 w-4" />
                          Download QR
                        </Button>

                        <Button
                          asChild
                          variant="ghost"
                          className="border border-white/10 bg-slate-900/72 text-slate-200 hover:bg-white/10 hover:text-white"
                        >
                          <a href={link.shortUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                            Open Short Link
                          </a>
                        </Button>
                      </div>
                    </div>
                  </GlassCard>

                  <GlassCard className="p-6">
                    <div className="mb-6 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                        <BarChart3 className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Performance Notes</h2>
                        <p className="text-sm text-slate-400">
                          The QR uses a softer light-cyan background and deep navy modules
                          so it stays closer to your visual theme without falling back to
                          plain black and white.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm leading-6 text-slate-300">
                      <p>
                        I matched the QR to your theme using a pale cyan surface and a dark
                        navy foreground. This keeps the contrast high enough to stay
                        scan-friendly while blending with the neon dashboard palette.
                      </p>
                      <p>
                        If you want a stronger futuristic look later, the next step would be
                        customizing finder colors separately, for example cyan and purple
                        corners, while keeping the data modules dark for reliability.
                      </p>
                    </div>
                  </GlassCard>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
