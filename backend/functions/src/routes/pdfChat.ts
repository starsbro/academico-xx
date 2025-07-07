import express from "express";
import multer from "multer";
import { chatWithPdf } from "../pdfChatService";
import firebaseAdmin from "../config/firebaseAdmin.js";
import { authenticateFirebaseToken } from "../middleware/auth.js";
import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/googleai";
import type { Request, Response } from "express";
import { addMessageToChat } from "../models/message-model";

const router = express.Router();

const upload = multer({limits: {fileSize: 10 * 1024 * 1024}});

// Gemini general chat setup
const generalAi = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  model: googleAI.model("gemini-2.5-flash"),
});

/**
 * Generates a response to the given prompt using the general AI model.
 * @param {string} prompt - The user's input prompt.
 * @return {Promise<string>} A promise that resolves to the AI-generated
 * response text.
 */
async function generalChat(prompt: string): Promise<string> {
  if (!prompt || prompt.trim() === "") return "Please enter a question.";
  const response = await generalAi.generate(prompt);
  return response.text;
}

router.post(
  "/",
  authenticateFirebaseToken,
  upload.any(),
  async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("DEBUG req.files:", req.files);
      console.log("DEBUG req.body:", req.body);
      const prompt =
        req.body.prompt ||
        req.body.message ||
        "Answer questions about this PDF.";
      const files = req.files as Express.Multer.File[];
      const file = files && files.length > 0 ? files[0] : null;
      let response;
      let pdfUrl = null;
      const userId = req.user?.uid;
      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }
      // 1. Handle PDF upload if present
      if (file && file.buffer) {
        const bucket = firebaseAdmin.storage.bucket();
        const fileName = `pdfs/${userId}/${Date.now()}-${file.originalname}`;
        const fileRef = bucket.file(fileName);
        await fileRef.save(file.buffer, {
          contentType: file.mimetype,
          public: false,
        });
        const [url] = await fileRef.getSignedUrl({
          action: "read",
          expires: "03-01-2500",
        });
        pdfUrl = url;
        response = await chatWithPdf(file.buffer, prompt);
      } else {
        response = await generalChat(prompt);
      }


      // 2. Use chatId from frontend if provided, otherwise create/find one
      const db = firebaseAdmin.db;
      let chatId = req.body.chatId;
      if (!chatId) {
        // Try to find an existing chat
        const chatsSnap = await db.collection("users").doc(userId).collection("chats").orderBy("createdAt").limit(1).get();
        if (!chatsSnap.empty) {
          chatId = chatsSnap.docs[0].id;
        } else {
          // Create a new chat
          const chatRef = await db.collection("users").doc(userId).collection("chats").add({
            title: "PDF Chat",
            createdAt: new Date().toISOString(),
            lastUpdatedAt: new Date().toISOString(),
            userId,
          });
          chatId = chatRef.id;
        }
      }

      // 3. Store user message
      await addMessageToChat(userId, chatId, {
        userId,
        message: prompt,
        timestamp: new Date().toISOString(),
      });
      // 4. Store AI response
      await addMessageToChat(userId, chatId, {
        userId: "ai",
        message: response,
        timestamp: new Date().toISOString(),
      });

      // Save PDF URL in Firestore with the chat/message if available
      if (pdfUrl) {
        await firebaseAdmin.db.collection("pdfUploads").add({
          userId,
          pdfUrl,
          timestamp: new Date().toISOString(),
          prompt,
        });
      }
      res.json({ response, pdfUrl });
    } catch (err) {
      if (err instanceof Error) {
        res.status(500).json({error: err.message});
      } else {
        res.status(500).json({error: "An unknown error occurred."});
      }
    }
  }
);

export default router;
