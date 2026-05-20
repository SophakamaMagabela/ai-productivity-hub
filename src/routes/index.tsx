import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Sparkles,
  MessagesSquare,
  FileText,
  CheckSquare,
  Video,
  Mail,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppLogo } from "@/components/AppLogo";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aria — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Automate emails, summarize meetings, organize tasks, and ship more focused work with Aria, your AI workplace assistant.",
      },
      { property: "og:title", content: "Aria — AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "AI chat, document summaries, smart email drafting, meeting recaps, and task automation in one workspace.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: MessagesSquare, title: "AI Chat Assistant", desc: "Draft, summarize, decide. A conversational copilot trained for the workplace." },
  { icon: FileText, title: "Document Intelligence", desc: "Drop a PDF, DOCX or TXT — get key points, action items and answers." },
  { icon: Mail, title: "Smart Email Generator", desc: "Tone-perfect replies, follow-ups and invites in a single click." },
  { icon: CheckSquare, title: "Task Automation", desc: "Turn meeting notes into prioritized, scheduled action items." },
  { icon: Video, title: "Meeting Recaps", desc: "Decisions, owners, and a ready-to-send follow-up email." },
  { icon: Sparkles, title: "Productivity Insights", desc: "AI-generated nudges to focus on what moves the needle." },
];

function Landing() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <div className="relative overflow-hidden">
        <div className="bg-aurora pointer-events-none absolute inset-0 opacity-70" />
        <div className="relative">
          {/* Nav */}
          <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
            <AppLogo />
            <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
              <a href="#features" className="hover:text-foreground">Features</a>
              <a href="#how" className="hover:text-foreground">How it works</a>
              <a href="#trust" className="hover:text-foreground">Security</a>
            </nav>
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link to="/dashboard">Sign in</Link>
              </Button>
              <Button asChild className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
                <Link to="/dashboard">
                  Launch app <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </header>

          {/* Hero */}
          <section className="mx-auto grid max-w-7xl gap-10 px-6 pb-20 pt-10 md:grid-cols-2 md:pt-20">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col justify-center"
            >
              <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
                <Zap className="h-3.5 w-3.5 text-primary" />
                Your AI workplace copilot
              </span>
              <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
                Less busywork.
                <br />
                <span className="text-gradient">More deep work.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                Aria turns scattered emails, meetings and documents into clear summaries,
                ready-to-send replies and prioritized action items — so your team ships what matters.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-90">
                  <Link to="/dashboard">
                    Open workspace <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/chat">Try the AI assistant</Link>
                </Button>
              </div>
              <div className="mt-10 flex items-center gap-6 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Privacy-first</span>
                <span>•</span>
                <span>Works with PDF, DOCX, TXT</span>
                <span>•</span>
                <span>Real-time streaming</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-primary opacity-30 blur-3xl" />
              <div className="overflow-hidden rounded-3xl border border-border shadow-elegant">
                <img src={hero} alt="Aria productivity dashboard" width={1600} height={1100} className="w-full" />
              </div>
            </motion.div>
          </section>

          {/* Features */}
          <section id="features" className="mx-auto max-w-7xl px-6 pb-24">
            <div className="mb-12 flex items-end justify-between">
              <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
                Everything you need, in one workspace
              </h2>
              <Link to="/dashboard" className="hidden text-sm text-muted-foreground hover:text-foreground md:inline">
                Explore all features →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 backdrop-blur transition hover:border-primary/40 hover:shadow-card"
                >
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="mx-auto max-w-5xl px-6 pb-24">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card/60 p-10 text-center backdrop-blur md:p-16">
              <div className="bg-aurora absolute inset-0 -z-10 opacity-60" />
              <h2 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">
                Ready to reclaim your week?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Open the workspace and let Aria handle the busywork. No setup, no friction.
              </p>
              <Button asChild size="lg" className="mt-8 bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-90">
                <Link to="/dashboard">
                  Launch Aria <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </section>

          <footer className="border-t border-border">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 text-xs text-muted-foreground">
              <span>© {new Date().getFullYear()} Aria. Built with Lovable.</span>
              <span>Made for focused work.</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
