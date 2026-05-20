import { createFileRoute, Link } from "@tanstack/react-router";
import { useLocalStorage, type Task } from "@/lib/storage";
import {
  MessagesSquare,
  FileText,
  CheckSquare,
  Video,
  Mail,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Aria" }] }),
  component: Dashboard,
});

const quickActions = [
  { to: "/chat", icon: MessagesSquare, title: "Ask Aria", desc: "Start a conversation" },
  { to: "/documents", icon: FileText, title: "Summarize a doc", desc: "PDF, DOCX or TXT" },
  { to: "/email", icon: Mail, title: "Draft an email", desc: "Any tone, any intent" },
  { to: "/meetings", icon: Video, title: "Recap a meeting", desc: "Notes → action items" },
] as const;

function Dashboard() {
  const [tasks] = useLocalStorage<Task[]>("aria.tasks", []);
  const open = tasks.filter((t) => !t.done);
  const done = tasks.length - open.length;
  const high = open.filter((t) => t.priority === "high").length;

  const stats = [
    { label: "Open tasks", value: open.length, icon: CheckSquare, accent: "from-primary to-primary-glow" },
    { label: "Completed", value: done, icon: TrendingUp, accent: "from-success to-primary-glow" },
    { label: "High priority", value: high, icon: Clock, accent: "from-warning to-primary" },
    { label: "AI runs today", value: "∞", icon: Sparkles, accent: "from-primary-glow to-primary" },
  ];

  return (
    <div className="relative">
      <div className="bg-aurora pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 opacity-50" />
      <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        <header>
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Let's make today <span className="text-gradient">remarkable.</span>
          </h1>
        </header>

        {/* Stats */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border border-border bg-card/70 p-5 backdrop-blur"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${s.accent} text-primary-foreground`}>
                  <s.icon className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-3 font-display text-3xl font-semibold">{s.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Quick actions */}
        <section>
          <h2 className="mb-3 font-display text-lg font-semibold">Quick actions</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((q) => (
              <Link
                key={q.to}
                to={q.to}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card/70 p-5 backdrop-blur transition hover:border-primary/40 hover:shadow-card"
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                  <q.icon className="h-5 w-5" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-display font-semibold">{q.title}</div>
                    <div className="text-xs text-muted-foreground">{q.desc}</div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Two-col: tasks + AI insights */}
        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card/70 p-5 backdrop-blur lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Pending tasks</h2>
              <Link to="/tasks" className="text-xs text-muted-foreground hover:text-foreground">
                View all →
              </Link>
            </div>
            {open.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                Nothing pending. Add a task or ask Aria to generate some from your notes.
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {open.slice(0, 6).map((t) => (
                  <li key={t.id} className="flex items-center justify-between py-3">
                    <div>
                      <div className="font-medium">{t.title}</div>
                      {t.due && <div className="text-xs text-muted-foreground">Due {t.due}</div>}
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        t.priority === "high"
                          ? "bg-destructive/10 text-destructive"
                          : t.priority === "medium"
                            ? "bg-warning/10 text-warning"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {t.priority}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-card/50 p-5 backdrop-blur">
            <div className="mb-3 inline-flex items-center gap-2 text-sm text-primary">
              <Sparkles className="h-4 w-4" /> AI insight
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Most professionals reclaim <span className="text-foreground font-medium">6+ hours / week</span> by
              delegating drafting, summarization and meeting recaps to an AI assistant. Try
              starting your morning by asking Aria to summarize yesterday's notes.
            </p>
            <Link
              to="/chat"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Chat with Aria <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
