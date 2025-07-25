import { Request, Response } from "express";
import * as chatModel from "../models/chat-model";
import * as messageModel from "../models/message-model";

/**
 * Creates a new message in a chat. If chatId is not provided,
 * creates a new chat.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 */
export async function createMessage(req: Request, res: Response) {
  try {
    let { userId, message, timestamp, chatId } = req.body;
    if (userId === "ai" && req.body.chatUserId) {
      userId = req.body.chatUserId;
    }
    if (!userId || !message || !timestamp) {
      res.status(400)
        .send(
          "Missing required field: userId, message, and timestamp."
        );
      return;
    }
    let currentChatId = chatId;
    let newChatCreated = false;
    if (!currentChatId) {
      const newChatTitle =
        message.substring(0, 50) + (message.length > 50 ? "..." : "");
      const chatRef = await chatModel.createChat(userId, newChatTitle);
      currentChatId = chatRef.id;
      newChatCreated = true;
    } else {
      await chatModel.updateChat(userId, currentChatId, {
        lastUpdatedAt: chatModel.getServerTimestamp(),
      });
    }
    const senderId = req.body.senderId ||
      (req.body.userId === "ai" ? "ai" : userId);
    const newMessageRef = await messageModel.addMessageToChat(
      userId,
      currentChatId,
      {
        userId: senderId,
        message,
        timestamp,
      },
    );
    const newDoc = await newMessageRef.get();
    const savedMessage = newDoc.data();
    const responseBody = {
      id: newDoc.id,
      userId: savedMessage?.userId,
      message: savedMessage?.message,
      timestamp:
        savedMessage?.timestamp ? savedMessage.timestamp : timestamp,
      ...(newChatCreated ? { newChatId: currentChatId } : {}),
    };
    res.status(201).json(responseBody);
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).send(
      "Internal Server Error: Could not create message."
    );
  }
}

/**
 * Retrieves all messages for a given user and chat.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 */
export async function getMessages(req: Request, res: Response) {
  const requestedUserId = req.params.userId;
  const requestedChatId = req.params.chatId;
  try {
    const chatMessages = await messageModel.getMessagesByChatId(
      requestedUserId,
      requestedChatId,
    );
    res.status(200).json(chatMessages);
  } catch (error) {
    console.error(
      `Service: Error fetching messages for chat ${requestedChatId}:`,
      error,
    );
    res.status(500).send(
      "Internal Server Error: Could not fetch chat messages."
    );
  }
}
