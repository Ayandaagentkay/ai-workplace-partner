import { ShieldAlert } from "lucide-react";

export function ResponsibleAINotice() {
  return (
    <div className="mt-6 flex items-start gap-3 rounded-lg border border-border bg-muted/40 p-4 text-xs text-muted-foreground">
      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <div>
        <div className="font-medium text-foreground">Responsible AI Notice</div>
        <p className="mt-1 leading-relaxed">
          AI-generated content may contain inaccuracies. Review, verify, and edit all outputs
          before making workplace decisions. This assistant supports — and does not replace —
          professional judgment.
        </p>
      </div>
    </div>
  );
}
