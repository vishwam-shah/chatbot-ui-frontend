import { GoogleGenerativeAI } from "@google/generative-ai";
import { Message } from "@/types/index";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const GeminiStream = async (messages: Message[]) => {
  // Gemini expects a prompt string, so we concatenate messages
  const prompt = messages.map(m => `${m.role}: ${m.content}`).join("\n");
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Mimic OpenAIStream: return a ReadableStream
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(text));
      controller.close();
    }
  });
};
