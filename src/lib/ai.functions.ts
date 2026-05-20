import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider, DEFAULT_MODEL } from "./ai-gateway";

function getModel() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  return createLovableAiGatewayProvider(key)(DEFAULT_MODEL);
}

export const summarizeDocument = createServerFn({ method: "POST" })
  .inputValidator((input: { content: string; filename?: string }) =>
    z.object({ content: z.string().min(1).max(200_000), filename: z.string().optional() }).parse(input)
  )
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: getModel(),
      system:
        "You analyze workplace documents and produce structured briefings in clean markdown.",
      prompt: `Document${data.filename ? ` (${data.filename})` : ""}:\n\n${data.content}\n\nProduce:\n## Summary\nA concise 3-5 sentence overview.\n\n## Key Points\nBullet list of the most important facts.\n\n## Action Items\nBullet list of concrete next actions with owners if mentioned.\n\n## Open Questions\nThings that are unclear or need follow-up.`,
    });
    return { summary: text };
  });

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator(
    (input: { intent: string; tone: string; recipient?: string; context?: string }) =>
      z
        .object({
          intent: z.string().min(1).max(2000),
          tone: z.enum(["Professional", "Friendly", "Direct", "Persuasive", "Apologetic", "Enthusiastic"]),
          recipient: z.string().max(200).optional(),
          context: z.string().max(4000).optional(),
        })
        .parse(input)
  )
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: getModel(),
      system:
        "You are an expert workplace communicator. Produce ready-to-send emails. Always return only the email, formatted as:\nSubject: <subject>\n\n<body>",
      prompt: `Write an email.\nIntent: ${data.intent}\nTone: ${data.tone}\nRecipient: ${data.recipient ?? "Not specified"}\nContext: ${data.context ?? "None"}`,
    });
    return { email: text };
  });

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((input: { transcript: string; title?: string }) =>
    z.object({ transcript: z.string().min(1).max(200_000), title: z.string().optional() }).parse(input)
  )
  .handler(async ({ data }) => {
    const { text } = await generateText({
      model: getModel(),
      system: "You turn raw meeting notes/transcripts into clear, structured recaps in markdown.",
      prompt: `Meeting${data.title ? `: ${data.title}` : ""}\n\n${data.transcript}\n\nProduce:\n## Recap\n3-5 sentence summary.\n\n## Decisions\nBullet list of decisions made.\n\n## Action Items\n- [Owner] Action — due date if mentioned.\n\n## Follow-up Email\nA short, ready-to-send follow-up email recapping the meeting.`,
    });
    return { recap: text };
  });
