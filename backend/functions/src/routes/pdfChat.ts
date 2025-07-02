import express from "express";
import multer from "multer";
import {chatWithPdf} from "../pdfChatService";

const router = express.Router();
// TEMP: Increase file size limit for debugging (10MB)
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });

import type {Request, Response} from "express";
// import type { File as MulterFile } from "multer";


router.post(
  "/",
  upload.any(),
  async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('DEBUG req.files:', req.files);
      console.log('DEBUG req.body:', req.body);
      const prompt = req.body.prompt || "Answer questions about this PDF.";
      const files = req.files as Express.Multer.File[];
      const file = files && files.length > 0 ? files[0] : null;
      if (!file || !file.buffer) {
        res.status(400).json({error: "No PDF uploaded"});
        return;
      }
      const response = await chatWithPdf(file.buffer, prompt);
      res.json({response});
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
