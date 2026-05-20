import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
  ConversationEmptyState,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/lib/storage";

export const Route = createFileRoute("/_app/chat")({
  head: () => ({ meta: [{ title: "AI Assistant — Aria" }] }),
  component: ChatPage,
});

const SUGGESTIONS = [
  "Draft a polite follow-up email asking for status",
  "Summarize my last meeting and pull action items",
  "Turn this paragraph into a 5-bullet briefing",
  "Plan a focused 90-minute deep-work block for me",
];

function ChatPage() {
  const [stored, setStored] = useLocalStorage<UIMessage[]>("aria.chat.messages", []);
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { messages, sendMessage, status, setMessages, error } = useChat({
    messages: stored,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  // Persist as messages change.
  useEffect(() => {
    setStored(messages);
  }, [messages, setStored]);

  // Keep textarea focused
  useEffect(() => {
    textareaRef.current?.focus();
  }, [status]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value) return;
    sendMessage({ text: value });
    setInput("");
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const reset = () => {
    setMessages([]);
    setStored([]);
  };

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-3">
        <div>
          <h1 className="font-display text-lg font-semibold">Aria Assistant</h1>
          <p className="text-xs text-muted-foreground">Your AI copilot for emails, summaries and tasks</p>
        </div>
        <Button variant="ghost" size="sm" onClick={reset} className="gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" /> New conversation
        </Button>
      </div>

      <Conversation className="flex-1">
        <ConversationContent className="mx-auto max-w-3xl">
          {messages.length === 0 ? (
            <ConversationEmptyState
              icon={
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
                  <Sparkles className="h-6 w-6" />
                </span>
              }
              title="How can I help you ship today?"
              description="Ask anything about emails, documents, meetings or your task list."
            >
              <div className="mt-6 grid w-full max-w-xl gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-xl border border-border bg-card/60 p-3 text-left text-sm text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </ConversationEmptyState>
          ) : (
            <>
              {messages.map((m) => (
                <Message from={m.role} key={m.id}>
                  {m.role === "assistant" ? (
                    <div className="prose prose-sm prose-invert max-w-none">
                      {m.parts.map((part, i) => {
                        if (part.type === "text") {
                          return <MessageResponse key={i}>{part.text}</MessageResponse>;
                        }
                        return null;
                      })}
                    </div>
                  ) : (
                    <MessageContent>
                      {m.parts.map((part, i) =>
                        part.type === "text" ? <span key={i}>{part.text}</span> : null
                      )}
                    </MessageContent>
                  )}
                </Message>
              ))}
              {isLoading && status === "submitted" && (
                <Message from="assistant">
                  <Shimmer>Thinking…</Shimmer>
                </Message>
              )}
              {error && (
                <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                  Something went wrong: {error.message}
                </div>
              )}
            </>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-border bg-background/70 px-4 py-3 backdrop-blur">
        <div className="mx-auto max-w-3xl">
          <PromptInput onSubmit={onSubmit}>
            <PromptInputTextarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Aria anything — emails, summaries, plans…"
            />
            <PromptInputFooter className="justify-end">
              <PromptInputSubmit status={status} disabled={!input.trim() || isLoading} />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  );
}
