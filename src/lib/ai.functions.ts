import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

const MODEL = "google/gemini-3-flash-preview";

function getModel() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  // Dynamic import keeps server-only module out of client bundle
  return import("./ai-gateway.server").then(({ createLovableAiGatewayProvider }) =>
    createLovableAiGatewayProvider(key)(MODEL),
  );
}

async function run(system: string, prompt: string) {
  const model = await getModel();
  const { text } = await generateText({ model, system, prompt });
  return { text };
}

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        recipient: z.string().trim().min(1).max(200),
        purpose: z.string().trim().min(1).max(2000),
        tone: z.enum(["Formal", "Friendly", "Persuasive"]),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const prompt = `Recipient:\n${data.recipient}\n\nPurpose:\n${data.purpose}\n\nTone:\n${data.tone}\n\nGenerate a clear and professional email.\nInclude:\n- Subject line\n- Greeting\n- Body\n- Closing`;
    return run(
      "You are a professional workplace communication assistant. Output plain text email only, no commentary.",
      prompt,
    );
  });

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ notes: z.string().trim().min(10).max(20000) }).parse(d),
  )
  .handler(async ({ data }) => {
    const prompt = `Summarize the following meeting notes.\n\nProvide markdown sections:\n\n## Executive Summary\n## Key Decisions\n## Action Items\n## Deadlines\n\nMeeting Notes:\n${data.notes}`;
    return run(
      "You are an executive assistant who writes concise, well-structured meeting summaries in markdown.",
      prompt,
    );
  });

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        tasks: z.string().trim().min(1).max(5000),
        hours: z.string().trim().min(1).max(100),
        priority: z.string().trim().max(500).optional().default(""),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const prompt = `Create a daily work schedule.\n\nTasks:\n${data.tasks}\n\nWorking Hours:\n${data.hours}\n\nPriority Notes:\n${data.priority || "None"}\n\nPrioritize tasks based on urgency and importance.\n\nProvide a time-blocked schedule in markdown using a list. Each line: **HH:MM - HH:MM** — Task (priority). Include short breaks and a lunch.`;
    return run(
      "You are a productivity coach who builds realistic time-blocked daily schedules.",
      prompt,
    );
  });

export const runResearch = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        topic: z.string().trim().min(1).max(500),
        context: z.string().trim().max(5000).optional().default(""),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const prompt = `Topic:\n${data.topic}\n\nContext:\n${data.context || "None"}\n\nProvide markdown sections:\n\n## Overview\n## Key Findings\n## Opportunities\n## Risks\n## Recommendations`;
    return run(
      "You are a professional research assistant who delivers structured, evidence-aware briefings.",
      prompt,
    );
  });
