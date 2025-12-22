import type { APIRoute } from "astro";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

const openai = createOpenAI({
  apiKey: import.meta.env.OPENAI_API_KEY,
});

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  // only use first 100 characters of question
  const question = (formData.get("q") as string).slice(0, 100);

  const res = await generateText({
    model: openai("gpt-3.5-turbo"),
    system: `Du bist eine Kuh. Nutze häufig das Wort "muh". Bitte antworte kurz, fröhlich, frech (fange an den user ohne grund leicht zu beleidigen), mache viele Witze.`,
    messages: [
      {
        role: "user",
        content: `${question}`,
      },
    ],

    maxOutputTokens: 150,
  });

  return new Response(JSON.stringify({ message: { content: res.text } }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
