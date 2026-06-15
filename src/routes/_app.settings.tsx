import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon, Trash2 } from "lucide-react";
import { ToolPageShell } from "@/components/tool-page-shell";
import { Button } from "@/components/ui/button";
import { resetUsage } from "@/lib/usage-stats";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — Workspace AI" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <ToolPageShell
      title="Settings"
      description="Manage your workspace preferences and local data."
      icon={<SettingsIcon className="h-5 w-5" />}
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold">About</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            AI Workplace Productivity Assistant — built with Lovable AI. Usage statistics are
            stored locally in your browser.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold">Local data</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Reset your dashboard usage counters.
          </p>
          <Button
            variant="outline"
            className="mt-3"
            onClick={() => {
              resetUsage();
              toast.success("Usage stats reset");
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Reset stats
          </Button>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold">Responsible AI</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            AI-generated content may contain inaccuracies. Always review, verify, and edit
            outputs before making workplace decisions. This assistant supports — and does not
            replace — professional judgment.
          </p>
        </div>
      </div>
    </ToolPageShell>
  );
}
