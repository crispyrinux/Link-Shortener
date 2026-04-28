"use client";

import { useEffect, useRef } from "react";
import { createTimeline, stagger } from "animejs";
import Link from "next/link";
import { ArrowRight, Zap, BarChart3, Link2, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/glass-card";

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current || !mockupRef.current) return;

    const timeline = createTimeline({
      defaults: {
        ease: "outExpo",
      },
    });

    timeline
      .add(heroRef.current.querySelectorAll(".hero-animate"), {
        opacity: [0, 1],
        translateY: [40, 0],
        delay: stagger(100),
        duration: 1000,
      })
      .add(
        mockupRef.current,
        {
          opacity: [0, 1],
          translateY: [60, 0],
          scale: [0.95, 1],
          duration: 1200,
        },
        "-=600"
      );
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen overflow-hidden pt-32 pb-20"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="hero-animate mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2">
            <Zap className="h-4 w-4 text-cyan-400" />
            <span className="text-sm font-medium text-cyan-300">
              Lightning-fast URL shortening
            </span>
          </div>

          {/* Headline */}
          <h1 className="hero-animate mx-auto max-w-4xl text-balance text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Short links.{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              Big insights.
            </span>{" "}
            Built for speed.
          </h1>

          {/* Subheadline */}
          <p className="hero-animate mx-auto mt-6 max-w-2xl text-pretty text-lg text-slate-400 sm:text-xl">
            Transform long URLs into powerful short links. Track clicks,
            customize aliases, and gain valuable insights with our
            enterprise-grade URL shortener.
          </p>

          {/* CTA Buttons */}
          <div className="hero-animate mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/auth">
              <Button
                size="lg"
                className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-indigo-600 px-8 text-lg font-semibold text-white shadow-2xl shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40 hover:from-cyan-400 hover:to-indigo-500"
              >
                Start shortening
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="border-slate-700 bg-slate-900/50 px-8 text-lg text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                View dashboard
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="hero-animate mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-8">
            {[
              { label: "Fast Redirects", value: "<50ms", icon: Zap },
              { label: "Cookie Auth", value: "Secure", icon: Link2 },
              { label: "Analytics Ready", value: "Real-time", icon: BarChart3 },
              { label: "Custom Aliases", value: "Unlimited", icon: Link2 },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 shadow-[0_12px_34px_rgba(2,6,23,0.3)] backdrop-blur-md"
              >
                <stat.icon className="mx-auto mb-2 h-5 w-5 text-cyan-400" />
                <div className="text-xl font-bold text-white sm:text-2xl">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mockup Card */}
        <div ref={mockupRef} className="mt-20 opacity-0">
          <GlassCard
            variant="glow"
            className="mx-auto max-w-2xl p-6 sm:p-8 shadow-[0_28px_100px_rgba(8,15,40,0.6)]"
          >
            <div className="mb-4 flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="ml-4 text-sm text-slate-500">LinkNova Shortener</span>
            </div>
            
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/8 bg-slate-950/42 p-4">
                <label className="mb-2 block text-sm text-slate-400">Original URL</label>
                <div className="flex items-center gap-2 rounded-xl border border-white/8 bg-slate-900/72 px-4 py-3 text-slate-300">
                  <Link2 className="h-4 w-4 text-slate-500" />
                  <span className="truncate text-sm">
                    https://example.com/very-long-url-that-needs-to-be-shortened/article/2024
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 p-[1px]">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-900">
                    <ArrowRight className="h-4 w-4 text-cyan-400" />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-cyan-400/16 bg-gradient-to-r from-cyan-500/10 to-indigo-500/12 p-4">
                <label className="mb-2 block text-sm text-cyan-400">Your Short Link</label>
                <div className="flex items-center justify-between gap-2 rounded-xl border border-white/8 bg-slate-900/78 px-4 py-3">
                  <span className="font-mono text-lg font-semibold text-white">
                    linknova.io/my-link
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
                      <Copy className="h-4 w-4" />
                    </button>
                    <button className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Floating mini cards */}
          <div className="relative mx-auto max-w-3xl">
            <div className="absolute -left-4 top-0 -translate-y-1/2 sm:-left-16">
              <GlassCard className="p-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-green-400" />
                  <span className="text-sm font-medium text-white">+127 clicks</span>
                </div>
              </GlassCard>
            </div>
            <div className="absolute -right-4 top-1/3 sm:-right-16">
              <GlassCard className="p-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm font-medium text-white">47ms redirect</span>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
