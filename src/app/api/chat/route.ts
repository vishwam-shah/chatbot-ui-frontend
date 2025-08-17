import { Message } from "@/types/index";
import { GeminiStream } from "@/utils/gemini";

export const config = {
  runtime: "edge"
};


export async function POST(req: Request): Promise<Response> {
  try {
    const { messages } = (await req.json()) as {
      messages: Message[];
    };

    const charLimit = 12000;
    let charCount = 0;
    const messagesToSend = [];

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      if (charCount + message.content.length > charLimit) {
        break;
      }
      charCount += message.content.length;
      messagesToSend.push(message);
    }

    const stream = await GeminiStream(messagesToSend);
    return new Response(stream);
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
}
