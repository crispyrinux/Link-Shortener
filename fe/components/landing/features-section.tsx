"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import {
  Link2,
  Wand2,
  Shield,
  BarChart3,
  Rocket,
  Layers,
} from "lucide-react";
import { GlassCard } from "@/components/glass-card";

const features = [
  {
    icon: Link2,
    title: "Instant URL Shortening",
    description:
      "Transform long, unwieldy URLs into clean, memorable short links in milliseconds.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: Wand2,
    title: "Custom Aliases",
    description:
      "Create branded, meaningful short links with your own custom aliases.",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    icon: Shield,
    title: "Secure Cookie Auth",
    description:
      "Enterprise-grade security with HTTP-only cookie authentication.",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: BarChart3,
    title: "Click Analytics",
    description:
      "Track click counts and gain insights into your link performance.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Rocket,
    title: "Blazing Fast Redirects",
    description:
      "Sub-50ms redirect times ensure your users never wait.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Layers,
    title: "Production Ready",
    description:
      "Built with NestJS, PostgreSQL, and Next.js for reliability at scale.",
    gradient: "from-rose-500 to-orange-500",
  },
];

export function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(sectionRef.current?.querySelectorAll(".feature-card") ?? [], {
              opacity: [0, 1],
              translateY: [40, 0],
              delay: stagger(100),
              duration: 800,
              ease: "outExpo",
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,6,23,0.04),rgba(2,6,23,0.16),rgba(2,6,23,0.04))]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold uppercase tracking-wide text-cyan-400">
            Features
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need to manage your links
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            A complete URL shortening solution with powerful features designed
            for modern teams and businesses.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <GlassCard
              key={feature.title}
              className="feature-card group cursor-default p-6 opacity-0 transition-all hover:border-cyan-400/16 hover:bg-slate-900/58"
            >
              <div
                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg`}
              >
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">
                {feature.title}
              </h3>
              <p className="text-slate-400">{feature.description}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
