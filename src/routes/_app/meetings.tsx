import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import ReactMarkdown from "react-markdown";
import { Video, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { summarizeMeeting } from "@/lib/ai.functions";

export const Route = createFileRoute("/_app/meetings")({
  head: () => ({ meta: [{ title: "Meetings — Aria" }] }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const run = useServerFn(summarizeMeeting);
  const [title, setTitle] = useState("");
  const [transcript, setTranscript] = useState("");
  const [recap, setRecap] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transcript.trim()) return;
    setLoading(true);
    try {
      const { recap } = await run({ data: { transcript, title: title || undefined } });
      setRecap(recap);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Meeting Assistant</h1>
        <p className="text-sm text-muted-foreground">
          Paste raw notes or a transcript. Aria returns a recap, decisions, action items and a follow-up email.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <form onSubmit={submit} className="space-y-3 rounded-2xl border border-border bg-card/70 p-5 backdrop-blur">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Meeting title (optional)"
          />
          <Textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={16}
            placeholder="Paste your meeting transcript or raw notes here…"
            className="resize-none"
          />
          <Button type="submit" disabled={loading || !transcript.trim()} className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90">
            {loading ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Recapping…
              </>
            ) : (
              <>
                <Sparkles className="mr-1.5 h-4 w-4" /> Generate recap
              </>
            )}
          </Button>
        </form>

        <div className="rounded-2xl border border-border bg-card/70 p-5 backdrop-blur">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium">
            <Video className="h-4 w-4 text-primary" /> Recap
          </div>
          <div className="prose prose-sm prose-invert min-h-[400px] max-w-none rounded-xl border border-dashed border-border p-4">
            {recap ? <ReactMarkdown>{recap}</ReactMarkdown> : (
              <p className="text-muted-foreground">Your meeting recap will appear here.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
