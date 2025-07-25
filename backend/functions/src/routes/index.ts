// Define API routes
import {Router} from "express";
import * as chatService from "../services/chat-service";
import * as messageService from "../services/message-service";
import pdfChat from "./pdfChat";
const router = Router();

// Register the Route for chat with pdf.
router.use("/chat-with-pdf", pdfChat);

// Message Routes
router.post("/message", messageService.createMessage);
router.get(
  "/users/:userId/chats/:chatId/messages",
  messageService.getMessages,
);

// Chat Routes
router.get("/users/:userId/chats", chatService.getChats);
router.put(
  "/users/:userId/chats/:chatId/title",
  chatService.updateChatTitle,
);
// Delete a chat and all its messages
router.delete(
  "/users/:userId/chats/:chatId",
  chatService.deleteChat
);

export default router;
