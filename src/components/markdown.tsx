import ReactMarkdown from "react-markdown";

export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary prose-code:text-foreground prose-li:my-0.5">
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}
