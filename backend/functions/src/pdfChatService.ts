import {googleAI} from "@genkit-ai/googleai";
import {genkit} from "genkit";
import {Buffer} from "buffer";
// import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";
// @ts-ignore
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");

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
  const loadingTask = (pdfjsLib as any).getDocument({ data: new Uint8Array(buffer) });
  const pdf = await loadingTask.promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item: any) => item.str).join(" ");
    text += `Page ${i}: ${pageText}\n`;
  }
  const systemPrompt = `${prompt}\nContext:\n${text}`;
  const response = await ai.generate(systemPrompt);
  return response.text;
}
