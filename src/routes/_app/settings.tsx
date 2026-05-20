import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Moon, Sun, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — Aria" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    setTheme(next);
  };

  const clearAll = () => {
    if (!confirm("Clear all local data (chat history, tasks)?")) return;
    localStorage.removeItem("aria.chat.messages");
    localStorage.removeItem("aria.tasks");
    location.reload();
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Tune Aria to your workflow.</p>
      </header>

      <section className="rounded-2xl border border-border bg-card/70 p-5 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-display font-semibold">Appearance</div>
            <div className="text-xs text-muted-foreground">Switch between dark and light modes.</div>
          </div>
          <Button variant="outline" onClick={toggleTheme} className="gap-2">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </Button>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card/70 p-5 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-display font-semibold">AI Model</div>
            <div className="text-xs text-muted-foreground">Currently using Gemini 3 Flash via Lovable AI.</div>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">google/gemini-3-flash-preview</span>
        </div>
      </section>

      <section className="rounded-2xl border border-destructive/40 bg-destructive/5 p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-display font-semibold text-destructive">Danger zone</div>
            <div className="text-xs text-muted-foreground">
              Clear locally-stored chat history and tasks on this device.
            </div>
          </div>
          <Button variant="destructive" onClick={clearAll} className="gap-2">
            <Trash2 className="h-4 w-4" /> Clear data
          </Button>
        </div>
      </section>
    </div>
  );
}
