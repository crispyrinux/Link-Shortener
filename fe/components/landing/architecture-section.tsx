"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { User, Globe, Server, Database, Shield, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/glass-card";

const architectureLayers = [
  {
    icon: User,
    label: "User",
    description: "Browser requests",
    color: "from-cyan-500 to-cyan-400",
  },
  {
    icon: Globe,
    label: "Next.js",
    description: "Frontend & SSR",
    color: "from-blue-500 to-blue-400",
  },
  {
    icon: Server,
    label: "NestJS API",
    description: "REST endpoints",
    color: "from-indigo-500 to-indigo-400",
  },
  {
    icon: Database,
    label: "PostgreSQL",
    description: "Data storage",
    color: "from-purple-500 to-purple-400",
  },
  {
    icon: Shield,
    label: "Cookie Auth",
    description: "Secure sessions",
    color: "from-pink-500 to-pink-400",
  },
];

export function ArchitectureSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(sectionRef.current?.querySelectorAll(".arch-item") ?? [], {
              opacity: [0, 1],
              translateX: [-30, 0],
              delay: stagger(150),
              duration: 800,
              ease: "outExpo",
            });

            animate(sectionRef.current?.querySelectorAll(".arch-arrow") ?? [], {
              opacity: [0, 1],
              scaleX: [0, 1],
              delay: stagger(150, { start: 100 }),
              duration: 600,
              ease: "outExpo",
            });

            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold uppercase tracking-wide text-cyan-400">
            Architecture
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Production-grade tech stack
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            Built with modern, scalable technologies for reliability and
            performance.
          </p>
        </div>

        <GlassCard className="mx-auto mt-16 max-w-4xl p-8">
          <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-2">
            {architectureLayers.map((layer, index) => (
              <div key={layer.label} className="flex items-center">
                <div className="arch-item flex flex-col items-center opacity-0">
                  <div
                    className={`mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${layer.color} shadow-lg shadow-white/10`}
                  >
                    <layer.icon className="h-8 w-8 text-white" />
                  </div>
                  <span className="font-semibold text-white">{layer.label}</span>
                  <span className="text-sm text-slate-400">
                    {layer.description}
                  </span>
                </div>
                {index < architectureLayers.length - 1 && (
                  <div className="arch-arrow mx-4 hidden opacity-0 lg:block">
                    <ArrowRight className="h-6 w-6 text-slate-600" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">TypeScript</div>
              <div className="text-sm text-slate-400">End-to-end type safety</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-400">REST API</div>
              <div className="text-sm text-slate-400">Clean API design</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">JWT Tokens</div>
              <div className="text-sm text-slate-400">Secure authentication</div>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
