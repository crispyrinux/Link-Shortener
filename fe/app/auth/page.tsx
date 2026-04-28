"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { animate, stagger } from "animejs";
import { Eye, EyeOff, Mail, Lock, User, Loader2, AlertCircle, Link2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/glass-card";
import { AnimatedBackground } from "@/components/animated-background";
import { registerUser, loginUser } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

type AuthMode = "login" | "register";

export default function AuthPage() {
  const router = useRouter();
  const { setUser, user } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const cardRef = useRef<HTMLDivElement>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Entry animation
  useEffect(() => {
    if (cardRef.current) {
      animate(cardRef.current, {
        opacity: [0, 1],
        translateY: [40, 0],
        scale: [0.96, 1],
        duration: 800,
        ease: "outExpo",
      });
    }
  }, []);

  // Mode switch animation
  useEffect(() => {
    if (cardRef.current) {
      animate(cardRef.current.querySelectorAll(".form-field"), {
        opacity: [0, 1],
        translateY: [20, 0],
        delay: stagger(50),
        duration: 400,
        ease: "outExpo",
      });
    }
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "register") {
        const { user: userData } = await registerUser(
          formData.name,
          formData.email,
          formData.password
        );
        setUser(userData);
      } else {
        const { user: userData } = await loginUser(
          formData.email,
          formData.password
        );
        setUser(userData);
      }
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError(null);
    setFormData({ name: "", email: "", password: "" });
  };

  return (
    <div className="relative min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/25">
            <Link2 className="h-6 w-6 text-white" />
            <Sparkles className="absolute -right-1 -top-1 h-4 w-4 text-yellow-400" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            LinkNova
          </span>
        </Link>

        <GlassCard
          ref={cardRef}
          variant="glow"
          className="p-8 opacity-0 shadow-[0_24px_90px_rgba(8,15,40,0.65)]"
        >
          {/* Tab switcher */}
          <div className="mb-8 flex rounded-2xl border border-white/10 bg-slate-950/45 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 rounded-md py-2.5 text-sm font-medium transition-all ${
                mode === "login"
                  ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-[0_12px_28px_rgba(59,130,246,0.28)]"
                  : "text-slate-400/90 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 rounded-md py-2.5 text-sm font-medium transition-all ${
                mode === "register"
                  ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-[0_12px_28px_rgba(59,130,246,0.28)]"
                  : "text-slate-400/90 hover:text-white"
              }`}
            >
              Create Account
            </button>
          </div>

          <h1 className="mb-2 text-2xl font-bold text-white">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mb-6 text-slate-400">
            {mode === "login"
              ? "Sign in to access your dashboard"
              : "Start shortening URLs in seconds"}
          </p>

          {/* Error message */}
          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-400">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "register" && (
              <div className="form-field space-y-2">
                <Label htmlFor="name" className="text-slate-300">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="border-white/10 bg-slate-900/70 pl-10 text-white placeholder:text-slate-500 focus:border-cyan-400/70 focus:ring-cyan-500/20"
                  />
                </div>
              </div>
            )}

            <div className="form-field space-y-2">
              <Label htmlFor="email" className="text-slate-300">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="border-white/10 bg-slate-900/70 pl-10 text-white placeholder:text-slate-500 focus:border-cyan-400/70 focus:ring-cyan-500/20"
                />
              </div>
            </div>

            <div className="form-field space-y-2">
              <Label htmlFor="password" className="text-slate-300">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  className="border-white/10 bg-slate-900/70 pl-10 pr-10 text-white placeholder:text-slate-500 focus:border-cyan-400/70 focus:ring-cyan-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="form-field w-full bg-gradient-to-r from-cyan-500 to-indigo-600 py-6 text-lg font-semibold text-white shadow-[0_16px_40px_rgba(56,189,248,0.24)] hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {mode === "login" ? "Signing in..." : "Creating account..."}
                </>
              ) : mode === "login" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  onClick={toggleMode}
                  className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={toggleMode}
                  className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
