import { Request, Response } from "express";
import * as chatModel from "../models/chat-model";
import * as messageModel from "../models/message-model";
import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

// // eslint-disable-next-line @typescript-eslint/no-empty-function
// console.log = function() {};

/**
 * Handles sending a message. Creates a new chat if no chatId is provided.
 * @param {express.Request} req
 * @param {express.Response} res
 * @return {void}
 */
export async function createMessage(req: Request, res: Response) {
  // console.log("Crontroller: Creating message");
  try {
    const { userId, message, timestamp, chatId } = req.body;
    // console.log("chatId is: ", chatId);

    if (!userId || !message || !timestamp) {
      res
        .status(400)
        .send("Missing required field: userId, message, and timestamp.");
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
      // console.log(`Controller: New chat created with ID: ${currentChatId}`);
    } else {
      // If message is for existing chat, update its lostUpdatedAt timestamp
      await chatModel.updateChat(userId, currentChatId, {
        lastUpdatedAt: FieldValue.serverTimestamp(),
      });
      // console.log(`Controller:
      // Using existing chat with ID: ${currentChatId}`);
    }

    const newMessageRef = await messageModel.addMessageToChat(
      userId,
      currentChatId,
      { userId, message, timestamp },
    );

    const newDoc = await newMessageRef.get();
    const savedMessage = newDoc.data();

    const responseBody: {
      id: string;
      userId?: string;
      message?: string;
      timestamp: string;
      newChatId?: string;
    } = {
      id: newDoc.id,
      userId: savedMessage?.userId,
      message: savedMessage?.message,
      timestamp: savedMessage?.timestamp
        ? (savedMessage.timestamp as admin.firestore.Timestamp)
            .toDate()
            .toISOString()
        : new Date().toISOString(),
    };

    if (newChatCreated) {
      responseBody.newChatId = currentChatId;
    }

    res.status(201).json(responseBody);
    // console.log("Controller: Message send successfully.");
  } catch (error) {
    console.log("Controller: Error sending message:", error);
    res.status(500).send("Internal Server Error: Could not send message.");
  }
}

/**
 * Handles fetching all messages for a specific chat.
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function getMessages(req: Request, res: Response) {
  const requestedUserId = req.params.userId;
  const requestedChatId = req.params.chatId;
  // console.log(`Controller: Fetching messages for chat ${requestedChatId}
  //       of user ${requestedUserId}`);

  try {
    const chatMessages = await messageModel.getMessagesByChatId(
      requestedUserId,
      requestedChatId,
    );
    res.status(200).json(chatMessages);
    // console.log(`Controller: Fetched
    //     ${chatMessages.length} messages for chat ${requestedChatId}`);
  } catch (error) {
    console.error(
      `Controller: Error fetching messages 
        for chat ${requestedChatId}:`,
      error,
    );
    res.status(500).send(`Internal Server Error: 
      Could not fetch chat messages.`);
  }
}
