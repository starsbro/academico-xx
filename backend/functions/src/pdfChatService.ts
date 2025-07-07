import {googleAI} from "@genkit-ai/googleai";
import {genkit} from "genkit";
import {Buffer} from "buffer";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";

// Ensure process.env is available (for Node.js environments)
declare let process: {
  env: {
    [key: string]: string | undefined;
  };
};

const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  model: googleAI.model("gemini-2.5-flash"),
});


/**
 * Chat with a PDF document using an AI model.
 * @param {Buffer} buffer The PDF file as a Buffer.
 * @param {string} prompt The prompt to send to the AI.
 * @return {Promise<string>} The AI's response as a string.
 */
export async function chatWithPdf(
  buffer: Buffer, prompt: string
): Promise<string> {
  // Use pdfjs-dist to extract text
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loadingTask = (pdfjsLib as any).getDocument({
    data: new Uint8Array(buffer),
  });
  const pdf = await loadingTask.promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    // TextContent and TextItem types from pdfjs-dist
    const content = await page.getTextContent() as {
      items: Array<{ str: string }>;
    };
    const pageText = content.items.map((item) => item.str).join(" ");
    text += `Page ${i}: ${pageText}\n`;
  }
  const systemPrompt = `${prompt}\nContext:\n${text}`;
  const response = await ai.generate(systemPrompt);
  return response.text;
}
