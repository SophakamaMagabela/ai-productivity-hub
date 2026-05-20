import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Upload, Loader2, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useServerFn } from "@tanstack/react-start";
import { summarizeDocument } from "@/lib/ai.functions";

export const Route = createFileRoute("/_app/documents")({
  head: () => ({ meta: [{ title: "Documents — Aria" }] }),
  component: DocumentsPage,
});

function DocumentsPage() {
  const run = useServerFn(summarizeDocument);
  const [filename, setFilename] = useState<string | undefined>();
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setError(null);
    setSummary("");
    setFilename(file.name);
    try {
      const text = await readFileAsText(file);
      setContent(text.slice(0, 150_000));
    } catch (e) {
      setError(
        "Couldn't read this file in the browser. Try TXT, or paste the contents below. PDF/DOCX parsing happens server-side in a future iteration."
      );
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/plain": [".txt", ".md"],
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
  });

  const summarize = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const { summary } = await run({ data: { content, filename } });
      setSummary(summary);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to summarize");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-6 py-8">
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Documents</h1>
        <p className="text-sm text-muted-foreground">
          Drop a file or paste content. Aria will extract summary, key points and action items.
        </p>
      </header>

      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition ${
          isDragActive ? "border-primary bg-primary/5" : "border-border bg-card/40"
        }`}
      >
        <input {...getInputProps()} />
        <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
          <Upload className="h-5 w-5" />
        </div>
        <div className="font-display font-semibold">
          {filename ? filename : "Drop a file or click to upload"}
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          TXT and MD parsed in-browser. PDF/DOCX: paste contents below for now.
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card/70 p-4 backdrop-blur">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium">
            <FileText className="h-4 w-4 text-primary" /> Content
          </div>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={14}
            placeholder="Paste document text here…"
            className="resize-none"
          />
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{content.length.toLocaleString()} chars</span>
            <Button
              onClick={summarize}
              disabled={loading || !content.trim()}
              className="bg-gradient-primary text-primary-foreground hover:opacity-90"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Analyzing…
                </>
              ) : (
                <>
                  <Sparkles className="mr-1.5 h-4 w-4" /> Summarize with AI
                </>
              )}
            </Button>
          </div>
          {error && <div className="mt-2 text-xs text-destructive">{error}</div>}
        </div>

        <div className="rounded-2xl border border-border bg-card/70 p-4 backdrop-blur">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-primary" /> AI Briefing
          </div>
          <div className="prose prose-sm prose-invert min-h-[300px] max-w-none rounded-xl border border-dashed border-border p-4">
            {summary ? (
              <ReactMarkdown>{summary}</ReactMarkdown>
            ) : (
              <p className="text-muted-foreground">Your briefing will appear here.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
