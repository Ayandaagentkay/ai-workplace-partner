import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { MessagesSquare, Send, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Markdown } from "@/components/markdown";
import { ResponsibleAINotice } from "@/components/responsible-ai-notice";
import { bumpUsage } from "@/lib/usage-stats";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/chat")({
  head: () => ({ meta: [{ title: "AI Chatbot — Workspace AI" }] }),
  component: ChatPage,
});

const transport = new DefaultChatTransport({ api: "/api/chat" });

const SUGGESTIONS = [
  "How can I improve team productivity?",
  "Draft an agenda for a 30-minute standup.",
  "Help me prioritize my tasks for today.",
  "Summarize best practices for async communication.",
];

function ChatPage() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport,
    onError: (e) => toast.error(e.message || "Chat error"),
  });
  const isLoading = status === "submitted" || status === "streaming";
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const send = async (text: string) => {
    const v = text.trim();
    if (!v || isLoading) return;
    setInput("");
    await sendMessage({ text: v });
    bumpUsage("chat");
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-3.5rem)] w-full max-w-4xl flex-col p-6">
      <header className="mb-4 flex items-start gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <MessagesSquare className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">AI Workplace Chatbot</h1>
          <p className="text-sm text-muted-foreground">
            Ask anything about productivity, scheduling, communication, or research.
          </p>
        </div>
      </header>

      <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex-1 overflow-y-auto p-5">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold">How can I help today?</h2>
              <p className="mt-1 text-sm text-muted-foreground">Try one of these prompts:</p>
              <div className="mt-5 grid w-full max-w-xl gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-lg border border-border bg-background p-3 text-left text-sm transition hover:border-primary/40 hover:bg-muted/40"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {messages.map((m) => {
                const text = m.parts
                  .map((p) => (p.type === "text" ? p.text : ""))
                  .join("");
                if (m.role === "user") {
                  return (
                    <div key={m.id} className="flex justify-end">
                      <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                        {text}
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={m.id} className="flex gap-3">
                    <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      {text ? (
                        <Markdown>{text}</Markdown>
                      ) : (
                        <div className="text-sm text-muted-foreground">Thinking…</div>
                      )}
                    </div>
                  </div>
                );
              })}
              {status === "submitted" && (
                <div className="flex gap-3 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="border-t border-border p-3"
        >
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Message the workplace assistant..."
              className="min-h-[52px] max-h-40 resize-none"
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>
      </div>

      <ResponsibleAINotice />
    </div>
  );
}
