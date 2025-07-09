// Define API routes
import {Router} from "express";
import * as chatController from "../controllers/chat-controller";
import * as messageController from "../controllers/message-controller";
import pdfChat from "./pdfChat";
const router = Router();

// Register the Route for chat with pdf.
router.use("/chat-with-pdf", pdfChat);

// Message Routes
router.post("/message", messageController.createMessage);
router.get(
  "/users/:userId/chats/:chatId/messages",
  messageController.getMessages,
);

// Chat Routes
router.get("/users/:userId/chats", chatController.getChats);
router.put(
  "/users/:userId/chats/:chatId/title",
  chatController.updateChatTitle,
);

export default router;
