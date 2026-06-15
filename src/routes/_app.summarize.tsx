import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { ToolPageShell } from "@/components/tool-page-shell";
import { EditableOutput } from "@/components/editable-output";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { summarizeMeeting } from "@/lib/ai.functions";
import { bumpUsage } from "@/lib/usage-stats";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/summarize")({
  head: () => ({ meta: [{ title: "Meeting Summarizer — Workspace AI" }] }),
  component: SummarizePage,
});

function SummarizePage() {
  const fn = useServerFn(summarizeMeeting);
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (notes.trim().length < 10) {
      toast.error("Paste your meeting notes first");
      return;
    }
    setLoading(true);
    try {
      const { text } = await fn({ data: { notes } });
      setOutput(text);
      bumpUsage("summary");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to summarize");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageShell
      title="Meeting Notes Summarizer"
      description="Turn raw notes into decisions, actions, and deadlines."
      icon={<FileText className="h-5 w-5" />}
    >
      <div className="space-y-6">
        <div className="space-y-3 rounded-xl border border-border bg-card p-5 shadow-sm">
          <Label htmlFor="notes">Meeting notes</Label>
          <Textarea
            id="notes"
            placeholder="Paste full meeting notes or transcript here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[260px]"
          />
          <Button onClick={submit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Summarize
          </Button>
        </div>
        {output && (
          <EditableOutput value={output} onChange={setOutput} filename="meeting-summary.md" />
        )}
      </div>
    </ToolPageShell>
  );
}
