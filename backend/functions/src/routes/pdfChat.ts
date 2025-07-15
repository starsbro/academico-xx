/**
 * Handles application/json chat requests (general chat, no PDF).
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 */
function handleJsonChat(req: Request, res: Response) {
  res.status(501).json({ error: "Not implemented" });
}
import express from "express";
import type { Request, Response } from "express";
import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/googleai";
import * as functions from "firebase-functions";
import { FieldValue } from "firebase-admin/firestore";


import firebaseAdmin from "../config/firebaseAdmin";
import { chatWithPdf } from "../services/pdfChatService";
import { authenticateFirebaseToken } from "../middleware/auth";
import { addMessageToChat } from "../models/message-model";


const router = express.Router();

// Use require for compatibility with busboy@1.6.0 (CommonJS constructor)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Busboy = require("busboy");

// Gemini general chat setup
const generalAi = genkit({
  plugins: [
    googleAI({
      apiKey:
        process.env.GEMINI_API_KEY ||
        (functions.config().gemini && functions.config().gemini.api_key),
    }),
  ],
  model: googleAI.model("gemini-2.5-flash"),
});

/**
 * Generates a response to the given prompt using the general AI model.
 * @param {string} prompt - The user's input prompt.
 * @return {Promise<string>} A promise that resolves to the
 * AI-generated response text.
 */
async function generalChat(prompt: string): Promise<string> {
  if (!prompt || prompt.trim() === "") return "Please enter a question.";
  const response = await generalAi.generate(prompt);
  return response.text;
}

// Support both multipart/form-data (file upload)
// and application/json (text-only)
router.post(
  "/",
  authenticateFirebaseToken,
  (req: Request, res: Response) => {
    if (req.is("multipart/form-data")) {
      handleMultipartPdfChat(req, res);
    } else if (req.is("application/json")) {
      handleJsonChat(req, res);
    } else {
      res.status(400).json({
        error: "Unsupported Content-Type",
      });
    }
  }
);

// --- Helper Functions ---

/**
 * Handles multipart/form-data PDF chat requests (file upload).
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 */
function handleMultipartPdfChat(req: Request, res: Response) {
  // Use Busboy as a factory function (no 'new')
  // Use Busboy as a factory function (not a constructor)
  // eslint-disable-next-line new-cap
  const busboy = Busboy({
    headers: req.headers,
    limits: { fileSize: 10 * 1024 * 1024 },
  });
  let pdfBuffer: Buffer | null = null;
  let pdfInfo: { filename: string; mimetype: string } | null = null;
  let message = "";
  let chatId = "";

  // Only one busboy.on('file', ...) handler should exist
  busboy.on(
    "file",
    (
      fieldname: string,
      file: NodeJS.ReadableStream,
      filename: string,
      encoding: string,
      mimetype: string
    ) => {
      if (fieldname === "pdf") {
        // Robustly extract filename as string
        let realFilename = filename;
        if (filename && typeof filename === "object") {
          if (
            "name" in filename &&
            typeof (filename as { name?: unknown }).name === "string"
          ) {
            realFilename = (filename as { name: string }).name;
          } else if (
            "filename" in filename &&
            typeof (filename as { filename?: unknown }).filename === "string"
          ) {
            realFilename = (filename as { filename: string }).filename;
          } else if (
            "value" in filename &&
            typeof (filename as { value?: unknown }).value === "string"
          ) {
            realFilename = (filename as { value: string }).value;
          } else if (
            typeof (filename as unknown as { toString?: unknown })
              .toString === "function"
          ) {
            const str = (filename as unknown as { toString: () => string })
              .toString?.();
            if (str && str !== "[object Object]") {
              realFilename = str;
            }
          } else {
            for (const key of Object.keys(
              filename as unknown as Record<string, unknown>
            )) {
              const value = (
                filename as unknown as Record<string, unknown>
              )[key];
              if (typeof value === "string") {
                realFilename = value;
                break;
              }
            }
            if (typeof realFilename !== "string") {
              realFilename = "[unknown-filename]";
            }
          }
        }
        pdfInfo = { filename: String(realFilename), mimetype };
        const chunks: Buffer[] = [];
        file.on("data", (data: Buffer) => chunks.push(data));
        file.on("end", () => {
          pdfBuffer = Buffer.concat(chunks);
        });
      } else {
        file.resume();
      }
    }
  );

  busboy.on("field", (fieldname: string, val: string) => {
    if (fieldname === "message") message = val;
    if (fieldname === "chatId") chatId = val;
  });

  busboy.on("error", (err: unknown) => {
    console.error("[Busboy Error]", err);
    res.status(400).json({
      error: "Malformed form data",
      details: err instanceof Error ? err.message : String(err),
    });
  });

  busboy.on("finish", async () => {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }
      let pdfUrl = null;
      const hasPrompt = message && message.trim().length > 0;
      const hasPdf = !!pdfBuffer && !!pdfInfo;
      let response = null;

      const db = firebaseAdmin.db;
      let finalChatId = chatId;
      if (!finalChatId) {
        const chatRef = await db
          .collection("users")
          .doc(userId)
          .collection("chats")
          .add({
            title: "PDF Chat",
            createdAt: FieldValue.serverTimestamp(),
            lastUpdatedAt: FieldValue.serverTimestamp(),
            userId,
          });
        finalChatId = chatRef.id;
      }

      if (hasPdf) {
        const prompt = hasPrompt ? message : "Please summary this PDF.";
        const bucket = firebaseAdmin.storage.bucket();
        const fileName =
          `pdfs/${userId}/${Date.now()}-${pdfInfo!.filename}`;
        const fileRef = bucket.file(fileName);

        await fileRef.save(pdfBuffer!, {
          contentType: pdfInfo!.mimetype,
          public: false,
        });

        const [url] = await fileRef.getSignedUrl({
          action: "read",
          expires: "03-01-2500",
        });

        pdfUrl = url;
        response = await chatWithPdf(pdfBuffer!, prompt);

        await addMessageToChat(userId, finalChatId, {
          userId,
          message: prompt,
          timestamp: new Date().toISOString(),
          source: "pdf",
          pdfFilename: typeof pdfInfo!.filename === "string" ?
            pdfInfo!.filename :
            String(pdfInfo!.filename),
        });
        await addMessageToChat(userId, finalChatId, {
          userId: "ai",
          message: response,
          timestamp: new Date().toISOString(),
          source: "pdf",
          pdfFilename: typeof pdfInfo!.filename === "string" ?
            pdfInfo!.filename :
            String(pdfInfo!.filename),
        });
        await db
          .collection("pdfUploads")
          .add({
            userId,
            pdfUrl,
            timestamp: new Date().toISOString(),
            prompt,
          });
        res.json({
          response,
          pdfUrl,
          chatId: finalChatId,
        });
        return;
      }

      if (hasPrompt) {
        response = await generalChat(message);
        await addMessageToChat(userId, finalChatId, {
          userId,
          message: message,
          timestamp: new Date().toISOString(),
          source: "chat",
        });
        await addMessageToChat(userId, finalChatId, {
          userId: "ai",
          message: response,
          timestamp: new Date().toISOString(),
          source: "chat",
        });
        res.json({ response, chatId: finalChatId });
        return;
      }

      res.json({ chatId: finalChatId });
    } catch (err) {
      console.error("[PDF Chat Route Error]", err);
      if (err instanceof Error) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(500).json({ error: "An unknown error occurred." });
      }
    }
  });
  req.pipe(busboy);
}

export default router;
