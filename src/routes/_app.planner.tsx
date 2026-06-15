import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarClock, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { ToolPageShell } from "@/components/tool-page-shell";
import { EditableOutput } from "@/components/editable-output";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { planTasks } from "@/lib/ai.functions";
import { bumpUsage } from "@/lib/usage-stats";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/planner")({
  head: () => ({ meta: [{ title: "Task Planner — Workspace AI" }] }),
  component: PlannerPage,
});

function PlannerPage() {
  const fn = useServerFn(planTasks);
  const [tasks, setTasks] = useState("");
  const [hours, setHours] = useState("09:00 - 17:00");
  const [priority, setPriority] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!tasks.trim()) return toast.error("Enter at least one task");
    setLoading(true);
    try {
      const { text } = await fn({ data: { tasks, hours, priority } });
      setOutput(text);
      bumpUsage("task");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to plan tasks");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageShell
      title="AI Task Planner"
      description="Generate a realistic, time-blocked daily schedule."
      icon={<CalendarClock className="h-5 w-5" />}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="space-y-2">
            <Label htmlFor="tasks">Tasks (one per line)</Label>
            <Textarea
              id="tasks"
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              placeholder={"Respond to emails\nPrepare client presentation\nResearch project"}
              className="min-h-[180px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hours">Working hours</Label>
            <Input id="hours" value={hours} onChange={(e) => setHours(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority notes (optional)</Label>
            <Input
              id="priority"
              placeholder="e.g. Presentation is highest priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            />
          </div>
          <Button onClick={submit} disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Build Schedule
          </Button>
        </div>
        <div>
          {output ? (
            <EditableOutput value={output} onChange={setOutput} filename="schedule.md" />
          ) : (
            <div className="flex h-full min-h-[320px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
              Your time-blocked schedule will appear here.
            </div>
          )}
        </div>
      </div>
    </ToolPageShell>
  );
}
