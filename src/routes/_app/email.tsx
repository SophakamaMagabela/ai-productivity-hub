import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import ReactMarkdown from "react-markdown";
import { Mail, Loader2, Sparkles, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/_app/email")({
  head: () => ({ meta: [{ title: "Email Generator — Aria" }] }),
  component: EmailPage,
});

const TONES = ["Professional", "Friendly", "Direct", "Persuasive", "Apologetic", "Enthusiastic"] as const;

function EmailPage() {
  const run = useServerFn(generateEmail);
  const [intent, setIntent] = useState("");
  const [tone, setTone] = useState<(typeof TONES)[number]>("Professional");
  const [recipient, setRecipient] = useState("");
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!intent.trim()) return;
    setLoading(true);
    try {
      const { email } = await run({
        data: { intent, tone, recipient: recipient || undefined, context: context || undefined },
      });
      setOutput(email);
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Email Generator</h1>
        <p className="text-sm text-muted-foreground">
          Describe the intent — Aria writes the email. Follow-ups, invites and replies in seconds.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <form onSubmit={submit} className="space-y-3 rounded-2xl border border-border bg-card/70 p-5 backdrop-blur">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Intent *</label>
            <Textarea
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              rows={4}
              placeholder="e.g. Follow up with Maya about the Q3 proposal and ask for a meeting next week."
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as (typeof TONES)[number])}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {TONES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Recipient</label>
              <Input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Maya Chen, CFO" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Context (optional)</label>
            <Textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={4}
              placeholder="Prior thread, deadlines, names, anything relevant…"
            />
          </div>
          <Button type="submit" disabled={loading || !intent.trim()} className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90">
            {loading ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Drafting…
              </>
            ) : (
              <>
                <Sparkles className="mr-1.5 h-4 w-4" /> Generate email
              </>
            )}
          </Button>
        </form>

        <div className="rounded-2xl border border-border bg-card/70 p-5 backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Mail className="h-4 w-4 text-primary" /> Draft
            </div>
            {output && (
              <Button size="sm" variant="ghost" onClick={copy} className="gap-1.5">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            )}
          </div>
          <div className="prose prose-sm prose-invert min-h-[360px] max-w-none whitespace-pre-wrap rounded-xl border border-dashed border-border p-4">
            {output ? <ReactMarkdown>{output}</ReactMarkdown> : (
              <p className="text-muted-foreground">Your generated email will appear here.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
