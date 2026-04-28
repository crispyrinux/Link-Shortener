"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { animate, stagger } from "animejs";
import {
  AlertCircle,
  BarChart3,
  Clock,
  Link2,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { AnimatedBackground } from "@/components/animated-background";
import { UrlShortener } from "@/components/dashboard/url-shortener";
import { RecentLinks } from "@/components/dashboard/recent-links";
import { GlassCard } from "@/components/glass-card";
import { CoreSpinLoader } from "@/components/ui/spinner";
import { useAuth } from "@/lib/auth-context";
import { getMyUrls, type ShortUrl } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [recentLinks, setRecentLinks] = useState<ShortUrl[]>([]);
  const [linksLoading, setLinksLoading] = useState(true);
  const [linksError, setLinksError] = useState<string | null>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  useEffect(() => {
    let isMounted = true;

    async function loadUrls() {
      if (!user) {
        setRecentLinks([]);
        setLinksLoading(false);
        return;
      }

      try {
        setLinksLoading(true);
        setLinksError(null);
        const urls = await getMyUrls();

        if (isMounted) {
          setRecentLinks(urls);
        }
      } catch (error) {
        if (isMounted) {
          setLinksError(
            error instanceof Error ? error.message : "Failed to load your links"
          );
        }
      } finally {
        if (isMounted) {
          setLinksLoading(false);
        }
      }
    }

    if (!loading) {
      void loadUrls();
    }

    return () => {
      isMounted = false;
    };
  }, [user, loading]);

  useEffect(() => {
    if (!loading && !linksLoading && user && dashboardRef.current) {
      animate(dashboardRef.current.querySelectorAll(".dashboard-card"), {
        opacity: [0, 1],
        translateY: [30, 0],
        delay: stagger(100),
        duration: 700,
        ease: "outExpo",
      });
    }
  }, [loading, linksLoading, user]);

  const handleLinkCreated = (link: ShortUrl) => {
    setRecentLinks((prev) => [link, ...prev.filter((item) => item.id !== link.id)]);
  };

  if (loading || linksLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <AnimatedBackground />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <CoreSpinLoader />
          <p className="text-center text-sm text-slate-400">
            {loading ? "Preparing dashboard session" : "Preparing your latest links"}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const totalClicks = recentLinks.reduce((sum, link) => sum + link.clickCount, 0);
  const latestClicks = recentLinks[0]?.clickCount ?? 0;
  const averageClicks =
    recentLinks.length > 0 ? Math.round(totalClicks / recentLinks.length) : "—";
  const latestClicksCaption = recentLinks[0]
    ? `Latest link: ${recentLinks[0].shortCode}`
    : "No stats yet";
  const averageClicksCaption =
    recentLinks.length > 0 ? "Average clicks per link" : "Create a link to begin";

  return (
    <div className="min-h-screen bg-slate-950">
      <AnimatedBackground />
      <Navbar />

      <main ref={dashboardRef} className="relative z-10 pb-16 pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-cyan-400">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-medium">Welcome back</span>
            </div>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              Hello, {user.name.split(" ")[0]}!
            </h1>
            <p className="mt-2 text-slate-400">
              Manage your short links and open detailed stats in a dedicated page
            </p>
          </div>

          <div className="dashboard-card mb-8 grid gap-4 sm:grid-cols-3 opacity-0">
            <GlassCard className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20">
                  <Link2 className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {recentLinks.length}
                  </div>
                  <div className="text-sm text-slate-400">Links Created</div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20">
                  <BarChart3 className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {latestClicks}
                  </div>
                  <div className="text-sm text-slate-400">{latestClicksCaption}</div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20">
                  <Clock className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {averageClicks}
                  </div>
                  <div className="text-sm text-slate-400">
                    {averageClicksCaption}
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          {linksError && (
            <div className="dashboard-card mb-8 opacity-0">
              <GlassCard className="flex items-center gap-3 border border-red-500/20 bg-red-500/10 p-4 text-red-300">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-sm">{linksError}</p>
              </GlassCard>
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="dashboard-card opacity-0">
                <UrlShortener onLinkCreated={handleLinkCreated} />
              </div>
            </div>

            <div className="dashboard-card opacity-0">
              <RecentLinks links={recentLinks} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
