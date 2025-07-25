import {googleAI} from "@genkit-ai/googleai";
import {genkit} from "genkit";
import {Buffer} from "buffer";
// Polyfill DOMMatrix for pdfjs-dist legacy build in Node.js
// (global as any).DOMMatrix = class {};
// import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";

import pdfParse from "pdf-parse";

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
  // Use pdf-parse to extract text
  const data = await pdfParse(buffer);
  const text = data.text;
  const systemPrompt = `${prompt}\nContext:\n${text}`;
  const response = await ai.generate(systemPrompt);

  return response.text;
}
