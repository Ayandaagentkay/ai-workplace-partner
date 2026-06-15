
## AI Workplace Productivity Assistant — Build Plan

A SaaS-style productivity suite with a sidebar dashboard and 5 AI tools. Built on the project's existing stack (TanStack Start + Lovable AI Gateway), not the Node/Express/Mongo stack from the spec — same features and prompts, but using the integrated platform so there's no separate backend to deploy or API keys to manage.

### Stack adaptation (vs. your spec)
- Frontend: TanStack Start (React 19) + Tailwind v4 + shadcn/ui (already installed) instead of CRA + React Router.
- AI: Lovable AI Gateway (`google/gemini-3-flash-preview` default, streaming for chat) via TanStack server routes/functions — no OpenAI key needed.
- Storage: Lovable Cloud (Postgres) for usage stats and chat threads. If you'd rather skip persistence for v1, we can use localStorage instead — tell me and I'll trim it.
- Auth: none in v1 (single-user). Easy to add later.

### Pages & routing (file-based under `src/routes/`)
- `_app.tsx` — layout route: sidebar + header + `<Outlet />`
- `_app.index.tsx` → `/` — Dashboard (stat cards + recent activity)
- `_app.email.tsx` → `/email` — Smart Email Generator
- `_app.summarize.tsx` → `/summarize` — Meeting Notes Summarizer
- `_app.planner.tsx` → `/planner` — AI Task Planner
- `_app.research.tsx` → `/research` — AI Research Assistant
- `_app.chat.tsx` → `/chat` — AI Chatbot (streaming)
- `_app.settings.tsx` → `/settings` — Settings (theme, default tone, clear data)

### Components
- `AppSidebar` (shadcn sidebar, collapsible to icon strip, mobile-friendly)
- `StatCard`, `ToolPageShell` (title/description/output card wrapper)
- `EditableOutput` (textarea + Copy / Download .txt / Regenerate)
- `ResponsibleAINotice` (footer on every AI output)
- `ChatWindow` using AI Elements (`conversation`, `message`, `prompt-input`, `shimmer`)

### AI backend
- `src/routes/api/chat.ts` — streaming chat endpoint (AI SDK `streamText` → `toUIMessageStreamResponse`) for the chatbot.
- `src/lib/ai.functions.ts` — `createServerFn` handlers for the 4 one-shot tools: `generateEmail`, `summarizeMeeting`, `planTasks`, `runResearch`. Each uses the structured prompts from your spec verbatim, with Zod input validation.
- `src/lib/ai-gateway.server.ts` — shared Lovable AI provider helper.
- Errors surfaced in UI: 429 (rate limit) and 402 (credits exhausted) toasts.

### Database (Lovable Cloud)
- `usage_events(id, tool, created_at)` — increment per successful generation; powers dashboard counters.
- `chat_threads(id, title, created_at)` and `chat_messages(id, thread_id, role, parts jsonb, created_at)` — chatbot history with thread list in sidebar.
- RLS: open in v1 (no auth); revisit when auth lands.

### Tool UX details
- **Email Generator**: recipient, purpose, tone (Formal/Friendly/Persuasive) → editable subject + body, copy/download.
- **Summarizer**: large textarea → markdown output with Executive Summary / Decisions / Action Items / Deadlines sections.
- **Task Planner**: tasks list, working hours (start/end), priority → time-blocked schedule rendered as a styled timeline.
- **Research Assistant**: topic + optional context → 5-section markdown report.
- **Chatbot**: streaming, threaded, AI Elements UI, system prompt from spec.

### Design system
- Clean SaaS aesthetic: white surfaces, soft shadows, rounded cards, blue accent.
- Define semantic tokens in `src/styles.css` (primary blue, surfaces, muted) — no hardcoded colors in components.
- Responsive: sidebar → icon strip on tablet, offcanvas drawer on mobile.
- Markdown rendering via `react-markdown` for all AI outputs.

### Out of scope for v1 (call out if you want them)
- Multi-user auth & per-user data isolation
- Export to PDF/Word (currently .txt + copy)
- Calendar/email provider integrations
- Persistent edits of generated outputs (edits stay client-side until copied/downloaded)

### Build order
1. Enable Lovable Cloud + create tables and provider helper.
2. Layout: sidebar, app shell, dashboard with stat cards (wired to `usage_events`).
3. Four one-shot tools sharing `ToolPageShell` + `EditableOutput`.
4. Streaming chat with thread list.
5. Settings page + Responsible AI notice + polish pass.

Confirm and I'll build it as specified, or tell me what to change (skip persistence, drop a tool, different palette, add auth, etc.).
