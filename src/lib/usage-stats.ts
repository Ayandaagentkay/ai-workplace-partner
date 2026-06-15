export type ToolKey = "email" | "summary" | "task" | "research" | "chat";

const KEY = "wpa.usage";

export type UsageMap = Record<ToolKey, number>;

const empty: UsageMap = { email: 0, summary: 0, task: 0, research: 0, chat: 0 };

export function getUsage(): UsageMap {
  if (typeof window === "undefined") return { ...empty };
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...empty, ...JSON.parse(raw) } : { ...empty };
  } catch {
    return { ...empty };
  }
}

export function bumpUsage(tool: ToolKey) {
  if (typeof window === "undefined") return;
  const next = getUsage();
  next[tool] = (next[tool] || 0) + 1;
  window.localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("wpa-usage-updated"));
}

export function resetUsage() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent("wpa-usage-updated"));
}
