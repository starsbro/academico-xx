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

  const startTime = Date.now();
  console.log(`[AI-REQUEST] Starting Gemini 
    API call for prompt length: ${prompt.length}`);
  try {
    const response = await generalAi.generate(prompt);
    const duration = Date.now() - startTime;
    console.log(`[AI-SUCCESS] Gemini API call completed in ${duration}ms`);
    return response.text;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[AI-ERROR] Gemini API call
      failed after ${duration}ms:`, error);
    throw error;
  }
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
  /**
   * Extracts a filename string from various possible representations.
   * @param {unknown} fn - The filename value, which may be a string or object.
   * @return {string} The extracted filename as a string,
   * or a fallback if not found.
   */
  function extractFilename(fn: unknown): string {
    if (typeof fn === "string") return fn;
    if (fn && typeof fn === "object") {
      const obj = fn as Record<string, unknown>;
      if (typeof obj.name === "string") return obj.name;
      if (typeof obj.filename === "string") return obj.filename;
      if (typeof obj.value === "string") return obj.value;
      if (
        typeof obj.toString === "function" &&
        obj.toString() !== "[object Object]"
      ) {
        return obj.toString();
      }
    }
    return "[unknown-filename]";
  }

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
        const realFilename = extractFilename(filename);
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

        // Store messages with correct chronological timestamps
        const baseTime = Date.now();
        const userTimestamp = new Date(baseTime).toISOString();
        // AI message 1ms later
        const aiTimestamp = new Date(baseTime + 1).toISOString();

        console.log(`[TIMESTAMP-FIX] PDF Chat - User: ${userTimestamp}, ` +
          `AI: ${aiTimestamp}, Diff: ${baseTime + 1 - baseTime}ms`);

        await addMessageToChat(userId, finalChatId, {
          userId,
          message: prompt,
          timestamp: userTimestamp,
          source: "pdf",
          pdfFilename: typeof pdfInfo!.filename === "string" ?
            pdfInfo!.filename :
            String(pdfInfo!.filename),
        });

        await addMessageToChat(userId, finalChatId, {
          userId: "ai",
          message: response,
          timestamp: aiTimestamp,
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
        console.log(`[CHAT-START] Processing 
          general chat for user ${userId}`);
        const chatStartTime = Date.now();
        response = await generalChat(message);

        const chatDuration = Date.now() - chatStartTime;
        console.log(`[CHAT-COMPLETE] General 
          chat processed in ${chatDuration}ms`);

        // Run database operations in parallel
        // for better performance
        // Generate timestamps to ensure correct chronological order
        const baseTime = Date.now();
        const userTimestamp = new Date(baseTime).toISOString();
        // AI message 1ms later
        const aiTimestamp = new Date(baseTime + 1).toISOString();

        console.log(`[TIMESTAMP-FIX] General Chat - User: ${userTimestamp}, ` +
          `AI: ${aiTimestamp}, Diff: ${baseTime + 1 - baseTime}ms`);

        await Promise.all([
          addMessageToChat(userId, finalChatId, {
            userId,
            message: message,
            timestamp: userTimestamp,
            source: "chat",
          }),
          addMessageToChat(userId, finalChatId, {
            userId: "ai",
            message: response,
            timestamp: aiTimestamp,
            source: "chat",
          }),
        ]);

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

  // For Cloud Functions 2nd gen: use req.rawBody if available
  const reqWithRawBody = req as Request & { rawBody?: Buffer };
  if (reqWithRawBody.rawBody) {
    busboy.end(reqWithRawBody.rawBody);
  } else {
    req.pipe(busboy);
  }
}

/**
 * Handles application/json chat requests (general chat, no PDF).
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 */
async function handleJsonChat(req: Request, res: Response) {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const { message, chatId } = req.body;
    if (!message || !message.trim()) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    const db = firebaseAdmin.db;
    let finalChatId = chatId;
    if (!finalChatId) {
      const chatRef = await db
        .collection("users")
        .doc(userId)
        .collection("chats")
        .add({
          title: "Chat",
          createdAt: FieldValue.serverTimestamp(),
          lastUpdatedAt: FieldValue.serverTimestamp(),
          userId,
        });
      finalChatId = chatRef.id;
    }

    const response = await generalChat(message);

    // Run database operations in parallel
    // for better performance
    // Generate timestamps to
    // ensure correct chronological order
    const baseTime = Date.now();
    const userTimestamp = new Date(baseTime).toISOString();
    // AI message 1ms later
    const aiTimestamp = new Date(baseTime + 1).toISOString();

    console.log(`[TIMESTAMP-FIX] JSON Chat - User: ${userTimestamp}, ` +
      `AI: ${aiTimestamp}, Diff: ${baseTime + 1 - baseTime}ms`);

    await Promise.all([
      addMessageToChat(userId, finalChatId, {
        userId,
        message,
        timestamp: userTimestamp,
        source: "chat",
      }),
      addMessageToChat(userId, finalChatId, {
        userId: "ai",
        message: response,
        timestamp: aiTimestamp,
        source: "chat",
      }),
    ]);

    res.json({ response, chatId: finalChatId });
  } catch (err) {
    console.error("[JSON Chat Route Error]", err);
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred." });
    }
  }
}

export default router;
