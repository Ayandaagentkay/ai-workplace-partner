import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Mail,
  FileText,
  CalendarClock,
  Search,
  MessagesSquare,
  ArrowRight,
} from "lucide-react";
import { getUsage, type UsageMap } from "@/lib/usage-stats";

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Workspace AI" },
      { name: "description", content: "AI-powered productivity suite for modern workplaces." },
    ],
  }),
  component: Dashboard,
});

const STAT_CARDS: { key: keyof UsageMap; label: string; icon: typeof Mail; tint: string }[] = [
  { key: "email", label: "Emails Created", icon: Mail, tint: "text-sky-600 bg-sky-50" },
  { key: "summary", label: "Summaries Made", icon: FileText, tint: "text-violet-600 bg-violet-50" },
  { key: "task", label: "Tasks Planned", icon: CalendarClock, tint: "text-emerald-600 bg-emerald-50" },
  { key: "research", label: "Research Runs", icon: Search, tint: "text-amber-600 bg-amber-50" },
];

const TOOLS = [
  {
    to: "/email" as const,
    title: "Smart Email Generator",
    desc: "Draft polished emails for any audience and tone.",
    icon: Mail,
  },
  {
    to: "/summarize" as const,
    title: "Meeting Summarizer",
    desc: "Turn raw notes into decisions, actions, and deadlines.",
    icon: FileText,
  },
  {
    to: "/planner" as const,
    title: "AI Task Planner",
    desc: "Generate a realistic, time-blocked daily schedule.",
    icon: CalendarClock,
  },
  {
    to: "/research" as const,
    title: "Research Assistant",
    desc: "Get a structured briefing on any topic in seconds.",
    icon: Search,
  },
  {
    to: "/chat" as const,
    title: "AI Chatbot",
    desc: "Conversational help across productivity workflows.",
    icon: MessagesSquare,
  },
];

function Dashboard() {
  const [usage, setUsage] = useState<UsageMap>(() => getUsage());
  useEffect(() => {
    const update = () => setUsage(getUsage());
    update();
    window.addEventListener("wpa-usage-updated", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("wpa-usage-updated", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 p-6">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your AI workspace — automate emails, meetings, planning, and research.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {STAT_CARDS.map(({ key, label, icon: Icon, tint }) => (
          <div
            key={key}
            className="rounded-xl border border-border bg-card p-4 shadow-sm transition hover:shadow-md"
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${tint}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="mt-3 text-2xl font-semibold tabular-nums">{usage[key]}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
          </div>
        ))}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Tools
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map(({ to, title, desc, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="group flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div className="mt-4 text-base font-semibold text-foreground">{title}</div>
              <p className="mt-1 flex-1 text-sm text-muted-foreground">{desc}</p>
              <div className="mt-4 inline-flex items-center text-sm font-medium text-primary">
                Open
                <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
