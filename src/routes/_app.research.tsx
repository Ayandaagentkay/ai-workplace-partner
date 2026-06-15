import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { ToolPageShell } from "@/components/tool-page-shell";
import { EditableOutput } from "@/components/editable-output";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { runResearch } from "@/lib/ai.functions";
import { bumpUsage } from "@/lib/usage-stats";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/research")({
  head: () => ({ meta: [{ title: "Research Assistant — Workspace AI" }] }),
  component: ResearchPage,
});

function ResearchPage() {
  const fn = useServerFn(runResearch);
  const [topic, setTopic] = useState("");
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!topic.trim()) return toast.error("Enter a research topic");
    setLoading(true);
    try {
      const { text } = await fn({ data: { topic, context } });
      setOutput(text);
      bumpUsage("research");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to research");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageShell
      title="AI Research Assistant"
      description="Get a structured briefing on any topic in seconds."
      icon={<Search className="h-5 w-5" />}
    >
      <div className="space-y-6">
        <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              placeholder="e.g. Artificial Intelligence in Education"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="context">Context (optional)</Label>
            <Textarea
              id="context"
              placeholder="Audience, goals, specific angles to cover..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
          <Button onClick={submit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Run Research
          </Button>
        </div>
        {output && (
          <EditableOutput value={output} onChange={setOutput} filename="research-brief.md" />
        )}
      </div>
    </ToolPageShell>
  );
}
