"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-24">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-96 w-96 rounded-full bg-cyan-500/12 blur-3xl" />
        <div className="absolute h-72 w-72 rounded-full bg-indigo-500/12 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2">
          <Sparkles className="h-4 w-4 text-cyan-400" />
          <span className="text-sm font-medium text-cyan-300">
            Ready to get started?
          </span>
        </div>

        <h2 className="mt-8 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Start shortening your links{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
            today
          </span>
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
          Join thousands of users who trust LinkNova for their URL shortening
          needs. Create your first short link in seconds.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/auth">
            <Button
              size="lg"
              className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-indigo-600 px-8 text-lg font-semibold text-white shadow-2xl shadow-cyan-500/25 transition-all hover:shadow-cyan-500/40"
            >
              Create free account
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button
              size="lg"
              variant="outline"
              className="border-slate-700 bg-transparent px-8 text-lg text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Explore dashboard
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
