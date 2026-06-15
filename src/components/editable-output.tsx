import { useEffect, useState } from "react";
import { Copy, Download, Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Markdown } from "@/components/markdown";
import { toast } from "sonner";
import { ResponsibleAINotice } from "./responsible-ai-notice";

export function EditableOutput({
  value,
  onChange,
  filename = "ai-output.txt",
  renderMarkdown = true,
}: {
  value: string;
  onChange: (v: string) => void;
  filename?: string;
  renderMarkdown?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    setEditing(false);
  }, [value]);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  };
  const download = () => {
    const blob = new Blob([value], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2.5">
        <div className="text-sm font-medium text-foreground">Result</div>
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="sm" onClick={() => setEditing((e) => !e)}>
            {editing ? <Eye className="mr-1.5 h-3.5 w-3.5" /> : <Pencil className="mr-1.5 h-3.5 w-3.5" />}
            {editing ? "Preview" : "Edit"}
          </Button>
          <Button variant="ghost" size="sm" onClick={copy}>
            <Copy className="mr-1.5 h-3.5 w-3.5" />
            Copy
          </Button>
          <Button variant="ghost" size="sm" onClick={download}>
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Download
          </Button>
        </div>
      </div>
      <div className="p-5">
        {editing || !renderMarkdown ? (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[320px] font-mono text-sm"
          />
        ) : (
          <Markdown>{value}</Markdown>
        )}
        <ResponsibleAINotice />
      </div>
    </div>
  );
}
